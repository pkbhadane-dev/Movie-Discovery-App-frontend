// import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { MovieDetails } from "./pages/MovieDetails";
import { Wishlist } from "./pages/WishlistPage";



function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#141414] text-white">
        {/* Navigation Bar */}
        <nav className="flex items-center justify-between px-8 py-4 bg-black/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-800">
          <Link
            to="/"
            className="text-brand text-2xl font-bold tracking-wider hover:opacity-90"
          >
            MOVIEFLIX
          </Link>
          <div className="space-x-6 text-sm font-medium">
            <Link to="/" className="hover:text-brand transition-colors">
              Home
            </Link>
            <Link to="/wishlist" className="hover:text-brand transition-colors">
              Wishlist ❤️
            </Link>
          </div>
        </nav>

        {/* Routes */}
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/wishlist" element={<Wishlist />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
