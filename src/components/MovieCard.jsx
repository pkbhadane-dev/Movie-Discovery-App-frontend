import React from "react";
import { Link } from "react-router-dom";

const MovieCard = ({ movie, isWishlisted, onToggleWishlist }) => {
  const posterUrl = movie.poster
    ? `https://image.tmdb.org/t/p/w500${movie.poster}`
    : "https://via.placeholder.com/500x750?text=No+Poster";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl bg-gray-900 border border-gray-800 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-red-900/20">
      <Link to={`/movie/${movie.id}`} className="relative aspect-[2/3] w-full overflow-hidden bg-gray-950">
        <img
          src={posterUrl}
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {movie.rating > 0 && (
          <div className="absolute top-2 right-2 rounded-md bg-black/70 px-2 py-1 text-xs font-semibold text-yellow-400 backdrop-blur-md">
            ★ {movie.rating.toFixed(1)}
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="line-clamp-1 text-base font-semibold text-white group-hover:text-brand transition-colors" title={movie.title}>
            {movie.title}
          </h3>
          <p className="mt-1 text-xs text-gray-400">
            {movie.releaseDate ? movie.releaseDate.split("-")[0] : "N/A"}
          </p>
        </div>

        <button
          onClick={() => onToggleWishlist(movie)}
          className={`mt-4 flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium transition-colors ${
            isWishlisted
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-gray-800 text-gray-200 hover:bg-gray-700"
          }`}
        >
          {isWishlisted ? "❤️ In Wishlist" : "🤍 Add to Wishlist"}
        </button>
      </div>
    </div>
  );
};

export default MovieCard;