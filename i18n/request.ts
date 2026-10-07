import { getRequestConfig, type RequestConfig } from 'next-intl/server';
import { DEFAULT_LOCALE, i18nNamespaces, locales, type Locale } from './types';

export default getRequestConfig(async ({ locale: requestLocale }) => {
  let requestedLocale = await requestLocale;
  if (!locales.includes(requestedLocale as Locale)) {
    requestedLocale = DEFAULT_LOCALE;
  }

  const config: RequestConfig = {
    locale: requestedLocale!,
    messages: {},
  };

  for (const ns of i18nNamespaces) {
    if (config.messages)
      config.messages[ns] = await loadTranslations(
        requestedLocale as Locale,
        ns,
      );
  }

  return config;
});

const loadTranslations = async (locale: Locale, ns: string) => {
  try {
    return (await import(`./messages/${locale}/${ns}.json`)).default;
  } catch {
    return (await import(`./messages/${DEFAULT_LOCALE}/${ns}.json`)).default;
  }
};
