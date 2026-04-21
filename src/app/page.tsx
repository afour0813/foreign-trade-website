'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BannerCarousel } from '@/components/BannerCarousel';
import { ProductCard } from '@/components/ProductCard';
import { CategoryCard } from '@/components/CategoryCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  slug: string;
  images?: string[];
  price?: string;
  categories?: {
    name: string;
    slug: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  image_url?: string;
  description?: string;
}

interface Banner {
  id: string;
  title?: string;
  image_url: string;
  link_url?: string;
  description?: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [aboutUs, setAboutUs] = useState('');
  const [loading, setLoading] = useState(true);

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
        <div className="animate-pulse text-orange-500">Loading...</div>
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
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Categories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our wide range of high-quality children&apos;s hair accessories
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.slice(0, 8).map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/products">
              <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50">
                View All Products
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Check out our most popular and trending hair accessories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No products available yet. Check back soon!</p>
            </div>
          )}

          <div className="text-center mt-8">
            <Link href="/products">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                View All Products
                <ArrowRight className="ml-2 w-4 h-4" />
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
              <h2 className="text-3xl font-bold text-gray-800 mb-6">About Us</h2>
              {aboutUs ? (
                aboutUs.split('\\n').map((paragraph, idx) => (
                  <p key={idx} className="text-gray-600 leading-relaxed mb-4">{paragraph}</p>
                ))
              ) : (
                <>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    We are a professional manufacturer which mainly produces high quality
                    Children&apos;s hair accessories including Hair clips, Headbands, Elastic Hair Bands, Hair Bows,
                    Ponytail Holders, Baby Gift sets, Holiday Bows, Hair Ties and more.
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    With a wide range, good quality, reasonable prices and stylish designs, our products are
                    extensively recognized and trusted by customers worldwide.
                  </p>
                </>
              )}
              <Link href="/about">
                <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-100">
                  Learn More About Us
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/images/about-banner.jpg"
                alt="About annahairbows"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Us</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">High Quality</h3>
              <p className="text-gray-600">
                We use premium materials to ensure every product meets the highest quality standards.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Stylish Design</h3>
              <p className="text-gray-600">
                Our designs are trendy, colorful, and loved by children and parents alike.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚚</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Shipping</h3>
              <p className="text-gray-600">
                We offer fast and reliable shipping worldwide to ensure your orders arrive quickly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-orange-100 mb-8 max-w-2xl mx-auto">
            Contact us today for wholesale inquiries, custom orders, or any questions about our products.
          </p>
          <Link href="/contact">
            <Button variant="secondary" className="bg-white text-orange-500 hover:bg-orange-50">
              Contact Us Now
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
