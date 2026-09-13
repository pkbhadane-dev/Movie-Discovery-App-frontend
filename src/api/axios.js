import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api/v1/movies/",
});

export const fetchMovies = (page = 1) => API.get(`/getMovies?page=${page}`);
export const searchMovies = (query, page = 1) =>
  API.get(`/searchMovie?search=${query}&page=${page}`);
export const discoverMovies = ({
  genre = "",
  sortBy = "popularity.desc",
  page = 1,
} = {}) => {
  return API.get(`/discoverMovie?genre=${genre}&sortBy=${sortBy}&page=${page}`);
};
export const fetchMovieDetails = (movieId) =>
  API.get(`/movieDetail/${movieId}`);

export const fetchWishlist = () => API.get("/wishlist");
export const addToWishlist = (movieData) => {
  API.post("/addToWishlist", movieData);
};
export const removeFromWishlist = (id) => API.delete(`/wishlist/${id}`);

export default API;
