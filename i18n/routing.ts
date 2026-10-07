import { defineRouting } from 'next-intl/routing';
import { DEFAULT_LOCALE, locales } from './types';

export const routing = defineRouting({
  locales: locales,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'always',
  localeDetection: false,
});
