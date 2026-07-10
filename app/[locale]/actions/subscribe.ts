'use server';

import { z } from 'zod';
import { EMAIL_FROM, RESEND_AUDIENCE_ID, getResend } from '@/lib/email/resend';
import { signUnsubscribeToken } from '@/lib/email/unsubscribeToken';
import { buildWelcomeEmail } from '@/lib/email/welcome';
import { SUPPORT_EMAIL } from '@/lib/i18n/brand';

const subscribeSchema = z.object({
  email: z.string().trim().email(),
  locale: z.string().min(2).max(5),
  source: z.string().max(64).optional(),
});

function getAppUrl(): string {
  const raw = process.env.APP_URL ?? 'https://drunkenarsenal.com';
  return raw.replace(/\/+$/, '');
}

export type ISubscribeInput = z.infer<typeof subscribeSchema>;

export type ISubscribeResult =
  | { ok: true }
  | { ok: false; error: 'invalid_email' | 'server_error' };

export async function subscribe(
  input: ISubscribeInput
): Promise<ISubscribeResult> {
  const parsed = subscribeSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: 'invalid_email' };
  }

  const { email, locale, source } = parsed.data;

  let resend: ReturnType<typeof getResend>;
  try {
    resend = getResend();
  } catch (err) {
    console.error('[subscribe] resend client init failed', err);
    return { ok: false, error: 'server_error' };
  }

  if (RESEND_AUDIENCE_ID) {
    try {
      const { error } = await resend.contacts.create({
        audienceId: RESEND_AUDIENCE_ID,
        email,
        unsubscribed: false,
      });
      // Duplicate / already-in-audience is not fatal — log and continue to send welcome.
      if (error) {
        console.warn('[subscribe] contacts.create', {
          email,
          locale,
          source,
          error,
        });
      }
    } catch (err) {
      console.warn('[subscribe] contacts.create threw', err);
    }
  }

  const appUrl = getAppUrl();
  const token = signUnsubscribeToken(email);
  const unsubscribeUrl = `${appUrl}/unsubscribe?token=${encodeURIComponent(token)}`;
  const oneClickUrl = `${appUrl}/api/unsubscribe?token=${encodeURIComponent(token)}`;
  const recipeManualUrl = `${appUrl}/recipes/ShotWave_Recipe_Manual_EN.pdf`;
  const mailtoUnsubscribe = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
    'Unsubscribe'
  )}`;

  const welcome = buildWelcomeEmail({ unsubscribeUrl, recipeManualUrl });

  try {
    const { data, error: sendError } = await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: welcome.subject,
      html: welcome.html,
      text: welcome.text,
      headers: {
        'List-Unsubscribe': `<${mailtoUnsubscribe}>, <${oneClickUrl}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
      tags: [
        { name: 'locale', value: sanitizeTagValue(locale) },
        ...(source
          ? [{ name: 'source', value: sanitizeTagValue(source) }]
          : []),
        { name: 'kind', value: 'welcome' },
      ],
    });

    if (sendError) {
      console.error('[subscribe] emails.send returned error', {
        email,
        locale,
        source,
        from: EMAIL_FROM,
        error: sendError,
      });
      return { ok: false, error: 'server_error' };
    }

    console.log('[subscribe] emails.send ok', { email, id: data?.id });
    return { ok: true };
  } catch (err) {
    console.error('[subscribe] emails.send threw', {
      email,
      locale,
      source,
      from: EMAIL_FROM,
      err,
    });
    return { ok: false, error: 'server_error' };
  }
}

// Resend tag values allow only [a-zA-Z0-9_-], max 256 chars.
function sanitizeTagValue(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 256);
}
