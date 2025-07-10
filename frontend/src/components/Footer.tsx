import Link from 'next/link';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm text-gray-600">
          &copy; {new Date().getFullYear()} STEM Bot. All rights reserved.
        </p>
        <div className="flex space-x-6 mt-2 md:mt-0">
          <Link href="/privacy" className="text-gray-600 hover:text-gray-800 text-sm">
            Privacy
          </Link>
          <Link href="/terms" className="text-gray-600 hover:text-gray-800 text-sm">
            Terms
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-gray-800 text-sm">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
