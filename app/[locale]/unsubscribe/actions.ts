'use server';

import { redirect } from 'next/navigation';
import { verifyUnsubscribeToken } from '@/lib/email/unsubscribe-token';
import { markContactUnsubscribed } from '@/lib/email/unsubscribe';

export async function confirmUnsubscribeAction(formData: FormData) {
  const token = formData.get('token');
  if (typeof token !== 'string') {
    redirect('/unsubscribe?status=invalid');
  }

  const email = verifyUnsubscribeToken(token);
  if (!email) {
    redirect('/unsubscribe?status=invalid');
  }

  const result = await markContactUnsubscribed(email);
  if (!result.ok) {
    redirect(`/unsubscribe?status=error&token=${encodeURIComponent(token)}`);
  }

  redirect(`/unsubscribe?status=done&e=${encodeURIComponent(email)}`);
}
