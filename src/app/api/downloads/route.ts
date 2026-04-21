import { NextResponse } from 'next/server';
import { getDownloads } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;

    const downloads = await getDownloads({ category, active: true });
    return NextResponse.json(downloads);
  } catch (error) {
    console.error('Error fetching downloads:', error);
    return NextResponse.json({ error: 'Failed to fetch downloads' }, { status: 500 });
  }
}
