export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { auth } = await import('@/lib/auth');
    return NextResponse.json({
      authOk: !!auth,
      envs: {
        BETTER_AUTH_SECRET: !!process.env.BETTER_AUTH_SECRET,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
        MONGODB_URI: !!process.env.MONGODB_URI,
        DB_NAME: !!process.env.DB_NAME,
        GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 });
  }
}
