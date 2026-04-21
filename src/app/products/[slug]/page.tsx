'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useI18n } from '@/lib/i18n';

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  images?: string[];
  price?: string;
  min_order?: string;
  material?: string;
  size?: string;
  color?: string;
  packaging?: string;
  moq?: string;
  categories?: {
    id: string;
    name: string;
    slug: string;
  };
}

interface ContactInfo {
  email?: string;
  phone?: string;
}

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { t } = useI18n();
  const [product, setProduct] = useState<Product | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (!slug) return;

    Promise.all([
      fetch(`/api/products?slug=${slug}`).then((res) => res.json()),
      fetch('/api/site').then((res) => res.json()),
    ])
      .then(([productData, siteData]) => {
        if (productData && !productData.error) {
          setProduct(productData);
        }
        setContactInfo(siteData.contactInfo);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch product:', err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{t('products.notFound')}</h1>
        <p className="text-gray-600 mb-8">
          {t('products.notFoundDesc')}
        </p>
        <Link href="/products">
          <Button className="bg-orange-500 hover:bg-orange-600">{t('products.backToProducts')}</Button>
        </Link>
      </div>
    );
  }

  const images = product.images || [];
  const currentImage = images[selectedImage] || '/placeholder.jpg';

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-orange-500">
              {t('products.breadcrumb.home')}
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/products" className="text-gray-500 hover:text-orange-500">
              {t('products.breadcrumb.products')}
            </Link>
            {product.categories && (
              <>
                <span className="text-gray-400">/</span>
                <Link
                  href={`/products?category=${product.categories.slug}`}
                  className="text-gray-500 hover:text-orange-500"
                >
                  {product.categories.name}
                </Link>
              </>
            )}
            <span className="text-gray-400">/</span>
            <span className="text-gray-800">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={currentImage}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? 'border-orange-500'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} - ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
            
            {product.price && (
              <p className="text-2xl text-orange-500 font-bold mb-6">{product.price}</p>
            )}

            {/* Product Details */}
            <div className="space-y-3 mb-8">
              {product.categories && (
                <div className="flex">
                  <span className="w-24 text-gray-500">{t('products.category')}:</span>
                  <Link
                    href={`/products?category=${product.categories.slug}`}
                    className="text-orange-500 hover:underline"
                  >
                    {product.categories.name}
                  </Link>
                </div>
              )}
              {product.material && (
                <div className="flex">
                  <span className="w-24 text-gray-500">{t('products.material')}:</span>
                  <span className="text-gray-800">{product.material}</span>
                </div>
              )}
              {product.size && (
                <div className="flex">
                  <span className="w-24 text-gray-500">{t('products.size')}:</span>
                  <span className="text-gray-800">{product.size}</span>
                </div>
              )}
              {product.color && (
                <div className="flex">
                  <span className="w-24 text-gray-500">{t('products.color')}:</span>
                  <span className="text-gray-800">{product.color}</span>
                </div>
              )}
              {product.moq && (
                <div className="flex">
                  <span className="w-24 text-gray-500">{t('products.moq')}:</span>
                  <span className="text-gray-800">{product.moq}</span>
                </div>
              )}
              {product.packaging && (
                <div className="flex">
                  <span className="w-24 text-gray-500">{t('products.packaging')}:</span>
                  <span className="text-gray-800">{product.packaging}</span>
                </div>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">{t('products.description')}</h2>
                <p className="text-gray-600 whitespace-pre-wrap">{product.description}</p>
              </div>
            )}

            {/* Inquiry Button */}
            <div className="bg-orange-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('products.interested')}</h3>
              <p className="text-gray-600 mb-4">
                {t('products.interestedDesc')}
              </p>
              <div className="space-y-2 mb-4">
                {contactInfo?.email && (
                  <p className="text-gray-600">
                    <span className="font-medium">{t('contact.emailLabel')}:</span>{' '}
                    <a href={`mailto:${contactInfo.email}`} className="text-orange-500 hover:underline">
                      {contactInfo.email}
                    </a>
                  </p>
                )}
                {contactInfo?.phone && (
                  <p className="text-gray-600">
                    <span className="font-medium">{t('contact.phone')}:</span>{' '}
                    <a href={`tel:${contactInfo.phone}`} className="text-orange-500 hover:underline">
                      {contactInfo.phone}
                    </a>
                  </p>
                )}
              </div>
              <Link href="/contact">
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  {t('products.inquiry')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
