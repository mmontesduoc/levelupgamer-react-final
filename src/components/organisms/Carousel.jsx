import React from 'react';
import '../../styles/Carousel.css';
import juegoscod from '../../images/juegoscod.jpg';
import gamingSetup from '../../images/ultimate-gaming-setup.jpg';
import consolas from '../../images/gamer.jpg';
const Carousel = () => {
  return (
    <div id="mainCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
      <div className="carousel-indicators">
        <button 
          type="button" 
          data-bs-target="#mainCarousel" 
          data-bs-slide-to="0" 
          className="active" 
          aria-current="true" 
          aria-label="Slide 1"
        ></button>
        <button 
          type="button" 
          data-bs-target="#mainCarousel" 
          data-bs-slide-to="1" 
          aria-label="Slide 2"
        ></button>
        <button 
          type="button" 
          data-bs-target="#mainCarousel" 
          data-bs-slide-to="2" 
          aria-label="Slide 3"
        ></button>
      </div>
      
      <div className="carousel-inner">
        <div className="carousel-item active" data-bs-interval="3000">
          <img src={juegoscod} className="d-block w-100" alt="Videojuegos" />
          <div className="carousel-caption d-none d-md-block">
            <h5>Los mejores videojuegos</h5>
            <p>Encuentra los títulos más populares del momento.</p>
          </div>
        </div>
        
        <div className="carousel-item" data-bs-interval="3000">
          <img src={gamingSetup} className="d-block w-100" alt="Gaming Setup" />
          <div className="carousel-caption d-none d-md-block">
            <h5>Equipamiento gaming</h5>
            <p>Mejora tu setup con nuestros productos seleccionados.</p>
          </div>
        </div>
        
        <div className="carousel-item" data-bs-interval="3000">
          <img src={consolas} className="d-block w-100" alt="Consolas" />
          <div className="carousel-caption d-none d-md-block">
            <h5>Últimas consolas</h5>
            <p>Descubre las novedades en el mundo de las consolas.</p>
          </div>
        </div>
      </div>
      
      <button className="carousel-control-prev" type="button" data-bs-target="#mainCarousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Anterior</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#mainCarousel" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Siguiente</span>
      </button>
    </div>
  );
};

export default Carousel;
