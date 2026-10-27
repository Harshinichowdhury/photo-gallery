# Photo Gallery

A small React app that fetches photos from the Picsum API, shows them in a responsive grid, filters them by author name, and lets you mark favourites that persist across page refreshes.

## Features

- Fetches 30 photos from `https://picsum.photos/v2/list?limit=30` on load
- Loading spinner while fetching, error message if the request fails
- Responsive grid: 4 columns on desktop, 2 on tablet, 1 on mobile
- Live search by author name (filters already-fetched data, no extra API call)
- Heart button to mark favourites, saved in `localStorage`

## Tech stack

- React + Vite
- Tailwind CSS (no other UI libraries)
- Functional components and hooks only

## Getting started

```bash
git clone https://github.com/Harshinichowdhury/photo-gallery.git
cd photo-gallery
npm install
npm run dev
```

Then open the local URL printed in the terminal (usually http://localhost:5173).

Other scripts:

```bash
npm run build   # production build
npm run lint    # lint the code
```

## Project structure

```
src/
  hooks/
    useFetchPhotos.js    fetch logic, returns { photos, loading, error }
  components/
    Gallery.jsx          uses the hook, favourites reducer, search, grid
    SearchBar.jsx        search input (wrapped in React.memo)
    PhotoCard.jsx        photo, author, heart button (wrapped in React.memo)
    Spinner.jsx          loading indicator
    ErrorMessage.jsx     error display
  App.jsx
  main.jsx
```

## How it works

- **`useFetchPhotos`**: a custom hook that fetches the photo list once on mount. It uses an `AbortController` to cancel the request on cleanup, checks `res.ok` because `fetch` does not reject on HTTP errors, and returns `photos`, `loading` and `error`.
- **Favourites with `useReducer`**: the state is an array of photo ids. A pure reducer handles a `TOGGLE_FAVOURITE` action. The initial state is read lazily from `localStorage`, and a `useEffect` saves it whenever it changes.
- **Search with `useMemo`**: the filtered list is computed with `useMemo`, so it only recalculates when the photos or the search text change.
- **`useCallback` and `React.memo`**: the search and toggle handlers are wrapped in `useCallback` so their references stay stable. `SearchBar` and `PhotoCard` are wrapped in `React.memo`, so they skip re-rendering when their props have not changed (for example, toggling one heart re-renders only that card).

## Notes

- Favourites are stored by photo id under the `photo-gallery-favourites` key in `localStorage`.
- Images use `https://picsum.photos/id/{id}/400/300` to keep downloads small.