// pages/HomePage.jsx

import React, { useState, useEffect } from "react";
import {
  discoverMovies,
  searchMovies,
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
  fetchMovies,
} from "../api/axios";
import { useDebounce } from "../hooks/useDebounce";
import MovieCard from "../components/MovieCard";

export const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc"); // Default Sort
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const debouncedSearch = useDebounce(searchQuery, 600);

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
    setPage(1);
  };

  // 1. Load Wishlist
  const loadWishlist = async () => {
    try {
      const res = await fetchWishlist();
      if (res.data?.data) {
        const ids = new Set(res.data.data.map((item) => item.movieId));
        setWishlistIds(ids);
      }
    } catch (err) {
      console.error("Failed to load wishlist", err);
    }
  };

  // 2. Fetch Movies with Search / Sort
  const loadMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      let res;
      if (debouncedSearch.trim()) {
        res = await searchMovies(debouncedSearch.trim(), page);
      } else {
        // res = await discoverMovies({ genre: selectedGenre, sortBy, page });
        res = await fetchMovies(page);
      }

      if (res.data && res.data.data) {
        setMovies(res.data.data);
      } else {
        setMovies([]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch movies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  useEffect(() => {
    loadMovies();
  }, [selectedGenre, debouncedSearch, sortBy, page]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  //   const handleSortChange = (e) => {
  //     setSortBy(e.target.value);
  //     setPage(1);
  //   };

  const handleClearSearch = () => {
    setSearchQuery("");
    setPage(1);
  };

  const handleToggleWishlist = async (movie) => {
    try {
      if (wishlistIds.has(movie.id)) {
        await removeFromWishlist(movie.id);
        setWishlistIds((prev) => {
          const next = new Set(prev);
          next.delete(movie.id);
          return next;
        });
      } else {
        await addToWishlist({
          movieId: movie.id,
          title: movie.title,
          poster: movie.poster,
          rating: movie.rating,
          releaseDate: movie.releaseDate,
        });
        setWishlistIds((prev) => new Set(prev).add(movie.id));
      }
    } catch (err) {
      alert("Wishlist update failed.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header, Search & Sort Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {debouncedSearch.trim()
              ? `Search Results for "${debouncedSearch}"`
              : "Discover Movies"}
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {debouncedSearch.trim()
              ? `Showing results for your query`
              : "Filter and sort through popular movies"}
          </p>
        </div>

        {/* Filters Wrapper */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Sort By Dropdown */}
          {/* {!debouncedSearch.trim() && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-xs text-gray-400 whitespace-nowrap">
                Sort By:
              </label>
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="w-full sm:w-auto rounded-lg bg-gray-900 border border-gray-800 px-3 py-2 text-xs text-white focus:border-red-600 focus:outline-none cursor-pointer"
              >
                <option value="popularity.desc">Most Popular</option>
                <option value="vote_average.desc">Highest Rated</option>
                <option value="primary_release_date.desc">
                  Release Date (Newest)
                </option>
                <option value="primary_release_date.asc">
                  Release Date (Oldest)
                </option>
              </select>
            </div>
          )} */}

          {/* {!debouncedSearch.trim() && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
               Genre Dropdown 
              <select
                value={selectedGenre}
                onChange={handleGenreChange}
                className="w-full sm:w-auto rounded-lg bg-gray-900 border border-gray-800 px-3 py-2 text-xs text-white focus:border-red-600 focus:outline-none cursor-pointer"
              >
                <option value="">All Genres</option>
                <option value="28">Action</option>
                <option value="35">Comedy</option>
                <option value="18">Drama</option>
                <option value="27">Horror</option>
                <option value="10749">Romance</option>
                <option value="878">Sci-Fi</option>
                <option value="53">Thriller</option>
                <option value="16">Animation</option>
              </select>
            </div>
          )}  */}

          {/* Search Input Box */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full rounded-lg bg-gray-900 border border-gray-800 px-4 py-2 text-xs text-white placeholder-gray-500 focus:border-red-600 focus:outline-none transition-all pr-8"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error View */}
      {error && (
        <div className="rounded-lg bg-red-900/30 border border-red-800 p-4 text-center text-red-400">
          {error}
        </div>
      )}

      {/* Loading Skeletons */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="aspect-[2/3] rounded-xl bg-gray-900 animate-pulse"
            />
          ))}
        </div>
      ) : movies.length === 0 ? (
        <div className="py-20 text-center text-gray-400 space-y-3">
          <p className="text-lg">No movies found</p>
          {debouncedSearch && (
            <button
              onClick={handleClearSearch}
              className="text-xs bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-white"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        /* Movie Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isWishlisted={wishlistIds.has(movie.id)}
              onToggleWishlist={handleToggleWishlist}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && movies.length > 0 && (
        <div className="flex justify-center items-center gap-4 pt-6">
          <button
            disabled={page === 1 || loading}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg bg-gray-800 px-4 py-2 text-xs font-semibold disabled:opacity-50 hover:bg-gray-700 transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-gray-400">Page {page}</span>
          <button
            disabled={loading || movies.length < 20}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg bg-gray-800 px-4 py-2 text-xs font-semibold disabled:opacity-50 hover:bg-gray-700 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
