import { NextRequest, NextResponse } from 'next/server';
import { getCategoryBySlug, createCategory, updateCategory, deleteCategory } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');

    if (slug) {
      const category = await getCategoryBySlug(slug);
      if (!category) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
      }
      return NextResponse.json(category);
    }

    if (id) {
      const client = require('@/storage/database/supabase-client').getSupabaseClient();
      const { data, error } = await client
        .from('categories')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw new Error(`Query failed: ${error.message}`);
      if (!data) return NextResponse.json({ error: 'Category not found' }, { status: 404 });
      
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: 'ID or slug is required' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (!data.name || !data.slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    const category = await createCategory({
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      imageUrl: data.image_url || null,
      parentId: data.parent_id || null,
      sortOrder: data.sort_order || 0,
      isActive: data.is_active !== false,
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const id = data.id;

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    const category = await updateCategory(id, {
      name: data.name,
      slug: data.slug,
      description: data.description,
      imageUrl: data.image_url,
      parentId: data.parent_id,
      sortOrder: data.sort_order,
      isActive: data.is_active,
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    await deleteCategory(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
