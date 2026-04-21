'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BannerCarousel } from '@/components/BannerCarousel';
import { ProductCard } from '@/components/ProductCard';
import { CategoryCard } from '@/components/CategoryCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface Product {
  id: string;
  name: string;
  slug: string;
  images?: string[];
  price?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  image_url?: string;
  description?: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [aboutUs, setAboutUs] = useState('');
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();

  useEffect(() => {
    fetch('/api/home')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setCategories(data.categories || []);
        setAboutUs(data.aboutUs || '');
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch home data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-orange-500">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <main>
      {/* Banner Carousel */}
      <BannerCarousel />

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('home.categories.title')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t('home.categories.subtitle')}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.slice(0, 8).map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/products">
              <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50">
                {t('nav.allProducts')} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('home.featured.title')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t('home.featured.subtitle')}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/products">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                {t('home.featured.cta')} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-16 bg-orange-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">{t('home.about.title')}</h2>
              {aboutUs ? (
                aboutUs.split('\\n').map((paragraph, idx) => (
                  <p key={idx} className="text-gray-600 leading-relaxed mb-4">{paragraph}</p>
                ))
              ) : (
                <p className="text-gray-600 leading-relaxed mb-4">
                  We are a professional manufacturer of high quality children&apos;s hair accessories.
                </p>
              )}
              <Link href="/about">
                <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-100">
                  {t('home.about.cta')} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
              <Image src="/images/about-banner.jpg" alt="About AnnaHairBows" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('home.cta.title')}</h2>
          <p className="text-orange-100 mb-8 max-w-2xl mx-auto">{t('home.cta.subtitle')}</p>
          <Link href="/contact">
            <Button variant="secondary" className="bg-white text-orange-500 hover:bg-orange-50">
              {t('home.cta.button')} <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
