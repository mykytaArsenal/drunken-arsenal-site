import { cookies } from 'next/headers';
import { defaultLocale, locales, type ILocale } from './config';

export async function getLocale(): Promise<ILocale> {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('locale')?.value as ILocale | undefined;

  if (localeCookie && locales.includes(localeCookie)) {
    return localeCookie;
  }

  return defaultLocale;
}
