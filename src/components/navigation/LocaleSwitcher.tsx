'use client';

import { useLocale, useTranslations } from 'next-intl';

export const getLocaleSwitchUrl = (
  currentLocation: Pick<Location, 'pathname' | 'search' | 'hash'>,
  nextLocale: 'es' | 'en',
) => {
  const currentPath = currentLocation.pathname.replace(/^\/(es|en)(?=\/|$)/, '');
  return `/${nextLocale}${currentPath}${currentLocation.search}${currentLocation.hash}`;
};

export const LocaleSwitcher: React.FC = () => {
  const locale = useLocale();
  const t = useTranslations('Navigation');
  const nextLocale = locale === 'es' ? 'en' : 'es';
  const nextLocaleLabel = nextLocale === 'en' ? t('english') : t('spanish');

  return (
    <a
      href={`/${nextLocale}`}
      aria-label={`${t('switchLanguage')}: ${nextLocaleLabel}`}
      className="ml-auto text-sm underline underline-offset-4"
      onClick={(event) => {
        event.preventDefault();
        window.location.assign(getLocaleSwitchUrl(window.location, nextLocale));
      }}
    >
      {nextLocaleLabel}
    </a>
  );
};