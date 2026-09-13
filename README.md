```markdown
# 🎨 Movie Discovery App - Frontend Client

A responsive, single-page movie discovery interface built with React, React Router, and Tailwind CSS. It communicates with the custom Node.js/Express backend to deliver search, filtering, and wishlist management.

---

## 🛠️ Tech Stack & Features

* **Core Library:** React.js
* **Styling:** Tailwind CSS (Dark-themed responsive grid)
* **Routing:** React Router DOM
* **HTTP Client:** Axios
* **State & Performance:** Custom `useDebounce` hook for search inputs (600ms delay) to optimize API requests.

### Key Features
* Dynamic trending and paginated movie grid.
* Genre filtering and multi-attribute sorting (Popularity, Rating, Release Date).
* Real-time debounced search with query reset.
* Detailed movie page featuring backdrops, taglines, ratings, and genre tags.
* Instant wishlist toggling synced with MongoDB backend.

---

## 📁 Project Structure

```text
src/
├── api/          # Axios instance and API call abstractions
├── components/   # Reusable UI elements (MovieCard, Skeleton loaders)
├── hooks/        # Custom utility hooks (useDebounce)
├── pages/        # Views (HomePage, MovieDetails, WishlistPage)
├── App.jsx       # Route configurations
└── main.jsx      # Entry point