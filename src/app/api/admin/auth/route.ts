import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import type { AdminUser } from '@/storage/database/shared/schema';
import * as crypto from 'crypto';

const ADMIN_SESSION_KEY = 'admin_session';
const SESSION_EXPIRY_HOURS = 24;

// Simple password hashing (in production, use bcrypt)
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// Generate session token
function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();
    
    // Find user by username
    const { data: user, error } = await client
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.error('Login error:', error);
      return NextResponse.json(
        { error: 'Login failed' },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Verify password
    if (!verifyPassword(password, user.password)) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Generate session token
    const sessionToken = generateToken();
    const expiresAt = new Date(Date.now() + SESSION_EXPIRY_HOURS * 60 * 60 * 1000).toISOString();

    // Store session (in a real app, store in database with expiration)
    const sessionData = {
      userId: user.id,
      username: user.username,
      token: sessionToken,
      expiresAt,
    };

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_SESSION_KEY, JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.COZE_PROJECT_ENV === 'PROD',
      sameSite: 'lax',
      expires: new Date(Date.now() + SESSION_EXPIRY_HOURS * 60 * 60 * 1000),
      path: '/',
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token: sessionToken,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(ADMIN_SESSION_KEY);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(ADMIN_SESSION_KEY);

    if (!session) {
      return NextResponse.json({ authenticated: false });
    }

    const sessionData = JSON.parse(session.value);
    
    // Check if session expired
    if (new Date(sessionData.expiresAt) < new Date()) {
      cookieStore.delete(ADMIN_SESSION_KEY);
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: sessionData.userId,
        username: sessionData.username,
      },
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ authenticated: false });
  }
}
