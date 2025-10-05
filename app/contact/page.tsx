import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Fun Coloring Pages. We love hearing from parents, teachers, and kids who enjoy our free printable coloring pages.',
  keywords: ['contact', 'support', 'feedback', 'coloring pages', 'help'],
};

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl gradient-text text-shadow">
            Contact Us
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
            We�d love to hear from you! Get in touch with questions, suggestions, or just to say hello.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

            {/* Contact Info */}
            <div className="card p-8">
              <h2 className="font-heading font-bold text-2xl text-gray-800 mb-6">
                Get in Touch
              </h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Email Us</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      For questions, suggestions, or feedback
                    </p>
                    <a
                      href="mailto:hello@funcoloringpages.com"
                      className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
                    >
                      hello@funcoloringpages.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-secondary-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Support</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      Need help with downloading or printing?
                    </p>
                    <a
                      href="mailto:support@funcoloringpages.com"
                      className="text-secondary-600 hover:text-secondary-700 font-medium transition-colors duration-200"
                    >
                      support@funcoloringpages.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Suggestions</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      Have ideas for new coloring page categories?
                    </p>
                    <a
                      href="mailto:ideas@funcoloringpages.com"
                      className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
                    >
                      ideas@funcoloringpages.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="card p-8">
              <h2 className="font-heading font-bold text-2xl text-gray-800 mb-6">
                Frequently Asked Questions
              </h2>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Are the coloring pages really free?
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Yes! All our coloring pages are 100% free to download and print. No hidden fees or subscriptions required.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Can I use these for commercial purposes?
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Our coloring pages are for personal and educational use only. Please contact us for commercial licensing.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    How often do you add new content?
                  </h4>
                  <p className="text-gray-600 text-sm">
                    We regularly add new coloring pages and categories. Check back often for fresh content!
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    What age group are these suitable for?
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Our coloring pages are designed for children of all ages, from toddlers to pre-teens.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Can I request specific characters or themes?
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Absolutely! Send us your suggestions at ideas@funcoloringpages.com and we�ll consider them for future updates.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Response Time */}
          <div className="card p-8 text-center">
            <h2 className="font-heading font-bold text-2xl text-gray-800 mb-4">
              Our Response Promise
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We typically respond to all emails within 24-48 hours. For urgent technical issues,
              we�ll do our best to respond even faster!
            </p>
          </div>

          {/* Call to Action */}
          <div className="text-center py-12">
            <h2 className="font-heading font-bold text-3xl text-gray-800 mb-6">
              Don�t Forget to Explore!
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              While you�re here, why not browse our amazing collection of free coloring pages?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/" className="btn-primary">
                Browse Coloring Pages
              </Link>
              <Link href="/about" className="btn-secondary">
                Learn More About Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
