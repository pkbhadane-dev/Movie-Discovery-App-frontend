import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchMovieDetails,
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../api/axios";

export const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadMovieDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch Movie Details
        const res = await fetchMovieDetails(id);
        
        if (isMounted) {
          if (res.data && res.data.data) {
            setMovie(res.data.data);
          } else {
            setError("Movie details not found");
          }
        }
      } catch (err) {
        if (isMounted) setError("Failed to load movie details.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const checkWishlistStatus = async () => {
      try {
        const wishlistRes = await fetchWishlist();
        if (isMounted && wishlistRes.data && wishlistRes.data.data) {
          const exists = wishlistRes.data.data.some(
            (item) => item.movieId === Number(id)
          );
          setIsWishlisted(exists);
        }
      } catch (err) {
        console.warn("Could not fetch wishlist status", err);
      }
    };

    if (id) {
      loadMovieDetails();
      checkWishlistStatus();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleToggleWishlist = async () => {
    try {
      if (isWishlisted) {
        await removeFromWishlist(movie.id);
        setIsWishlisted(false);
      } else {
        await addToWishlist({
          movieId: movie.id,
          title: movie.title,
          poster: movie.poster,
          rating: movie.rating,
          releaseDate: movie.releaseDate,
        });
        setIsWishlisted(true);
      }
    } catch (err) {
      alert("Action failed. Try again.");
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-gray-400">Loading details...</div>;
  }

  if (error || !movie) {
    return (
      <div className="py-20 text-center">
        <p className="text-red-400">{error || "Movie not found"}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 rounded-lg bg-gray-800 px-4 py-2 text-sm text-white"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-400 hover:text-white transition-colors"
      >
        ← Back to Browse
      </button>

      <div className="relative overflow-hidden rounded-2xl bg-gray-900 border border-gray-800">
        {movie.backdrop && (
          <div className="absolute inset-0 opacity-20">
            <img
              src={
                movie.backdrop.startsWith("http")
                  ? movie.backdrop
                  : `https://image.tmdb.org/t/p/w500${movie.backdrop}`
              }
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="relative z-10 flex flex-col md:flex-row gap-8 p-6 md:p-10">
          <div className="w-48 sm:w-64 flex-shrink-0 mx-auto md:mx-0">
            <img
              src={
                movie.poster
                  ? movie.poster.startsWith("http")
                    ? movie.poster
                    : `https://image.tmdb.org/t/p/w500${movie.poster}`
                  : "https://via.placeholder.com/500x750?text=No+Poster"
              }
              alt={movie.title}
              className="rounded-xl shadow-2xl w-full aspect-[2/3] object-cover border border-gray-800"
            />
          </div>

          <div className="flex-1 space-y-4 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="italic text-gray-400 text-sm md:text-base">
                "{movie.tagline}"
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs md:text-sm">
              <span className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1 rounded-full font-semibold">
                ★ {movie.rating ? movie.rating.toFixed(1) : "N/A"}
              </span>
              <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full">
                {movie.releaseDate}
              </span>
              {movie.runtime > 0 && (
                <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full">
                  {movie.runtime} mins
                </span>
              )}
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
                {movie.genres.map((g, i) => (
                  <span
                    key={i}
                    className="text-xs font-medium text-gray-400 bg-gray-950 px-2.5 py-1 rounded-md border border-gray-800"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}

            <div className="pt-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-1">
                Overview
              </h3>
              <p className="text-gray-300 leading-relaxed text-sm md:text-base max-w-3xl">
                {movie.overview}
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={handleToggleWishlist}
                className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                  isWishlisted
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-white text-black hover:bg-gray-200"
                }`}
              >
                {isWishlisted
                  ? "❤️ Remove from Wishlist"
                  : "🤍 Add to Wishlist"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};