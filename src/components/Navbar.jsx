import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import logo from "../images/logo2.png";
import { getCategories } from "../services/categoryService";
import { getCartCount, clearCart } from "../services/cartService";

const Navbar = () => {
  const [categories, setCategories] = useState([]);
  const [userName, setUserName] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('userName') : null
  );
  const [cartCount, setCartCount] = useState(
    typeof window !== 'undefined' ? getCartCount() : 0
  );

  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      // Clear local cart when user logs out to avoid leaking items between accounts
      try { clearCart(); } catch (_) {}
      setUserName(null);
      setShowUserMenu(false);
      window.dispatchEvent(new Event('authChanged'));
      window.location.href = '/';
    } catch (_) {
      setUserName(null);
      setShowUserMenu(false);
    }
  };

  useEffect(() => {
    getCategories()
      .then(data => setCategories(data))
      .catch(err => console.error("Error cargando categorías:", err));
  }, []);

  useEffect(() => {
    const onAuthChange = () => {
      setUserName(localStorage.getItem('userName'));
      setShowUserMenu(false);
    };

    const onCartChange = () => {
      const v = parseInt(localStorage.getItem('cartCount') || '0', 10);
      setCartCount(Number.isNaN(v) ? 0 : v);
    };

    const handleDocClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };

    window.addEventListener('authChanged', onAuthChange);
    window.addEventListener('cartChanged', onCartChange);
    document.addEventListener('click', handleDocClick);

    return () => {
      window.removeEventListener('authChanged', onAuthChange);
      window.removeEventListener('cartChanged', onCartChange);
      document.removeEventListener('click', handleDocClick);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">

        {/* LOGO */}
        <Link className="navbar-brand" to="/">
          <img
            src={logo}
            alt="Level UP Gamer"
            className="logo-brand"
          />
        </Link>

        {/* Botón Responsive */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarsExample"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Contenido */}
        <div className="collapse navbar-collapse" id="navbarsExample">

          <ul className="navbar-nav me-auto mb-2 mb-lg-0">

            {/* HOME */}
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>

            {/* CATEGORÍAS DINÁMICAS */}
            {categories.map((cat) => (
              <li className="nav-item" key={cat.id}>
                <Link className="nav-link" to={`/categoria/${cat.id}`}>
                  {cat.name}
                </Link>
              </li>
            ))}

            {/* CONTACTO */}
            <li className="nav-item">
              <Link className="nav-link" to="/contacto">Contacto</Link>
            </li>

          </ul>

          {/* ÍCONOS DERECHA */}
          <div className="d-flex align-items-center">

            {/* Login o Nombre de usuario */}
            {userName ? (
              <div className="nav-user-wrapper" ref={userMenuRef}>
                <button
                  className="nav-user"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setShowUserMenu((s) => !s);
                  }}
                  aria-haspopup="true"
                  aria-expanded={showUserMenu}
                >
                  <i className="fa-solid fa-user me-1"></i>
                  <span className="nav-username">{userName}</span>
                  <i className={`fas fa-caret-down ms-1 ${showUserMenu ? 'open' : ''}`}></i>
                </button>

                {showUserMenu && (
                  <div className="nav-user-dropdown">
                    <div className="dropdown-item user-name">{userName}</div>
                    <button className="dropdown-item logout-btn" onClick={handleLogout}>
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link className="nav-link" to="/inicio-sesion">
                <i className="fa-solid fa-user me-1"></i> Iniciar Sesión
              </Link>
            )}

            {/* Carrito */}
            <Link className="nav-link position-relative cart-link" to="/carro-compras">
              <i className="fas fa-shopping-cart cart-icon"></i>
              <span className="cart-count">{cartCount || 0}</span>
            </Link>

          </div>

        </div>

      </div>
    </nav>
  );
};

export default Navbar;
