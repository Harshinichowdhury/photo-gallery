import { useState, useReducer, useEffect, useMemo, useCallback } from 'react'
import useFetchPhotos from '../hooks/useFetchPhotos'
import Spinner from './Spinner'
import ErrorMessage from './ErrorMessage'
import PhotoCard from './PhotoCard'
import SearchBar from './SearchBar'

// Storage key used to save and retrieve favourites in the browser
const STORAGE_KEY = 'photo-gallery-favourites'

// Pure reducer function managing the favourites array
function favouritesReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_FAVOURITE': {
      const id = action.payload
      // If photo is already favourited, remove it; otherwise, add it without mutating state
      if (state.includes(id)) {
        return state.filter((favId) => favId !== id)
      }
      return [...state, id]
    }
    default:
      return state
  }
}

// Lazy initializer safely reading persisted favourites from localStorage
function initFavourites(defaultVal = []) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) {
      return defaultVal
    }
    const parsed = JSON.parse(saved)
    return Array.isArray(parsed) ? parsed : defaultVal
  } catch {
    return defaultVal
  }
}

export default function Gallery() {
  const { photos, loading, error } = useFetchPhotos()
  const [searchTerm, setSearchTerm] = useState('')

  // useReducer manages favourites, initialized lazily from localStorage
  const [favourites, dispatch] = useReducer(favouritesReducer, [], initFavourites)

  // Persist favourites to localStorage whenever the favourites array changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites))
    } catch {
      // Gracefully handle storage disabled or quota limits
    }
  }, [favourites])

  // useCallback memoizes the handler to avoid recreating it on every render
  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value)
  }, [])

  // useCallback for toggling favourites to keep prop reference stable
  const handleToggleFavourite = useCallback((id) => {
    dispatch({ type: 'TOGGLE_FAVOURITE', payload: id })
  }, [])

  // useMemo filters photos in memory so typing never triggers network requests
  const filteredPhotos = useMemo(() => {
    const trimmedQuery = searchTerm.trim().toLowerCase()
    // When input is empty, show all fetched photos
    if (!trimmedQuery) {
      return photos
    }
    // Case-insensitive author matching
    return photos.filter((photo) =>
      photo.author.toLowerCase().includes(trimmedQuery)
    )
  }, [photos, searchTerm])

  if (loading) {
    return <Spinner />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  return (
    <div>
      <SearchBar value={searchTerm} onChange={handleSearchChange} />

      {/* Show clear message when no authors match, else render the responsive grid */}
      {filteredPhotos.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No photos found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredPhotos.map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              isFavourite={favourites.includes(photo.id)}
              onToggleFavourite={handleToggleFavourite}
            />
          ))}
        </div>
      )}
    </div>
  )
}