import { cookies } from 'next/headers';
import { defaultLocale, locales, type Locale } from './config';

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('locale')?.value as Locale | undefined;

  if (localeCookie && locales.includes(localeCookie)) {
    return localeCookie;
  }

  return defaultLocale;
}
