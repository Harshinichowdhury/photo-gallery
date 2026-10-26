import { useState, useEffect } from 'react'

export default function useFetchPhotos() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // AbortController allows us to cancel the fetch if the component unmounts
    // or if React StrictMode runs the effect twice in development.
    const controller = new AbortController()

    async function fetchPhotos() {
      try {
        const res = await fetch('https://picsum.photos/v2/list?limit=30', {
          signal: controller.signal,
        })

        // fetch does not reject on HTTP error statuses (like 404 or 500),
        // so we must check res.ok and throw an error ourselves.
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }

        const data = await res.json()
        setPhotos(data)
      } catch (err) {
        // When unmounted or rerun by StrictMode, an AbortError is expected;
        // we ignore it so we do not show a false error message.
        if (err.name === 'AbortError') {
          return
        }
        setError(err.message)
      } finally {
        // Only mark loading as false if the request was not cancelled.
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