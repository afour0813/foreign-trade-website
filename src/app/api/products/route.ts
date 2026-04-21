import { NextRequest, NextResponse } from 'next/server';
import { getProducts, getProductBySlug, getCategoryBySlug } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get('slug');
    const categorySlug = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = parseInt(searchParams.get('offset') || '0');

    // 获取单个产品
    if (slug) {
      const product = await getProductBySlug(slug);
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json(product);
    }

    // 按分类获取产品
    let categoryId: string | undefined;
    if (categorySlug) {
      const category = await getCategoryBySlug(categorySlug);
      if (category) {
        categoryId = category.id;
      }
    }

    const products = await getProducts({
      categoryId,
      limit,
      offset,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
