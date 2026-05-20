import { RESEND_AUDIENCE_ID, getResend } from '@/lib/email/resend';

export type IUnsubscribeResult =
  | { ok: true }
  | { ok: false; error: 'not_configured' | 'server_error' };

export async function markContactUnsubscribed(
  email: string
): Promise<IUnsubscribeResult> {
  if (!RESEND_AUDIENCE_ID) {
    console.error('[unsubscribe] RESEND_AUDIENCE_ID is not configured');
    return { ok: false, error: 'not_configured' };
  }

  let resend: ReturnType<typeof getResend>;
  try {
    resend = getResend();
  } catch (err) {
    console.error('[unsubscribe] resend client init failed', err);
    return { ok: false, error: 'server_error' };
  }

  // Update first (cheapest path — contact usually already exists from subscribe).
  // If contact is missing, fall back to create with unsubscribed=true.
  const updateRes = await resend.contacts.update({
    audienceId: RESEND_AUDIENCE_ID,
    email,
    unsubscribed: true,
  });

  if (!updateRes.error) {
    return { ok: true };
  }

  const createRes = await resend.contacts.create({
    audienceId: RESEND_AUDIENCE_ID,
    email,
    unsubscribed: true,
  });

  if (createRes.error) {
    console.error('[unsubscribe] resend update+create failed', {
      email,
      updateError: updateRes.error,
      createError: createRes.error,
    });
    return { ok: false, error: 'server_error' };
  }

  return { ok: true };
}
