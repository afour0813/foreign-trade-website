import { NextResponse } from 'next/server';
import { getContactInfo, getAllSiteSettings } from '@/lib/db';

export async function GET() {
  try {
    const [contactInfo, siteSettings] = await Promise.all([
      getContactInfo(),
      getAllSiteSettings(),
    ]);

    // 将设置转换为键值对
    const settings: Record<string, string> = {};
    siteSettings.forEach((setting) => {
      settings[setting.key] = setting.value || '';
    });

    return NextResponse.json({
      contactInfo,
      settings,
    });
  } catch (error) {
    console.error('Error fetching site info:', error);
    return NextResponse.json({ error: 'Failed to fetch site info' }, { status: 500 });
  }
}
