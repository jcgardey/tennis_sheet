import { Text } from '@/components/design-system/Text';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const t = await getTranslations('Home');
  const { locale } = await params;

  return (
    <main className="container space-y-4 px-4 py-8">
      <Text variant="h1">{t('title')}</Text>
      <p>{t('description')}</p>
      <Link className="underline" href={`/${locale}/sheet`}>
        {t('openBooking')}
      </Link>
    </main>
  );
}
