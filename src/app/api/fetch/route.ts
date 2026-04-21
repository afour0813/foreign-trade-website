import { NextRequest, NextResponse } from 'next/server';
import { FetchClient, Config } from 'coze-coding-dev-sdk';

export async function POST(request: NextRequest) {
  const { url } = await request.json();
  
  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const config = new Config();
    const client = new FetchClient(config);
    const response = await client.fetch(url);

    return NextResponse.json({
      title: response.title,
      content: response.content,
      url: response.url,
      status_code: response.status_code,
    });
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch URL' },
      { status: 500 }
    );
  }
}
