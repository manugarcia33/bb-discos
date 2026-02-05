import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import ProductsView from "./components/ProductsView";
import Sidebar from "./components/Sidebar";

function App() {
  const [currentView, setCurrentView] = useState("HOME");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Datos de ejemplo para los productos
  const products = [
    {
      id: 1,
      title: "Abbey Road",
      artist: "The Beatles",
      price: 30000,
      installments: 10000,
    },
    {
      id: 2,
      title: "The Dark Side of the Moon",
      artist: "Pink Floyd",
      price: 35000,
      installments: 11667,
    },
    {
      id: 3,
      title: "Rumours",
      artist: "Fleetwood Mac",
      price: 28000,
      installments: 9333,
    },
    {
      id: 4,
      title: "Thriller",
      artist: "Michael Jackson",
      price: 32000,
      installments: 10667,
    },
    {
      id: 5,
      title: "Back in Black",
      artist: "AC/DC",
      price: 29000,
      installments: 9667,
    },
    {
      id: 6,
      title: "The Wall",
      artist: "Pink Floyd",
      price: 38000,
      installments: 12667,
    },
  ];

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentView("PRODUCTS");
    setIsSidebarOpen(false);
  };

  return (
    <div className="app-container">
      {/* SIDEBAR */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onCategoryClick={handleCategoryClick}
      />

      {/* HEADER */}
      <Header
        onNavigate={setCurrentView}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* MAIN CONTENT */}
      <main className="flex-grow-1">
        {/* HOME VIEW */}
        {currentView === "HOME" && (
          <Hero onViewCatalog={() => setCurrentView("PRODUCTS")} />
        )}

        {/* PRODUCTS VIEW */}
        {currentView === "PRODUCTS" && (
          <ProductsView
            products={products}
            onNavigateHome={() => setCurrentView("HOME")}
          />
        )}
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default App;
