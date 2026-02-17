import { Camera } from "lucide-react";
import { Link } from "react-router-dom";

interface Product {
  id: number;
  title: string;
  artist: string;
  price: number;
  installments: number;
  genre: string;
  imageUrl?: string | null;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to={`/producto/${product.id}`}
      className="card product-card text-decoration-none"
      style={{ cursor: "pointer" }}
    >
      {/* Product Image */}
      <div className="product-image-placeholder">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={`${product.artist} - ${product.title}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <Camera size={48} color="#adb5bd" />
        )}
      </div>

      {/* Product Info */}
      <div className="card-body">
        <h6 className="product-title">{product.title}</h6>
        <p className="product-artist">{product.artist}</p>
        <div className="product-price">
          ${product.price.toLocaleString("es-AR")}
        </div>
        <p className="product-installments">
          3 cuotas sin interés de $
          {product.installments.toLocaleString("es-AR")}
        </p>
      </div>
    </Link>
  );
}
