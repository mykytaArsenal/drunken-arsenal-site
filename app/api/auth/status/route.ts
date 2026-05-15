import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/app/[locale]/actions/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    return NextResponse.json({ isSignedIn: !!user });
  } catch (error) {
    console.error('[v0] Error checking auth status:', error);
    return NextResponse.json({ isSignedIn: false });
  }
}
