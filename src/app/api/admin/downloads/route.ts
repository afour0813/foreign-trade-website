import { NextResponse } from 'next/server';
import { getDownloads, createDownload, updateDownload, deleteDownload, incrementDownloadCount } from '@/lib/db';
import { checkAdminAuth } from '@/lib/admin-auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const isAdminUser = await checkAdminAuth();

    if (isAdminUser) {
      const downloads = await getDownloads({ category });
      return NextResponse.json(downloads);
    } else {
      const downloads = await getDownloads({ category, active: true });
      return NextResponse.json(downloads);
    }
  } catch (error) {
    console.error('Error fetching downloads:', error);
    return NextResponse.json({ error: 'Failed to fetch downloads' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await checkAdminAuth())) {
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
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json({ error: 'Download ID is required' }, { status: 400 });
    }

    // If this is a download count increment (public, no auth needed)
    if (updateData.action === 'increment') {
      await incrementDownloadCount(id);
      return NextResponse.json({ success: true });
    }

    // Admin operations require auth
    if (!(await checkAdminAuth())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
  if (!(await checkAdminAuth())) {
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
