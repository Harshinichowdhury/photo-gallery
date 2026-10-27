import { memo } from 'react'
function PhotoCard({ photo, isFavourite, onToggleFavourite }) {
  // Use a resized image endpoint to keep download size small and page fast
  const imageUrl = `https://picsum.photos/id/${photo.id}/400/300`

  // Descriptive label gives screen readers the author and current favourite state
  const favouriteAriaLabel = isFavourite
    ? `Remove photo by ${photo.author} from favourites`
    : `Add photo by ${photo.author} to favourites`

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
      {/* Fixed aspect ratio prevents layout shifts while the image is loading */}
      <img
        src={imageUrl}
        alt={`Photo by ${photo.author}`}
        loading="lazy"
        className="w-full aspect-[4/3] object-cover"
      />
      <div className="p-4 flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-gray-800 truncate">
          {photo.author}
        </span>
        <button
          type="button"
          onClick={() => onToggleFavourite(photo.id)}
          aria-pressed={isFavourite}
          aria-label={favouriteAriaLabel}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          {/* Inline heart SVG: outline when not favourite, solid red when favourite */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={isFavourite ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`w-6 h-6 ${isFavourite ? 'text-red-500' : 'text-gray-400'}`}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
export default memo(PhotoCard)