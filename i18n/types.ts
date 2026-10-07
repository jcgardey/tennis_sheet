export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];
export const DEFAULT_LOCALE: Locale = 'es';
export const i18nNamespaces = [
  'Metadata',
  'Navigation',
  'Home',
  'Booking',
  'Notifications',
] as const;
export type I18nNamespace = (typeof i18nNamespaces)[number];
