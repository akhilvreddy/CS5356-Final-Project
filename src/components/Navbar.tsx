import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              My Project
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700">
              Home
            </Link>
            <Link href="/about" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700">
              About
            </Link>
            <Link href="/contact" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 