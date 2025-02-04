import React from 'react';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold">
              Logo
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="/" className="text-sm font-medium hover:text-blue-600">
              Home
            </a>
            <a href="/about" className="text-sm font-medium hover:text-blue-600">
              About
            </a>
            <a href="/services" className="text-sm font-medium hover:text-blue-600">
              Services
            </a>
            <a href="/contact" className="text-sm font-medium hover:text-blue-600">
              Contact
            </a>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            <a href="/" className="block py-2 text-sm font-medium hover:text-blue-600">
              Home
            </a>
            <a href="/about" className="block py-2 text-sm font-medium hover:text-blue-600">
              About
            </a>
            <a href="/services" className="block py-2 text-sm font-medium hover:text-blue-600">
              Services
            </a>
            <a href="/contact" className="block py-2 text-sm font-medium hover:text-blue-600">
              Contact
            </a>
          </div>
        </div>
      )}
    </header>
  );
}