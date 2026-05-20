import crypto from 'node:crypto';

const SEP = '.';
const MIN_SECRET_LEN = 16;

function getSecret(): string {
  const secret = process.env.UNSUBSCRIBE_SECRET;
  if (!secret || secret.length < MIN_SECRET_LEN) {
    throw new Error(
      `UNSUBSCRIBE_SECRET is not configured (need at least ${MIN_SECRET_LEN} chars)`
    );
  }
  return secret;
}

function normalize(email: string): string {
  return email.trim().toLowerCase();
}

function sign(email: string): string {
  return crypto
    .createHmac('sha256', getSecret())
    .update(email)
    .digest('base64url');
}

export function signUnsubscribeToken(email: string): string {
  const normalized = normalize(email);
  const payload = Buffer.from(normalized, 'utf8').toString('base64url');
  return `${payload}${SEP}${sign(normalized)}`;
}

export function verifyUnsubscribeToken(token: unknown): string | null {
  if (typeof token !== 'string' || token.length === 0) return null;

  const idx = token.indexOf(SEP);
  if (idx <= 0 || idx === token.length - 1) return null;

  const payload = token.slice(0, idx);
  const providedSig = token.slice(idx + 1);

  let email: string;
  try {
    email = Buffer.from(payload, 'base64url').toString('utf8');
  } catch {
    return null;
  }
  if (!email.includes('@')) return null;

  const expectedSig = sign(email);
  const a = Buffer.from(providedSig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length) return null;
  if (!crypto.timingSafeEqual(a, b)) return null;

  return email;
}
