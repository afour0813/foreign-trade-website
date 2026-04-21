import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import * as crypto from 'crypto';

// Simple password hashing
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const { username, password, email } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Check if any admin exists
    const client = getSupabaseClient();
    const { data: existingUsers } = await client
      .from('admin_users')
      .select('id')
      .limit(1);

    // Only allow registration if no admin exists (first-time setup)
    // In production, you might want to remove this check and use a secure setup process
    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'Admin users already exist. Registration is disabled.' },
        { status: 403 }
      );
    }

    const hashedPassword = hashPassword(password);

    const { data: user, error } = await client
      .from('admin_users')
      .insert({
        username,
        password: hashedPassword,
        email: email || null,
        is_active: true,
      })
      .select('id, username, email')
      .single();

    if (error) {
      if (error.message.includes('unique')) {
        return NextResponse.json(
          { error: 'Username already exists' },
          { status: 400 }
        );
      }
      console.error('Registration error:', error);
      return NextResponse.json(
        { error: 'Registration failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
