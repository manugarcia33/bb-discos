import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Camera, ArrowLeft } from "lucide-react";
import { getProductById } from "../services/api";

interface Product {
  id: number;
  title: string;
  artist: string;
  price: number;
  installments: number;
  genre: string;
  category: string;
  stock: number;
  year: number | null;
  imageUrl: string | null;
  isFeatured: boolean;
  isOnSale: boolean;
  discountPercentage: number;
  description?: string | null;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductById(parseInt(id));
        setProduct(data);
        setError(false);
      } catch (err) {
        console.error("Error loading product:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <p>Cargando...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-5 text-center">
        <p>Producto no encontrado</p>
        <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="#" onClick={() => navigate("/")}>
              Inicio
            </a>
          </li>
          <li className="breadcrumb-item">
            <a href="#" onClick={() => navigate("/productos")}>
              Productos
            </a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {product.title}
          </li>
        </ol>
      </nav>

      {/* Botón Volver */}
      <button
        className="btn btn-link text-decoration-none ps-0 mb-3"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={20} className="me-2" />
        Volver
      </button>

      <div className="row">
        {/* Imagen del producto */}
        <div className="col-md-6 mb-4">
          <div
            className="product-image-large"
            style={{
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              height: "500px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.title}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />
            ) : (
              <Camera size={120} color="#adb5bd" />
            )}
          </div>
        </div>

        {/* Información del producto */}
        <div className="col-md-6">
          <h1 className="h2 fw-bold mb-2">{product.title}</h1>
          <h2 className="h4 text-muted mb-4">{product.artist}</h2>

          <div className="mb-4">
            <div className="h1 fw-bold" style={{ color: "#d63384" }}>
              ${product.price.toLocaleString("es-AR")}
            </div>
            <p className="text-muted mb-0">
              💳 {3} cuotas sin interés de $
              {product.installments.toLocaleString("es-AR")}
            </p>
            {product.isOnSale && product.discountPercentage > 0 && (
              <p className="text-success fw-bold">
                💰 {product.discountPercentage}% de descuento pagando con
                Transferencia o depósito
              </p>
            )}
          </div>

          {/* Información adicional */}
          <div className="mb-4">
            <h5 className="fw-bold">Descripción:</h5>
            <div className="bg-light p-3 rounded">
              {product.description && (
                <p className="mb-2">{product.description}</p>
              )}
              <p className="mb-1">
                <strong>Label:</strong> Información no disponible
              </p>
              <p className="mb-1">
                <strong>País de la edición:</strong> Argentina
              </p>
              <p className="mb-1">
                <strong>Tapa:</strong> Excelente estado
              </p>
              <p className="mb-0">
                <strong>Disco:</strong> Excelente estado
              </p>
            </div>
          </div>

          {/* Stock */}
          {product.stock > 0 ? (
            <div className="alert alert-success">
              ✅ <strong>En stock</strong> ({product.stock} disponible
              {product.stock > 1 ? "s" : ""})
            </div>
          ) : (
            <div className="alert alert-warning">
              ⚠️ <strong>¡No te lo pierdas, es el último!</strong>
            </div>
          )}

          {/* Botón de compra */}
          <div className="d-grid gap-2">
            <button className="btn btn-dark btn-lg">AGREGAR AL CARRITO</button>
          </div>

          {/* Envío gratis */}
          <div className="mt-3 text-center">
            <p className="text-muted mb-0">
              🚚 <strong>Envío gratis</strong> superando los $100.000,00
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
