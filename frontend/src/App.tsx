import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import ProductsView from "./components/ProductsView";
import ProductDetail from "./components/ProductDetail";
import Sidebar from "./components/Sidebar";
import AdminPanel from "./components/AdminPanel";
import { AuthProvider } from "./context/AuthContext";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/productos" element={<ProductsView />} />
              <Route path="/producto/:id" element={<ProductDetail />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
