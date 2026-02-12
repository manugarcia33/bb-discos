import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <div className="hero-section">
      <div className="container">
        <div className="row align-items-center">
          {/* Hero Text */}
          <div className="col-lg-6 col-12 mb-4 mb-lg-0">
            <h1 className="hero-main-title">Donde la música cobra vida</h1>
            <h2 className="hero-title">Vinilos que cuentan historias</h2>
            <p className="hero-subtitle">
              Descubrí nuestra colección de vinilos clásicos y ediciones
              especiales. Cada disco es un viaje al pasado, listo para girar en
              tu tocadiscos.
            </p>
            <Link to="/productos" className="btn btn-lg btn-cta">
              Explorar catálogo
            </Link>
          </div>

          {/* Hero Turntable */}
          <div className="col-lg-6 col-12">
            <div className="turntable-container">
              <div className="turntable">
                <div className="turntable-base"></div>
                <div className="vinyl-record">
                  <div className="vinyl-label"></div>
                  <div className="vinyl-grooves"></div>
                </div>
                <div className="turntable-arm"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
