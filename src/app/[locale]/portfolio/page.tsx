import { ProjectsCarousel } from '@/components/ProjectsCarousel/ProjectsCarousel';
import ContactSection from '@/components/Sections/ContactSection';
import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { Project } from '@/types/project-types';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'PortfolioPage' });

  return {
    title: t('title'),
  };
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  setRequestLocale(locale);

  const tPortfolio = await getTranslations({
    locale,
    namespace: 'PortfolioPage',
  });
  const tProjectsData = await getTranslations({
    locale,
    namespace: 'ProjectDetailsPage',
  });
  const tContact = await getTranslations({
    locale,
    namespace: 'ContactSection',
  });

  const projectsObject = tProjectsData.raw('projects');
  const projectsArray = Object.values(projectsObject) as Project[];

  const contactTranslations = {
    mainHeading: tContact('mainHeading'),
    subHeading: tContact('subHeading'), // <- Esta linha estava faltando
    description: tContact('description'),
    ctaButton: tContact('ctaButton'),
    emailAddress: tContact('emailAddress'),
  };

  return (
    <main>
      <section className="px-5 pt-45 pb-10 lg:px-10">
        <div className="text-center">
          <h1 className="text-black-matrix dark:text-white-matrix my-1 text-6xl font-semibold">
            {tPortfolio('title')}
          </h1>
          <p className="text-black-matrix dark:text-white-matrix my-5 text-center text-xl font-light lg:text-left">
            {tPortfolio.rich('description', {
              br: () => <br />,
            })}
          </p>
        </div>
      </section>

      <ProjectsCarousel variant="portfolio" projects={projectsArray} />

      <ContactSection translations={contactTranslations} />
    </main>
  );
}
