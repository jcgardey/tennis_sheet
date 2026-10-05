import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import en from '../messages/en.json';
import es from '../messages/es.json';
import { routing } from './routing';

const messages = { en, es };

export default getRequestConfig(async ({ locale: requestLocale }) => {
  const requestedLocale = await requestLocale;
  const locale = hasLocale(routing.locales, requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;

  return { locale, messages: messages[locale] };
});
