import { NextResponse } from 'next/server';
import { getNews, getNewsById, createNews, updateNews, deleteNews } from '@/lib/db';

// Check admin auth cookie
function isAdmin(request: Request): boolean {
  const cookie = request.headers.get('cookie') || '';
  return cookie.includes('admin_session=true');
}

export async function GET(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const newsItem = await getNewsById(id);
      if (!newsItem) {
        return NextResponse.json({ error: 'News not found' }, { status: 404 });
      }
      return NextResponse.json(newsItem);
    }

    const newsList = await getNews({});
    return NextResponse.json(newsList);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const newsItem = await createNews({
      title: data.title,
      slug: data.slug,
      content: data.content || null,
      summary: data.summary || null,
      imageUrl: data.image_url || null,
      category: data.category || 'company',
      isActive: data.is_active !== false,
      sortOrder: data.sort_order || 0,
    });
    return NextResponse.json({ success: true, data: newsItem });
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json({ error: 'Failed to create news' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json({ error: 'News ID is required' }, { status: 400 });
    }

    const newsItem = await updateNews(id, {
      title: updateData.title,
      slug: updateData.slug,
      content: updateData.content,
      summary: updateData.summary,
      imageUrl: updateData.image_url,
      category: updateData.category,
      isActive: updateData.is_active,
      sortOrder: updateData.sort_order,
    });
    return NextResponse.json({ success: true, data: newsItem });
  } catch (error) {
    console.error('Error updating news:', error);
    return NextResponse.json({ error: 'Failed to update news' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'News ID is required' }, { status: 400 });
    }

    await deleteNews(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json({ error: 'Failed to delete news' }, { status: 500 });
  }
}
