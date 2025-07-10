// src/components/Header.tsx
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import { assets } from '@/assets/assets'

const navItems = [
  { href: '/',           label: 'Home' },
  { href: '/#demo',      label: 'Demo' },
  { href: '/#features',  label: 'Features' },
  { href: '/docs',       label: 'Docs' },
  { href: '/#contact',    label: 'Contact' },
];

const Header: React.FC = () => {
  const isLoggedIn = false;
  const user = {
    name: 'John Doe',
    avatar: '/assets/images/user-avatar.png',
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src={assets.logo_icon}
            alt="STEM Bot Logo"
            className="w-8 h-8"
          />
          <span className="text-xl font-semibold text-green-700">
            STEM Bot
          </span>
        </Link>

        <nav className="space-x-8">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="text-green-700 hover:text-green-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-6 flex items-center space-x-2">
          {isLoggedIn ? (
            <>
              <Image
                src={user.avatar}
                alt={`${user.name} avatar`}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-green-700 font-medium">
                {user.name}
              </span>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center space-x-1 text-green-700 hover:text-green-900"
            >
              <Image
                src={assets.logo_icon}
                alt="Anonymous avatar"
                className="w-8 h-8 rounded-full"
              />
              <span className="font-medium">Log in</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
