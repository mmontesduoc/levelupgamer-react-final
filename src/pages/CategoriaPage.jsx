import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { addItem } from "../services/cartService";

import "../styles/CategoriaPage.css";
import { getCategories } from "../services/categoryService";


function CategoriaPage() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(false); // reinicia animación
    fetch(`http://localhost:8080/api/products/category/${id}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setTimeout(() => setAnimate(true), 50); // activa animación
      });
  }, [id]);



  useEffect(() => {
    fetch(`http://localhost:8080/api/products/category/${id}`)
      .then(res => res.json())
      .then(data => setProducts(data));
  }, [id]);
  // Obtener nombre de la categoría
  useEffect(() => {
    getCategories().then(cats => {
      const c = cats.find(cat => cat.id == id);
      if (c) setCategoryName(c.name);
    });
  }, [id]);

  return (
    <div className="container mt-4">
      <h2 className="titulo-categoria">
        Descubre lo mejor en {categoryName || "la categoría"}
      </h2>

      {/* Nuevo container de cards */}
      <div className={`cards-container ${animate ? "fade-in" : ""}`}>

        {products.map(p => (
          <div className="card-producto" key={p.id}>
            <img
              src={`/images/${p.id}.jpg`}
              alt={p.name}
              onError={e => e.target.src = "https://via.placeholder.com/300"}
            />

            <div className="p-2">
              <h5>{p.name}</h5>
              <p className="descripcion">{p.description}</p>
              <p className="precio">${p.price}</p>

              <button className="btn btn-primary" onClick={() => addItem(p, 1)}>Agregar al carrito</button>
            </div>
          </div>
        ))}
      </div>
    </div>

  );
}

export default CategoriaPage;
