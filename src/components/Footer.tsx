'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

interface ContactInfo {
  address?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  wechat?: string;
  skype?: string;
  working_hours?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export function Footer() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch('/api/site')
      .then((res) => res.json())
      .then((data) => {
        setContactInfo(data.contactInfo);
      })
      .catch(console.error);

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
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">annahairbows</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Professional manufacturer of high quality children&apos;s hair accessories. 
              We specialize in hair clips, headbands, hair bows, and more.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-orange-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-orange-400 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-orange-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-orange-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Categories</h4>
            <ul className="space-y-2">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link 
                    href={`/products?category=${cat.slug}`} 
                    className="hover:text-orange-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3">
              {contactInfo?.address && (
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-orange-400" />
                  <span className="text-sm">{contactInfo.address}</span>
                </li>
              )}
              {contactInfo?.phone && (
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 flex-shrink-0 text-orange-400" />
                  <a href={`tel:${contactInfo.phone}`} className="text-sm hover:text-orange-400">
                    {contactInfo.phone}
                  </a>
                </li>
              )}
              {contactInfo?.email && (
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 flex-shrink-0 text-orange-400" />
                  <a href={`mailto:${contactInfo.email}`} className="text-sm hover:text-orange-400">
                    {contactInfo.email}
                  </a>
                </li>
              )}
              {contactInfo?.working_hours && (
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4 flex-shrink-0 text-orange-400" />
                  <span className="text-sm">{contactInfo.working_hours}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} annahairbows. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
