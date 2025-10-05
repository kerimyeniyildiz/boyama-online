export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        <p className="text-gray-600 font-medium">Loading coloring pages...</p>
      </div>
    </div>
  );
}