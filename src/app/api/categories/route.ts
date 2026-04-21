import { NextRequest, NextResponse } from 'next/server';
import { getCategories, getCategoryBySlug } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get('slug');
    const parentId = searchParams.get('parentId');

    // 获取单个分类
    if (slug) {
      const category = await getCategoryBySlug(slug);
      if (!category) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
      }
      return NextResponse.json(category);
    }

    // 按父级获取分类
    const categories = await getCategories({
      parentId: parentId === 'null' ? null : parentId || null,
      active: true,
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
