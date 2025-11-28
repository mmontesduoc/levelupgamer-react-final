import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./styles/App.css";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

import Home from "./pages/Home.jsx";
import ContactoPage from "./pages/contacto.jsx";
import InicioSesion from "./pages/InicioSesion.jsx";
import Registro from "./pages/Registro";
import CarroCompras from "./pages/CarroCompras.jsx";

// Página dinámica por categoría
import CategoriaPage from "./pages/CategoriaPage.jsx";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Routes>

            {/* Home */}
            <Route path="/" element={<Home />} />

            {/* Ruta dinámica: muestra productos según categoría (desde Oracle) */}
            <Route path="/categoria/:id" element={<CategoriaPage />} />

            {/* Páginas fijas */}
            <Route path="/contacto" element={<ContactoPage />} />
            <Route path="/inicio-sesion" element={<InicioSesion />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/carro-compras" element={<CarroCompras />} />

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
