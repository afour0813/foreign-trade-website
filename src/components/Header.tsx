'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, ChevronDown, Globe } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useI18n, type Locale, locales } from '@/lib/i18n';

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
  const [langOpen, setLangOpen] = useState(false);
  const { locale, setLocale, t, localeNames, localeFlags } = useI18n();

  useEffect(() => {
    fetch('/api/site')
      .then((res) => res.json())
      .then((data) => setContactInfo(data.contactInfo))
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch('/api/categories?parentId=null')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(console.error);
  }, []);

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale);
    setLangOpen(false);
  };

  return (
    <header className="bg-white shadow-sm">
      {/* Top bar */}
      <div className="bg-orange-500 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            {contactInfo?.phone && (
              <a href={`tel:${contactInfo.phone}`} className="flex items-center gap-1 hover:opacity-80">
                📞 {contactInfo.phone}
              </a>
            )}
            {contactInfo?.email && (
              <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-1 hover:opacity-80 hidden sm:flex">
                ✉️ {contactInfo.email}
              </a>
            )}
          </div>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 hover:opacity-80 text-sm"
            >
              <Globe className="w-4 h-4" />
              <span>{localeFlags[locale]} {localeNames[locale]}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white text-gray-700 rounded-lg shadow-lg py-1 min-w-[140px] z-50">
                {locales.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => handleLocaleChange(loc)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-orange-50 flex items-center gap-2 ${
                      locale === loc ? 'bg-orange-50 text-orange-500 font-medium' : ''
                    }`}
                  >
                    <span>{localeFlags[loc]}</span>
                    <span>{localeNames[loc]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo-annahairbows.jpg"
              alt="AnnaHairBows"
              width={180}
              height={50}
              className="h-10 lg:h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
              {t('nav.home')}
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
              {t('nav.about')}
            </Link>
            <div className="relative group">
              <button className="text-gray-700 hover:text-orange-500 font-medium transition-colors flex items-center gap-1">
                {t('nav.products')} <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 bg-white shadow-lg rounded-lg py-2 min-w-[220px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link href="/products" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 font-medium">
                  {t('nav.allProducts')}
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.slug}`}
                    className="block px-4 py-2 text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/news" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
              {t('nav.news')}
            </Link>
            <Link href="/downloads" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
              {t('nav.download')}
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
              {t('nav.contact')}
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
                <Link href="/" className="text-gray-700 hover:text-orange-500 font-medium py-2" onClick={() => setIsOpen(false)}>
                  {t('nav.home')}
                </Link>
                <Link href="/about" className="text-gray-700 hover:text-orange-500 font-medium py-2" onClick={() => setIsOpen(false)}>
                  {t('nav.about')}
                </Link>
                <Link href="/products" className="text-gray-700 hover:text-orange-500 font-medium py-2" onClick={() => setIsOpen(false)}>
                  {t('nav.products')}
                </Link>
                {categories.length > 0 && (
                  <div className="pl-4 space-y-1">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/products?category=${cat.slug}`}
                        className="block py-1.5 text-gray-600 hover:text-orange-500 text-sm"
                        onClick={() => setIsOpen(false)}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
                <Link href="/news" className="text-gray-700 hover:text-orange-500 font-medium py-2" onClick={() => setIsOpen(false)}>
                  {t('nav.news')}
                </Link>
                <Link href="/downloads" className="text-gray-700 hover:text-orange-500 font-medium py-2" onClick={() => setIsOpen(false)}>
                  {t('nav.download')}
                </Link>
                <Link href="/contact" className="text-gray-700 hover:text-orange-500 font-medium py-2" onClick={() => setIsOpen(false)}>
                  {t('nav.contact')}
                </Link>

                {/* Mobile Language Switcher */}
                <div className="border-t pt-4 mt-4">
                  <p className="text-sm text-gray-500 mb-2">Language / 언어</p>
                  <div className="flex gap-2">
                    {locales.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => handleLocaleChange(loc)}
                        className={`px-3 py-2 rounded-lg text-sm flex items-center gap-1.5 ${
                          locale === loc
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-orange-50'
                        }`}
                      >
                        {localeFlags[loc]} {localeNames[loc]}
                      </button>
                    ))}
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
