import { useState } from 'react';
import { Search, User, ShoppingCart, ChevronDown, Camera, ArrowRight } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('HOME');

  // Datos de ejemplo para los productos
  const products = [
    {
      id: 1,
      title: 'Abbey Road',
      artist: 'The Beatles',
      price: 30000,
      installments: 10000
    },
    {
      id: 2,
      title: 'The Dark Side of the Moon',
      artist: 'Pink Floyd',
      price: 35000,
      installments: 11667
    },
    {
      id: 3,
      title: 'Rumours',
      artist: 'Fleetwood Mac',
      price: 28000,
      installments: 9333
    },
    {
      id: 4,
      title: 'Thriller',
      artist: 'Michael Jackson',
      price: 32000,
      installments: 10667
    },
    {
      id: 5,
      title: 'Back in Black',
      artist: 'AC/DC',
      price: 29000,
      installments: 9667
    },
    {
      id: 6,
      title: 'The Wall',
      artist: 'Pink Floyd',
      price: 38000,
      installments: 12667
    }
  ];

  return (
    <div className="app-container">
      {/* HEADER */}
      <header className="header-bbdiscos">
        <div className="container">
          {/* Top Section: Logo, Search, Icons */}
          <div className="row align-items-center py-3">
            {/* Logo */}
            <div className="col-6 col-md-3">
              <h1 className="logo-text mb-0">BB DISCOS</h1>
            </div>

            {/* Search Bar */}
            <div className="col-12 col-md-6 order-3 order-md-2 mt-3 mt-md-0">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control search-input rounded-pill"
                  placeholder="Buscar vinilos, artistas..."
                  aria-label="Buscar"
                />
                <span className="input-group-text bg-white border-0 rounded-pill">
                  <Search size={20} />
                </span>
              </div>
            </div>

            {/* Icons */}
            <div className="col-6 col-md-3 order-2 order-md-3 d-flex justify-content-end gap-3">
              <button className="icon-btn" aria-label="Mi Cuenta">
                <User size={24} />
              </button>
              <button className="icon-btn" aria-label="Carrito">
                <ShoppingCart size={24} />
                <span className="cart-badge">0</span>
              </button>
            </div>
          </div>

          {/* Navigation Bar */}
          <nav className="navbar navbar-expand-lg p-0">
            <div className="container-fluid px-0">
              <ul className="nav justify-content-center w-100">
                <li className="nav-item">
                  <a 
                    className="nav-link" 
                    onClick={() => setCurrentView('HOME')}
                  >
                    Inicio
                  </a>
                </li>
                <li className="nav-item">
                  <a 
                    className="nav-link d-flex align-items-center gap-1" 
                    onClick={() => setCurrentView('PRODUCTS')}
                  >
                    Productos
                    <ChevronDown size={16} />
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link">
                    Contacto
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow-1">
        {/* HOME VIEW */}
        {currentView === 'HOME' && (
          <div className="hero-section">
            <div className="container">
              <div className="row align-items-center">
                {/* Hero Text */}
                <div className="col-lg-6 col-12 mb-4 mb-lg-0">
                  <h2 className="hero-title">Recién llegados</h2>
                  <p className="hero-subtitle">
                    Vinilos de época en perfecto estado listos para girar.
                  </p>
                  <button 
                    className="btn btn-lg btn-cta"
                    onClick={() => setCurrentView('PRODUCTS')}
                  >
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
        )}

        {/* PRODUCTS VIEW */}
        {currentView === 'PRODUCTS' && (
          <div className="products-section">
            <div className="container">
              {/* Breadcrumb */}
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a onClick={() => setCurrentView('HOME')}>Inicio</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Productos
                  </li>
                </ol>
              </nav>

              <div className="row">
                {/* Sidebar - Filters */}
                <div className="col-lg-3 col-md-4 col-12">
                  <div className="sidebar-filters">
                    {/* Categories */}
                    <div className="mb-4">
                      <h5 className="filter-title">Categorías</h5>
                      <ul className="category-list">
                        <li>Rock Clásico</li>
                        <li>Pop</li>
                        <li>Jazz</li>
                        <li>Blues</li>
                        <li>Metal</li>
                        <li>Electrónica</li>
                      </ul>
                    </div>

                    {/* Price Filter */}
                    <div>
                      <h5 className="filter-title">Filtrar por Precio</h5>
                      <div className="mb-2">
                        <label className="form-label small">Desde</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="$0"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label small">Hasta</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="$100,000"
                        />
                      </div>
                      <button className="price-filter-btn w-100">
                        Aplicar
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Product Grid */}
                <div className="col-lg-9 col-md-8 col-12">
                  <div className="row">
                    {products.map((product) => (
                      <div 
                        key={product.id} 
                        className="col-lg-4 col-md-6 col-12"
                      >
                        <div className="card product-card">
                          {/* Product Image Placeholder */}
                          <div className="product-image-placeholder">
                            <Camera size={48} color="#adb5bd" />
                          </div>

                          {/* Product Info */}
                          <div className="card-body">
                            <h6 className="product-title">{product.title}</h6>
                            <p className="product-artist">{product.artist}</p>
                            <div className="product-price">
                              ${product.price.toLocaleString('es-AR')}
                            </div>
                            <p className="product-installments">
                              3 cuotas sin interés de ${product.installments.toLocaleString('es-AR')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER (Optional) */}
      <footer className="py-4 mt-5" style={{ backgroundColor: '#264653', color: 'white' }}>
        <div className="container text-center">
          <p className="mb-0">© 2026 BB DISCOS - Todos los derechos reservados</p>
        </div>
      </footer>
    </div>
  );
}

export default App;