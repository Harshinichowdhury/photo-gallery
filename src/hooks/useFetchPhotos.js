import { useState, useEffect } from 'react'

export default function useFetchPhotos() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
   
    const controller = new AbortController()

    async function fetchPhotos() {
      try {
        const res = await fetch('https://picsum.photos/v2/list?limit=30', {
          signal: controller.signal,
        })

        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }

        const data = await res.json()
        setPhotos(data)
      } catch (err) {
        
        if (err.name === 'AbortError') {
          return
        }
        setError(err.message)
      } finally {
       
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchPhotos()

    return () => {
      controller.abort()
    }
  }, [])

  return { photos, loading, error }
}