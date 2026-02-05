import { Camera, ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import Sidebar from "./Sidebar";

interface Product {
  id: number;
  title: string;
  artist: string;
  price: number;
  installments: number;
}

interface ProductsViewProps {
  products: Product[];
  onNavigateHome: () => void;
}

export default function ProductsView({
  products,
  onNavigateHome,
}: ProductsViewProps) {
  return (
    <div className="products-section">
      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a onClick={onNavigateHome}>Inicio</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Productos
            </li>
          </ol>
        </nav>

        <div className="row">
          {/* Sidebar - Filters */}
          <div className="col-lg-3 col-md-4 col-12">
            <Sidebar />
          </div>

          {/* Product Grid */}
          <div className="col-lg-9 col-md-8 col-12">
            <div className="row">
              {products.map((product) => (
                <div key={product.id} className="col-lg-4 col-md-6 col-12">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
