import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import ProductsView from "./components/ProductsView";
import Sidebar from "./components/Sidebar";
import FeaturedCarousel from "./components/FeaturedCarousel";
import Categories from "./components/Categories";
import OffersCarousel from "./components/OffersCarousel";

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
      genre: "international",
    },
    {
      id: 2,
      title: "The Dark Side of the Moon",
      artist: "Pink Floyd",
      price: 35000,
      installments: 11667,
      genre: "international",
    },
    {
      id: 3,
      title: "Rumours",
      artist: "Fleetwood Mac",
      price: 28000,
      installments: 9333,
      genre: "international",
    },
    {
      id: 4,
      title: "Thriller",
      artist: "Michael Jackson",
      price: 32000,
      installments: 10667,
      genre: "solistas-masculinos",
    },
    {
      id: 5,
      title: "Back in Black",
      artist: "AC/DC",
      price: 29000,
      installments: 9667,
      genre: "international",
    },
    {
      id: 6,
      title: "The Wall",
      artist: "Pink Floyd",
      price: 38000,
      installments: 12667,
      genre: "international",
    },
    {
      id: 7,
      title: "Kind of Blue",
      artist: "Miles Davis",
      price: 42000,
      installments: 14000,
      genre: "jazz",
    },
    {
      id: 8,
      title: "Legend",
      artist: "Bob Marley & The Wailers",
      price: 26000,
      installments: 8667,
      genre: "international",
    },
    {
      id: 9,
      title: "Master of Puppets",
      artist: "Metallica",
      price: 31000,
      installments: 10333,
      genre: "international",
    },
    {
      id: 10,
      title: "Born to Run",
      artist: "Bruce Springsteen",
      price: 27000,
      installments: 9000,
      genre: "solistas-masculinos",
    },
    {
      id: 11,
      title: "Blue Lines",
      artist: "Massive Attack",
      price: 33000,
      installments: 11000,
      genre: "international",
    },
    {
      id: 12,
      title: "Illmatic",
      artist: "Nas",
      price: 25000,
      installments: 8333,
      genre: "solistas-masculinos",
    },
    {
      id: 13,
      title: "The Velvet Underground & Nico",
      artist: "The Velvet Underground",
      price: 45000,
      installments: 15000,
      genre: "international",
    },
    {
      id: 14,
      title: "Random Access Memories",
      artist: "Daft Punk",
      price: 39000,
      installments: 13000,
      genre: "international",
    },
    {
      id: 15,
      title: "Blue",
      artist: "Joni Mitchell",
      price: 36000,
      installments: 12000,
      genre: "solistas-femeninas",
    },
    {
      id: 16,
      title: "A Love Supreme",
      artist: "John Coltrane",
      price: 48000,
      installments: 16000,
      genre: "jazz",
    },
    {
      id: 17,
      title: "The Rise and Fall of Ziggy Stardust",
      artist: "David Bowie",
      price: 34000,
      installments: 11333,
      genre: "solistas-masculinos",
    },
    {
      id: 18,
      title: "Paranoid",
      artist: "Black Sabbath",
      price: 29500,
      installments: 9833,
      genre: "international",
    },
    {
      id: 19,
      title: "AM",
      artist: "Arctic Monkeys",
      price: 24000,
      installments: 8000,
      genre: "international",
    },
    {
      id: 20,
      title: "Elis & Tom",
      artist: "Elis Regina & Tom Jobim",
      price: 28500,
      installments: 9500,
      genre: "brasilera",
    },
    {
      id: 21,
      title: "Soda Stereo",
      artist: "Soda Stereo",
      price: 41000,
      installments: 13667,
      genre: "nacional",
    },
    {
      id: 22,
      title: "The Miseducation of Lauryn Hill",
      artist: "Lauryn Hill",
      price: 30500,
      installments: 10167,
      genre: "solistas-femeninas",
    },
    {
      id: 23,
      title: "Artaud",
      artist: "Pescado Rabioso",
      price: 23000,
      installments: 7667,
      genre: "nacional",
    },
    {
      id: 24,
      title: "Unplugged",
      artist: "Eric Clapton",
      price: 52000,
      installments: 17333,
      genre: "solistas-masculinos",
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
          <>
            <Hero onViewCatalog={() => setCurrentView("PRODUCTS")} />
            <FeaturedCarousel />
            <Categories onSelectCategory={handleCategoryClick} />
            <OffersCarousel />
          </>
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
