// Cart service using localStorage + DOM event for cross-component updates
const CART_COUNT_KEY = 'cartCount';
const CART_ITEMS_KEY = 'cartItems';

const safeParse = (v) => {
  try {
    return JSON.parse(v);
  } catch (_) {
    return null;
  }
};

const saveItems = (items) => {
  try {
    localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(items));
    // also update derived count for legacy consumers / UI badge
    const count = items.reduce((s, it) => s + (it.qty || 0), 0);
    localStorage.setItem(CART_COUNT_KEY, String(count));
    window.dispatchEvent(new Event('cartChanged'));
  } catch (_) {}
};

const _ensureToastContainer = () => {
  try {
    if (typeof document === 'undefined') return null;
    let c = document.getElementById('app-toast-container');
    if (!c) {
      c = document.createElement('div');
      c.id = 'app-toast-container';
      Object.assign(c.style, {
        position: 'fixed',
        top: '16px',
        right: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        zIndex: 9999,
        pointerEvents: 'none',
      });
      document.body.appendChild(c);
    }
    return c;
  } catch (_) {
    return null;
  }
};

const _showTransientMessage = (msg = '', duration = 2000) => {
  try {
    const container = _ensureToastContainer();
    if (!container) return;

    const el = document.createElement('div');
    el.textContent = msg;
    el.setAttribute('role', 'status');
    Object.assign(el.style, {
      pointerEvents: 'auto',
      minWidth: '200px',
      maxWidth: '320px',
      padding: '10px 14px',
      borderRadius: '8px',
      color: '#fff',
      background: 'linear-gradient(90deg,#28a745,#20c997)',
      boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
      opacity: '0',
      transform: 'translateY(-6px)',
      transition: 'opacity 200ms ease, transform 200ms ease',
    });

    container.appendChild(el);

    // trigger enter
    requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });

    // remove after duration
    setTimeout(() => {
      try {
        el.style.opacity = '0';
        el.style.transform = 'translateY(-6px)';
        setTimeout(() => {
          try { container.removeChild(el); } catch (_) {}
        }, 220);
      } catch (_) {}
    }, duration);
  } catch (_) {}
};

const notifyItemAdded = (msg = 'Se agrego un producto al carrito') => {
  try {
    // backward-compatible event consumers can still listen for 'cartChanged'
    window.dispatchEvent(new CustomEvent('cartItemAdded', { detail: { message: msg } }));
    // non-blocking transient message (no accept button), auto-hide after 2s
    if (typeof window !== 'undefined') {
      _showTransientMessage(msg, 1000);
    }
  } catch (_) {}
};

const notifyCartCleared = (msg = 'Se vacio el carrito') => {
  try {
    window.dispatchEvent(new CustomEvent('cartCleared', { detail: { message: msg } }));
    if (typeof window !== 'undefined') {
      _showTransientMessage(msg, 1000);
    }
  } catch (_) {}
};

export const getItems = () => {
  try {
    const raw = localStorage.getItem(CART_ITEMS_KEY);
    const parsed = safeParse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
};

export const setItems = (items) => {
  saveItems(Array.isArray(items) ? items : []);
};

export const getCartCount = () => {
  const items = getItems();
  return items.reduce((s, it) => s + (it.qty || 0), 0);
};

export const clearCart = () => {
  try {
    localStorage.removeItem(CART_ITEMS_KEY);
    localStorage.removeItem(CART_COUNT_KEY);
    window.dispatchEvent(new Event('cartChanged'));
    notifyCartCleared();
  } catch (_) {}
};

export const addItem = async (product, qty = 1) => {
  if (!product || !product.id) return getCartCount();

  const items = getItems();
  const idx = items.findIndex(i => String(i.id) === String(product.id));

  // If item already exists, just increment qty
  if (idx >= 0) {
    items[idx].qty = (items[idx].qty || 0) + qty;
    saveItems(items);
    notifyItemAdded();
    return getCartCount();
  }

  // If product metadata is provided (name/price/img), add as new item
  const hasMeta = product.name || product.nombre || product.title || product.price || product.precio || product.img || product.imagen || product.image;
  if (hasMeta) {
    const item = {
      id: product.id,
      name: product.name || product.nombre || product.title || '',
      price: typeof product.price === 'number' ? product.price : (product.precio || 0),
      qty: qty,
      img: product.img || product.imagen || product.image || null,
    };
    items.push(item);
    saveItems(items);
    notifyItemAdded();
    return getCartCount();
  }

  // No metadata and item did not exist: do not create a placeholder item.
  // Attempt to fetch metadata from backend if available
  try {
    // try backend used elsewhere in project
    const res = await fetch(`http://localhost:8080/api/products/${product.id}`);
    if (!res.ok) throw new Error('Product fetch failed');
    const data = await res.json();
    const item = {
      id: data.id || product.id,
      name: data.name || data.nombre || data.title || '',
      price: typeof data.price === 'number' ? data.price : (data.precio || 0),
      qty: qty,
      img: data.img || data.imagen || data.image || null,
    };
    items.push(item);
    saveItems(items);
    notifyItemAdded();
    return getCartCount();
  } catch (err) {
    // If fetch fails, do not add the item; keep count unchanged
    // Log for debugging
    // console.warn('addItem: unable to fetch product metadata', err);
    return getCartCount();
  }
};

export const removeItem = (productId) => {
  const items = getItems().filter(i => String(i.id) !== String(productId));
  setItems(items);
  return getCartCount();
};

export const updateQty = (productId, qty) => {
  const items = getItems();
  const idx = items.findIndex(i => String(i.id) === String(productId));
  if (idx >= 0) {
    if (qty <= 0) {
      items.splice(idx, 1);
    } else {
      items[idx].qty = qty;
    }
    setItems(items);
  }
  return getCartCount();
};

export default {
  getItems,
  setItems,
  getCartCount,
  clearCart,
  addItem,
  removeItem,
  updateQty,
};
