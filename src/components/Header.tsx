'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ContactInfo {
  phone?: string;
  email?: string;
}

export function Header() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetch('/api/site')
      .then((res) => res.json())
      .then((data) => {
        setContactInfo(data.contactInfo);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch('/api/categories?parentId=null')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <header className="bg-white shadow-sm">
      {/* Top bar */}
      <div className="bg-orange-500 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            {contactInfo?.phone && (
              <a href={`tel:${contactInfo.phone}`} className="flex items-center gap-1 hover:opacity-80">
                <Phone className="w-4 h-4" />
                {contactInfo.phone}
              </a>
            )}
            {contactInfo?.email && (
              <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-1 hover:opacity-80 hidden sm:flex">
                <Mail className="w-4 h-4" />
                {contactInfo.email}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-orange-500">Sunny Hair Bows</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
              Products
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
              Contact Us
            </Link>
          </nav>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link 
                  href="/" 
                  className="text-gray-700 hover:text-orange-500 font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  href="/products" 
                  className="text-gray-700 hover:text-orange-500 font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Products
                </Link>
                <Link 
                  href="/about" 
                  className="text-gray-700 hover:text-orange-500 font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  About Us
                </Link>
                <Link 
                  href="/contact" 
                  className="text-gray-700 hover:text-orange-500 font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Contact Us
                </Link>
                {categories.length > 0 && (
                  <div className="border-t pt-4 mt-4">
                    <p className="text-sm text-gray-500 mb-2">Categories</p>
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/products?category=${cat.slug}`}
                        className="block py-2 text-gray-600 hover:text-orange-500"
                        onClick={() => setIsOpen(false)}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
