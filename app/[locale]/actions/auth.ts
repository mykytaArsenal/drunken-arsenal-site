'use server';

import { redirect } from 'next/navigation';
import { pbkdf2Sync, randomBytes } from 'node:crypto';
import { sql } from '@/lib/db';
import { cookies } from 'next/headers';

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, hashedPassword: string): boolean {
  const [salt, hash] = hashedPassword.split(':');
  const verifyHash = pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString(
    'hex'
  );
  return hash === verifyHash;
}

function generateId(): string {
  return randomBytes(16).toString('hex');
}

const SESSION_COOKIE_NAME = 'auth_session';
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days

type IAuthActionState = { error: string } | undefined;

function getErrorMessage(error: unknown): string | undefined {
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { message: unknown }).message;
    if (typeof message === 'string') return message;
  }
  return undefined;
}

function getErrorCode(error: unknown): string | undefined {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code: unknown }).code;
    if (typeof code === 'string') return code;
  }
  return undefined;
}

export async function signUpAction(
  prevState: IAuthActionState,
  formData: FormData
): Promise<IAuthActionState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters' };
  }

  try {
    const hashedPassword = hashPassword(password);
    const userId = generateId();

    await sql`
      INSERT INTO "User" ("id", "email", "name", "password", "createdAt", "updatedAt")
      VALUES (${userId}, ${email}, ${name || null}, ${hashedPassword}, NOW(), NOW())
    `;

    // Create session
    const sessionId = generateId();
    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_DURATION,
    });

    cookieStore.set(`session_${sessionId}`, userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_DURATION,
    });

    redirect('/account');
  } catch (error: unknown) {
    console.error('[v0] Sign up error:', error);
    const message = getErrorMessage(error);
    const code = getErrorCode(error);
    if (message?.includes('duplicate') || code === '23505') {
      return { error: 'Email already exists' };
    }
    if (message?.includes('relation') && message.includes('does not exist')) {
      return {
        error: 'Database not initialized. Please run SQL scripts first.',
      };
    }
    return { error: message || 'Failed to create account' };
  }
}

export async function signInAction(
  prevState: IAuthActionState,
  formData: FormData
): Promise<IAuthActionState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  try {
    const users = await sql`
      SELECT * FROM "User"
      WHERE "email" = ${email}
      LIMIT 1
    `;

    if (users.length === 0) {
      return { error: 'Invalid email or password' };
    }

    const user = users[0] as {
      id: string;
      email: string;
      name: string | null;
      password: string;
    };

    if (!verifyPassword(password, user.password)) {
      return { error: 'Invalid email or password' };
    }

    // Create session
    const sessionId = generateId();
    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_DURATION,
    });

    cookieStore.set(`session_${sessionId}`, user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_DURATION,
    });

    redirect('/account');
  } catch (error: unknown) {
    console.error('[v0] Sign in error:', error);
    const message = getErrorMessage(error);
    if (message?.includes('relation') && message.includes('does not exist')) {
      return {
        error: 'Database not initialized. Please run SQL scripts first.',
      };
    }
    return { error: message || 'Failed to sign in' };
  }
}

export async function signOutAction() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (sessionId) {
    cookieStore.delete(`session_${sessionId}`);
    cookieStore.delete(SESSION_COOKIE_NAME);
  }

  redirect('/');
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionId) {
      return null;
    }

    const userId = cookieStore.get(`session_${sessionId}`)?.value;

    if (!userId) {
      return null;
    }

    const users = await sql`
      SELECT "id", "email", "name" FROM "User"
      WHERE "id" = ${userId}
      LIMIT 1
    `;

    if (users.length === 0) {
      return null;
    }

    const user = users[0] as { id: string; email: string; name: string | null };
    return user;
  } catch (error) {
    console.error('[v0] Get current user error:', error);
    return null;
  }
}
