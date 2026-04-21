import { NextResponse } from 'next/server';
import { createInquiry } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: 'Name, email and message are required' },
        { status: 400 }
      );
    }

    const inquiry = await createInquiry({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      company: data.company || null,
      subject: data.subject || null,
      message: data.message,
      product_id: data.product_id || null,
      status: 'pending',
      is_read: false,
    } as Record<string, unknown>);

    return NextResponse.json({ success: true, data: inquiry });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
  }
}
