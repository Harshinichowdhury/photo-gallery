export default function ErrorMessage({ message }) {
  return (
    <div
      role="alert"
      className="max-w-md mx-auto my-6 p-4 bg-red-50 border border-red-300 text-red-800 rounded-md text-center"
    >
      Failed to load photos: {message}
    </div>
  )
}