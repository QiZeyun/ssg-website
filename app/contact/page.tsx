import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactForm } from '@/components/ContactForm';
import { generateMetadataFromPath } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataFromPath('/contact');
}

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              Your Company
            </Link>
            <div className="space-x-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>
          <p className="text-xl text-gray-600 mb-8">
            Have a question or want to work with us? Fill out the form below and
            we&apos;ll get back to you as soon as possible.
          </p>

          <ContactForm />

          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Other Ways to Reach Us
            </h2>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Email:</strong> contact@example.com
              </p>
              <p>
                <strong>Phone:</strong> +1 (555) 123-4567
              </p>
              <p>
                <strong>Address:</strong> 123 Business St, City, State 12345
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-800 text-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p>&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
