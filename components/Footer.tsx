import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-20 glassmorphism border-t border-white/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🎨</span>
              </div>
              <span className="font-heading font-bold text-xl gradient-text">
                Fun Coloring Pages
              </span>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              Free printable coloring pages for kids. Download and print beautiful designs
              featuring your favorite characters, animals, and more!
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-gray-800">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-gray-800">Popular Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/elsa-coloring-pages"
                  className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-sm"
                >
                  Elsa Coloring Pages
                </Link>
              </li>
              <li>
                <Link
                  href="/cars-coloring-pages"
                  className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-sm"
                >
                  Cars Coloring Pages
                </Link>
              </li>
              <li>
                <Link
                  href="/animals-coloring-pages"
                  className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-sm"
                >
                  Animals Coloring Pages
                </Link>
              </li>
              <li>
                <Link
                  href="/princess-coloring-pages"
                  className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-sm"
                >
                  Princess Coloring Pages
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-white/20 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Fun Coloring Pages. All rights reserved. Made with ❤️ for kids everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}