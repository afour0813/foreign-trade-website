import { NextResponse } from 'next/server';
import { getDownloads, createDownload, updateDownload, deleteDownload, incrementDownloadCount } from '@/lib/db';

function isAdmin(request: Request): boolean {
  const cookie = request.headers.get('cookie') || '';
  return cookie.includes('admin_session=true');
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;

    if (!isAdmin(request)) {
      // Public access - only active downloads
      const downloads = await getDownloads({ category, active: true });
      return NextResponse.json(downloads);
    }

    const downloads = await getDownloads({ category });
    return NextResponse.json(downloads);
  } catch (error) {
    console.error('Error fetching downloads:', error);
    return NextResponse.json({ error: 'Failed to fetch downloads' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const download = await createDownload({
      title: data.title,
      slug: data.slug,
      description: data.description || null,
      fileUrl: data.file_url || null,
      fileSize: data.file_size || null,
      category: data.category || 'help',
      isActive: data.is_active !== false,
      sortOrder: data.sort_order || 0,
    });
    return NextResponse.json({ success: true, data: download });
  } catch (error) {
    console.error('Error creating download:', error);
    return NextResponse.json({ error: 'Failed to create download' }, { status: 500 });
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
      return NextResponse.json({ error: 'Download ID is required' }, { status: 400 });
    }

    // If this is a download count increment (public)
    if (updateData.action === 'increment') {
      await incrementDownloadCount(id);
      return NextResponse.json({ success: true });
    }

    const download = await updateDownload(id, {
      title: updateData.title,
      slug: updateData.slug,
      description: updateData.description,
      fileUrl: updateData.file_url,
      fileSize: updateData.file_size,
      category: updateData.category,
      isActive: updateData.is_active,
      sortOrder: updateData.sort_order,
    });
    return NextResponse.json({ success: true, data: download });
  } catch (error) {
    console.error('Error updating download:', error);
    return NextResponse.json({ error: 'Failed to update download' }, { status: 500 });
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
      return NextResponse.json({ error: 'Download ID is required' }, { status: 400 });
    }

    await deleteDownload(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting download:', error);
    return NextResponse.json({ error: 'Failed to delete download' }, { status: 500 });
  }
}
