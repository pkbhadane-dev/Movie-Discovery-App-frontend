import React, { useState, useEffect } from "react";
import { fetchWishlist, removeFromWishlist } from "../api/axios";
import MovieCard from "../components/MovieCard";

export const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const res = await fetchWishlist();
      setWishlist(res.data.data || []);
    } catch (err) {
      setError("Failed to fetch wishlist items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleRemove = async (movie) => {
    try {
      await removeFromWishlist(movie.id || movie.movieId);
      setWishlist((prev) => prev.filter((item) => item.movieId !== (movie.id || movie.movieId)));
    } catch (err) {
      alert("Failed to remove movie.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Your Wishlist ❤️</h1>
        <span className="text-sm text-gray-400">{wishlist.length} saved movies</span>
      </div>

      {error && <div className="p-4 bg-red-900/30 border border-red-800 text-red-400 rounded-lg">{error}</div>}

      {loading ? (
        <div className="py-20 text-center text-gray-500">Loading your wishlist...</div>
      ) : wishlist.length === 0 ? (
        <div className="py-20 text-center text-gray-500">
          Your wishlist is empty. Explore movies on the home page and add your favorites!
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {wishlist.map((item) => (
            <MovieCard
              key={item._id}
              movie={{
                id: item.movieId,
                title: item.title,
                poster: item.poster,
                rating: item.rating,
                releaseDate: item.releaseDate,
              }}
              isWishlisted={true}
              onToggleWishlist={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
};
