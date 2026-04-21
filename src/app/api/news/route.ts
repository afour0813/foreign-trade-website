import { NextResponse } from 'next/server';
import { getNews, getNewsBySlug } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const slug = searchParams.get('slug') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    if (slug) {
      const newsItem = await getNewsBySlug(slug);
      if (!newsItem) {
        return NextResponse.json({ error: 'News not found' }, { status: 404 });
      }
      return NextResponse.json(newsItem);
    }

    const news = await getNews({ category, limit });
    return NextResponse.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
