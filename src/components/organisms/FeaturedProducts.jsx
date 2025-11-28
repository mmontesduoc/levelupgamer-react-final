import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Products.css';
import nintendoImg from '../../images/mundonintendo.jpg';
import playImg from '../../images/mundoplay.jpg';
import pcImg from '../../images/setup.jpg';

const FeaturedProducts = () => {
  const products = [
    {
      id: 1,
      image: nintendoImg,
      title: "Universo Nintendo",
      description: "Descubre la magia de las consolas, juegos y accesorios que han marcado generaciones. Desde aventuras legendarias hasta innovadoras formas de jugar, Nintendo ofrece diversión para todos con experiencias únicas e inolvidables.",
      link: "/nintendo"
    },
    {
      id: 2,
      image: playImg,
      title: "Mundo PlayStation",
      description: "Descubre la emoción de los videojuegos con PlayStation, donde cada consola, juego y accesorio está diseñado para brindarte la mejor experiencia. Vive aventuras épicas, compite en línea con amigos y disfruta de gráficos de última generación.",
      link: "/play-station"
    },
    {
      id: 3,
      image: pcImg,
      title: "PC de Escritorio y Gamer",
      description: "Los PC de escritorio para oficina brindan estabilidad y eficiencia en las tareas diarias, mientras que los PC gamer ofrecen potencia, velocidad y gráficos de alta calidad para una experiencia inmersiva. Disfruta de nuestro stock disponible",
      link: "/pc"
    }
  ];

  return (
    <section className="game-section">
      <div className="container">
        <h2 className="text-center mb-5">Productos Destacados</h2>
        <div className="row">
          {products.map(product => (
            <div key={product.id} className="col-md-4 mb-4">
              <div className="card h-100">
                <img src={product.image} className="card-img-top" alt={product.title} />
                <div className="card-body">
                  <h5 className="card-title">{product.title}</h5>
                  <p className="card-text">{product.description}</p>
                  <Link to={product.link} className="btn-principal btn-primary">
                    Ver más
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
