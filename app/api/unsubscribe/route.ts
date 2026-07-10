import { type NextRequest, NextResponse } from 'next/server';
import { verifyUnsubscribeToken } from '@/lib/email/unsubscribeToken';
import { markContactUnsubscribed } from '@/lib/email/unsubscribe';

export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  const email = verifyUnsubscribeToken(token);

  if (!email) {
    return new NextResponse('Invalid or missing token', { status: 400 });
  }

  const result = await markContactUnsubscribed(email);
  if (!result.ok) {
    return new NextResponse('Could not process unsubscribe', { status: 500 });
  }

  return new NextResponse(null, { status: 200 });
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  const target = new URL('/unsubscribe', req.nextUrl.origin);
  if (token) target.searchParams.set('token', token);
  return NextResponse.redirect(target, 303);
}
