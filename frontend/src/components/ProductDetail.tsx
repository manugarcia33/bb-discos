import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Camera, ArrowLeft } from "lucide-react";
import { getProductById, getProductImages } from "../services/api";

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

interface ProductImage {
  id: number;
  image_url: string;
  is_main: boolean;
  alt_text: string | null;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const [data, imgs] = await Promise.all([
          getProductById(parseInt(id)),
          getProductImages(parseInt(id)),
        ]);
        setProduct(data);
        setImages(imgs);
        // Imagen principal: la marcada como main, o la primera, o la del producto
        const mainImg =
          imgs.find((i) => i.is_main)?.image_url ||
          imgs[0]?.image_url ||
          data.imageUrl ||
          null;
        setSelectedImage(mainImg);
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
          {/* Imagen principal */}
          <div
            style={{
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              height: "480px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              marginBottom: "0.75rem",
            }}
          >
            {selectedImage ? (
              <img
                src={selectedImage}
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

          {/* Thumbnails */}
          {images.length > 1 && (
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.image_url)}
                  style={{
                    padding: 0,
                    border:
                      selectedImage === img.image_url
                        ? "2px solid var(--color-accent)"
                        : "2px solid transparent",
                    borderRadius: "6px",
                    overflow: "hidden",
                    width: "72px",
                    height: "72px",
                    cursor: "pointer",
                    background: "#f0f0f0",
                    flexShrink: 0,
                    transition: "border-color 0.2s",
                  }}
                >
                  <img
                    src={img.image_url}
                    alt={img.alt_text || product.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="col-md-6">
          <h1 className="h2 fw-bold mb-2">{product.title}</h1>
          <h2 className="h4 text-muted mb-4">{product.artist}</h2>

          <div className="mb-4">
            {product.isOnSale && product.discountPercentage > 0 ? (
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <div
                  className="h1 fw-bold mb-0"
                  style={{ color: "var(--color-accent)" }}
                >
                  ${product.price.toLocaleString("es-AR")}
                </div>
                <span
                  className="text-muted"
                  style={{
                    textDecoration: "line-through",
                    fontSize: "1.25rem",
                  }}
                >
                  $
                  {Math.round(
                    product.price / (1 - product.discountPercentage / 100),
                  ).toLocaleString("es-AR")}
                </span>
                <span
                  className="offer-badge"
                  style={{ position: "static", boxShadow: "none" }}
                >
                  -{product.discountPercentage}%
                </span>
              </div>
            ) : (
              <div
                className="h1 fw-bold"
                style={{ color: "var(--color-accent)" }}
              >
                ${product.price.toLocaleString("es-AR")}
              </div>
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
          {product.stock > 0 && (
            <div className="alert alert-success">
              ✅ <strong>En stock</strong> ({product.stock} disponible
              {product.stock > 1 ? "s" : ""})
            </div>
          )}

          {/* Botón de compra */}
          <div className="d-grid gap-2">
            <button className="btn btn-dark btn-lg">AGREGAR AL CARRITO</button>
          </div>
        </div>
      </div>
    </div>
  );
}
