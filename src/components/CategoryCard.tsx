'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

interface Category {
  id: string;
  name: string;
  slug: string;
  image_url?: string;
  description?: string;
}

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/products?category=${category.slug}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {category.image_url ? (
            <Image
              src={category.image_url}
              alt={category.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-pink-100">
              <span className="text-4xl">🎀</span>
            </div>
          )}
        </div>
        <CardContent className="p-4 text-center">
          <h3 className="font-medium text-gray-800 group-hover:text-pink-500 transition-colors">
            {category.name}
          </h3>
          {category.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {category.description}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
