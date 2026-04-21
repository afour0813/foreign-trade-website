import { NextResponse } from 'next/server';
import { getProducts, getBanners, getCategories, getContactInfo, getSiteSetting } from '@/lib/db';

export async function GET() {
  try {
    const [products, banners, categories, contactInfo, aboutUs] = await Promise.all([
      getProducts({ featured: true, limit: 12 }),
      getBanners({ active: true }),
      getCategories({ active: true }),
      getContactInfo(),
      getSiteSetting('about_us'),
    ]);

    return NextResponse.json({
      products,
      banners,
      categories,
      contactInfo,
      aboutUs: aboutUs?.value || '',
    });
  } catch (error) {
    console.error('Error fetching home data:', error);
    return NextResponse.json({ error: 'Failed to fetch home data' }, { status: 500 });
  }
}
