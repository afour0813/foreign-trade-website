import { NextRequest, NextResponse } from 'next/server';
import { getProductById, createProduct, updateProduct, deleteProduct, getCategories } from '@/lib/db';
import type { Product } from '@/storage/database/shared/schema';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (id) {
      const product = await getProductById(id);
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json(product);
    }

    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Get categories for name lookup
    const categories = await getCategories({ active: true });
    const category = categories.find((c) => c.id === data.category_id);

    const product = await createProduct({
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      price: data.price || null,
      categoryId: data.category_id || null,
      images: data.images || [],
      isFeatured: data.is_featured || false,
      isActive: data.is_active !== false,
      sortOrder: data.sort_order || 0,
      minOrder: data.min_order || null,
      material: data.material || null,
      size: data.size || null,
      color: data.color || null,
      packaging: data.packaging || null,
      moq: data.moq || null,
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const id = data.id;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const product = await updateProduct(id, {
      name: data.name,
      slug: data.slug,
      description: data.description,
      price: data.price,
      categoryId: data.category_id,
      images: data.images,
      isFeatured: data.is_featured,
      isActive: data.is_active,
      sortOrder: data.sort_order,
      minOrder: data.min_order,
      material: data.material,
      size: data.size,
      color: data.color,
      packaging: data.packaging,
      moq: data.moq,
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    await deleteProduct(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
