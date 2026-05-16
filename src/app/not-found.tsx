import { getTranslations } from 'next-intl/server';
import NotFoundSection from '@/components/Sections/NotFoundSection';

export default async function NotFound() {
  const t = await getTranslations('NotFound');

  const translations = {
    title: t('title'),
    subTitle: t('subTitle'),
    description: t('description'),
    buttonHomePage: t('buttonHomePage'),
  };

  return <NotFoundSection translations={translations} />;
}