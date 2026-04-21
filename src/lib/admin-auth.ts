import { cookies } from 'next/headers';

export async function checkAdminAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('admin_session');
    if (!sessionCookie?.value) return false;

    const session = JSON.parse(sessionCookie.value);
    if (!session.userId || !session.token) return false;

    // Check if session is expired
    if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
