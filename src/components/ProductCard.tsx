'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

interface Product {
  id: string;
  name: string;
  slug: string;
  images?: string[];
  price?: string;
  category_id?: string;
  categories?: {
    name: string;
    slug: string;
  };
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const images = product.images || [];
  const imageUrl = images[0] || '/placeholder.jpg';
  const categorySlug = product.categories?.slug;

  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-medium text-gray-800 group-hover:text-orange-500 transition-colors line-clamp-2">
            {product.name}
          </h3>
          {product.price && (
            <p className="text-orange-500 font-semibold mt-2">
              {product.price}
            </p>
          )}
          {categorySlug && (
            <p className="text-sm text-gray-500 mt-1">
              {product.categories?.name}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
