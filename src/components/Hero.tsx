interface HeroProps {
  onViewCatalog: () => void;
}

export default function Hero({ onViewCatalog }: HeroProps) {
  return (
    <div className="hero-section">
      <div className="container">
        <div className="row align-items-center">
          {/* Hero Text */}
          <div className="col-lg-6 col-12 mb-4 mb-lg-0">
            <h2 className="hero-title">Recién llegados</h2>
            <p className="hero-subtitle">
              Vinilos de época en perfecto estado listos para girar.
            </p>
            <button className="btn btn-lg btn-cta" onClick={onViewCatalog}>
              Ver catálogo
            </button>
          </div>

          {/* Hero Image */}
          <div className="col-lg-6 col-12">
            <img
              src="https://images.unsplash.com/photo-1603048588665-791ca8eff207?w=800&h=600&fit=crop"
              alt="Vintage turntable and vinyl records"
              className="img-fluid hero-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
