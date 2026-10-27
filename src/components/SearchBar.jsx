import { memo } from 'react'
function SearchBar({ value, onChange }) {
  return (
    <div className="mb-6 max-w-md mx-auto">
      <label htmlFor="search-author" className="sr-only">
        Search by author
      </label>
      <input
        id="search-author"
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Search by author..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  )
}

export default memo(SearchBar)
