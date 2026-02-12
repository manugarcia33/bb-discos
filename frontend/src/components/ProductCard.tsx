import { Camera } from "lucide-react";
import { Link } from "react-router-dom";

interface Product {
  id: number;
  title: string;
  artist: string;
  price: number;
  installments: number;
  genre: string;
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
      {/* Product Image Placeholder */}
      <div className="product-image-placeholder">
        <Camera size={48} color="#adb5bd" />
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
