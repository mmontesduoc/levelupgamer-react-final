import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="mainfooter" role="contentinfo">
      <div className="footer-middle">
        <div className="container">
          <div className="row">
            <div className="col-md-3 col-sm-6">
              <div className="footer-pad">
                <h4>Contacto</h4>
                <ul className="list-unstyled">
                  <li>
                    <i className="fa-solid fa-phone"></i>
                    <a href="tel:+56222222222"> +562 2222 2222</a>
                  </li>
                  <li>
                    <i className="fa-solid fa-envelope"></i>
                    <a href="https://mail.google.com/mail/?view=cm&to=marc.montes@duocuc.cl" target="_blank" rel="noopener noreferrer">
                      marc.montes@duocuc.cl
                    </a>
                  </li>
                  <li>
                    <i className="fa-solid fa-envelope"></i>
                    <a href="https://mail.google.com/mail/?view=cm&to=ma.hidalgoo@duocuc.cl" target="_blank" rel="noopener noreferrer">
                      ma.hidalgoo@duocuc.cl
                    </a>
                  </li>
                  <li>
                    <i className="fa-solid fa-location-dot"></i>
                    <a href="https://www.google.com/maps/search/?api=1&query=Antonio+Varas+%23666+Providencia" target="_blank" rel="noopener noreferrer">
                      Antonio Varas #666 Providencia
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-md-3 col-sm-6">
              <div className="footer-pad">
                <h4>Quienes Somos</h4>
                <ul className="list-unstyled">
                  <li><a href="#">Visión</a></li>
                  <li><a href="#">Misión</a></li>
                  <li><a href="#">Valores</a></li>
                  <li><a href="#">Historia</a></li>
                </ul>
              </div>
            </div>

            <div className="col-md-3 col-sm-6">
              <div className="footer-pad">
                <h4>Nuestras Politicas</h4>
                <ul className="list-unstyled">
                  <li><a href="#">Privacidad de Datos</a></li>
                  <li><a href="#">Derechos del Consumidor</a></li>
                  <li><a href="#">Politica de Devolución y reembolso</a></li>
                  <li><a href="#">Terminos y Condiciones</a></li>
                </ul>
              </div>
            </div>

            <div className="col-md-3">
              <h4>Siguenos</h4>
              <ul className="social-network social-circle">
                <li>
                  <a href="https://www.facebook.com/?locale=es_LA" target="_blank" rel="noopener noreferrer" className="icoFacebook" title="Facebook">
                    <i className="fa-brands fa-facebook"></i>
                  </a>
                </li>
                <li>
                  <a href="https://es.linkedin.com/learning/" target="_blank" rel="noopener noreferrer" className="icoLinkedin" title="Linkedin">
                    <i className="fa-brands fa-linkedin"></i>
                  </a>
                </li>
                <li>
                  <a href="https://x.com/?lang=es" target="_blank" rel="noopener noreferrer" className="icox" title="x">
                    <i className="fa-brands fa-x-twitter"></i>
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="icoInsta" title="insta">
                    <i className="fa-brands fa-instagram"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 copy">
              <p className="text-center">&copy; 2025 - Level Up Gamer.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
