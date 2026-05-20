import { Resend } from 'resend';

let client: Resend | null = null;

export function getResend(): Resend {
  if (client) return client;
  const apiKey = process.env.RESEND_KEY;
  if (!apiKey) {
    throw new Error('RESEND_KEY is not configured');
  }
  client = new Resend(apiKey);
  return client;
}

export const EMAIL_FROM =
  process.env.EMAIL_FROM ?? 'Drunken Arsenal <onboarding@resend.dev>';

export const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;
