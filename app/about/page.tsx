import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about Fun Coloring Pages - your source for free, high-quality printable coloring pages for kids.',
  keywords: ['about', 'coloring pages', 'kids', 'free', 'printable', 'educational'],
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl gradient-text text-shadow">
            About Fun Coloring Pages
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
            Inspiring creativity and imagination through beautiful, free coloring pages for children everywhere.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">

          {/* Our Mission */}
          <div className="card p-8 md:p-12">
            <h2 className="font-heading font-bold text-3xl text-gray-800 mb-6 text-center">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed text-center max-w-3xl mx-auto">
              At Fun Coloring Pages, we believe that every child deserves access to creative outlets that inspire
              imagination and artistic expression. Our mission is to provide high-quality, completely free coloring
              pages that entertain, educate, and encourage children to explore their creativity.
            </p>
          </div>

          {/* What We Offer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card p-8 text-center">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="font-heading font-semibold text-xl text-gray-800 mb-4">
                100% Free Content
              </h3>
              <p className="text-gray-600">
                All our coloring pages are completely free to download and print.
                No hidden fees, no subscriptions - just pure creative fun for kids.
              </p>
            </div>

            <div className="card p-8 text-center">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="font-heading font-semibold text-xl text-gray-800 mb-4">
                High Quality Designs
              </h3>
              <p className="text-gray-600">
                Every coloring page is carefully designed with clean lines and
                age-appropriate content that�s perfect for printing at home.
              </p>
            </div>

            <div className="card p-8 text-center">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="font-heading font-semibold text-xl text-gray-800 mb-4">
                Educational Value
              </h3>
              <p className="text-gray-600">
                Our coloring pages help develop fine motor skills, color recognition,
                and creativity while providing hours of educational entertainment.
              </p>
            </div>

            <div className="card p-8 text-center">
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="font-heading font-semibold text-xl text-gray-800 mb-4">
                Regular Updates
              </h3>
              <p className="text-gray-600">
                We continuously add new categories and designs to keep the content
                fresh and exciting for children of all ages and interests.
              </p>
            </div>
          </div>

          {/* Why Coloring? */}
          <div className="card p-8 md:p-12">
            <h2 className="font-heading font-bold text-3xl text-gray-800 mb-8 text-center">
              Why Coloring is Important for Kids
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Develops Fine Motor Skills</h4>
                    <p className="text-gray-600 text-sm">
                      Coloring helps children develop hand-eye coordination and strengthen the small muscles in their hands.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Enhances Creativity</h4>
                    <p className="text-gray-600 text-sm">
                      Children can express themselves through color choices and develop their artistic abilities.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Improves Focus</h4>
                    <p className="text-gray-600 text-sm">
                      Coloring activities help children practice concentration and attention to detail.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-secondary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Reduces Stress</h4>
                    <p className="text-gray-600 text-sm">
                      Coloring is a calming activity that can help children relax and reduce anxiety.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-secondary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Builds Confidence</h4>
                    <p className="text-gray-600 text-sm">
                      Completing coloring pages gives children a sense of accomplishment and boosts self-esteem.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-secondary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Screen-Free Fun</h4>
                    <p className="text-gray-600 text-sm">
                      Coloring provides engaging entertainment without the need for screens or electronics.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center py-12">
            <h2 className="font-heading font-bold text-3xl text-gray-800 mb-6">
              Ready to Start Coloring?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Browse our collection of free coloring pages and start creating beautiful artwork today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/" className="btn-primary">
                Browse All Categories
              </Link>
              <Link href="/contact" className="btn-secondary">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
