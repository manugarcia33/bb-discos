import { Camera } from "lucide-react";

interface Product {
  id: number;
  title: string;
  artist: string;
  price: number;
  installments: number;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
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
          ${product.price.toLocaleString("es-AR")}
        </div>
        <p className="product-installments">
          3 cuotas sin interés de $
          {product.installments.toLocaleString("es-AR")}
        </p>
      </div>
    </div>
  );
}
