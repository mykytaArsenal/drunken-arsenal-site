'use server';

import { z } from 'zod';

const subscribeSchema = z.object({
  email: z.string().trim().email(),
  locale: z.string().min(2).max(5),
  source: z.string().max(64).optional(),
});

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

  // Phase 3: forward { email, tags: [locale, source] } to Resend.
  console.log('[subscribe]', parsed.data);

  return { ok: true };
}
