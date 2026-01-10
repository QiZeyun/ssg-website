import type { Metadata } from 'next';
import Link from 'next/link';
import { generateMetadataFromPath } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataFromPath('/about');
}

export default function AboutPage() {
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About Us</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 mb-6">
              Welcome to Your Company Name. We are dedicated to providing
              exceptional services and solutions for our clients.
            </p>

            <h2 className="text-3xl font-semibold text-gray-900 mt-8 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-700 mb-6">
              Our mission is to deliver innovative solutions that help businesses
              grow and succeed in today&apos;s competitive market.
            </p>

            <h2 className="text-3xl font-semibold text-gray-900 mt-8 mb-4">
              Our Values
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Integrity in everything we do</li>
              <li>Commitment to excellence</li>
              <li>Customer-first approach</li>
              <li>Innovation and continuous improvement</li>
            </ul>

            <h2 className="text-3xl font-semibold text-gray-900 mt-8 mb-4">
              Our Team
            </h2>
            <p className="text-gray-700 mb-6">
              We have a dedicated team of professionals who are passionate about
              what they do and committed to delivering the best results for our clients.
            </p>
          </div>

          <div className="mt-12">
            <Link
              href="/contact"
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Get in Touch
            </Link>
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
