import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="text-8xl mb-6">🎨</div>
        <h1 className="font-heading font-bold text-4xl text-gray-800 mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Oops! The page you�re looking for doesn�t exist.
          Maybe you�d like to browse our coloring pages instead?
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-primary">
            Go Home
          </Link>
          <Link href="/about" className="btn-secondary">
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}
