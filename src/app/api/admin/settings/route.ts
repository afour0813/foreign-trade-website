import { NextRequest, NextResponse } from 'next/server';
import { getContactInfo, saveContactInfo, getAllSiteSettings, upsertSiteSetting } from '@/lib/db';
import { checkAdminAuth } from '@/lib/admin-auth';

export async function GET() {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const [contactInfo, siteSettings] = await Promise.all([
      getContactInfo(),
      getAllSiteSettings(),
    ]);

    // Convert settings array to key-value object
    const settings: Record<string, string> = {};
    siteSettings.forEach((setting) => {
      settings[setting.key] = setting.value || '';
    });

    return NextResponse.json({
      contactInfo,
      settings,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const data = await request.json();
    
    // Save contact info
    if (data.contactInfo) {
      await saveContactInfo(data.contactInfo);
    }

    // Save site settings
    if (data.settings && typeof data.settings === 'object') {
      for (const [key, value] of Object.entries(data.settings)) {
        await upsertSiteSetting({
          key,
          value: value as string,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
