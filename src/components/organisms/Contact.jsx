import React from "react";
import "../../styles/contacts.css";
import logoImg2 from "../../images/logo2.png";

const Contact = () => {
  return (
    <div>
      {/* Formulario de contacto */}
      <div className="container-contacto">
        <div className="contact-wrapper">
          {/* Formulario */}
          <div className="form-section">
            <form
              id="contactForm"
              method="post"
              acceptCharset="utf-8"
              encType="multipart/form-data"
            >
              <div className="form-group">
                <input
                  type="text"
                  name="fld_vtcmclientespotencialesname"
                  placeholder="Nombre *"
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="email"
                  id="correo"
                  name="fld_correoelectrnico"
                  placeholder="Correo electrónico *"
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="fld_telefono"
                  placeholder="Teléfono *"
                />
              </div>

              <div className="form-group" style={{ display: "none" }}>
                <select name="cf_vtcmclientespotenciales_estado">
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>

              <div className="form-group">
                <textarea name="fld_mensaje" placeholder="Mensaje *"></textarea>
              </div>

              <div className="captcha-container">
                {/* Google reCAPTCHA */}
                <div
                  className="g-recaptcha"
                  data-sitekey="6LcmdSATAAAAAGWw734vGo0AXQwuxJS7RmDZA_Fe"
                ></div>
                <button type="submit">Enviar</button>
              </div>
            </form>
          </div>

          {/* Información de contacto */}
          <div className="info-section">
            <img
              src={logoImg2}
              alt="Level UP Gamer"
              className="logo-contacto"
            />
            <div className="contact-info">
              <h2>Contacto</h2>
              <br />
              <p>
                <i className="fa-solid fa-phone"></i>
                <a href="tel:+56222222222"> +562 2222 2222</a>
              </p>
              <p>
                <i className="fa-solid fa-envelope"></i>
                <a
                  href="https://mail.google.com/mail/?view=cm&to=marc.montes@duocuc.cl"
                  target="_blank"
                  rel="noreferrer"
                >
                  {" "}
                  marc.montes@duocuc.cl
                </a>
              </p>
              <p>
                <i className="fa-solid fa-envelope"></i>
                <a
                  href="https://mail.google.com/mail/?view=cm&to=ma.hidalgoo@duocuc.cl"
                  target="_blank"
                  rel="noreferrer"
                >
                  {" "}
                  ma.hidalgoo@duocuc.cl
                </a>
              </p>
              <p>
                <i className="fa-solid fa-location-dot"></i>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Antonio+Varas+%23666+Providencia"
                  target="_blank"
                  rel="noreferrer"
                >
                  {" "}
                  Antonio Varas #666 Providencia
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mapa */}
      <div className="map-container">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3359.9700425314977!2d-70.61808302414225!3d-33.433099896624086!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662cf7b9566d44f%3A0x5c1618bbd02ec418!2sAntonio%20Varas%20666%2C%207500961%20Providencia%2C%20Regi%C3%B3n%20Metropolitana!5e1!3m2!1ses!2scl!4v1757081584206!5m2!1ses!2scl"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Mapa de ubicación"
        ></iframe>
      </div>
    </div>
  );
};

export default Contact;
