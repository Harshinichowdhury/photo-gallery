import { useState, useReducer, useEffect, useMemo, useCallback } from 'react'
import useFetchPhotos from '../hooks/useFetchPhotos'
import Spinner from './Spinner'
import ErrorMessage from './ErrorMessage'
import PhotoCard from './PhotoCard'
import SearchBar from './SearchBar'


const STORAGE_KEY = 'photo-gallery-favourites'


function favouritesReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_FAVOURITE': {
      const id = action.payload
     
      if (state.includes(id)) {
        return state.filter((favId) => favId !== id)
      }
      return [...state, id]
    }
    default:
      return state
  }
}


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

  
  const [favourites, dispatch] = useReducer(favouritesReducer, [], initFavourites)

 
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites))
    } catch {
      
    }
  }, [favourites])

  
  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value)
  }, [])

  
  const handleToggleFavourite = useCallback((id) => {
    dispatch({ type: 'TOGGLE_FAVOURITE', payload: id })
  }, [])

  
  const filteredPhotos = useMemo(() => {
    const trimmedQuery = searchTerm.trim().toLowerCase()
   
    if (!trimmedQuery) {
      return photos
    }
    
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