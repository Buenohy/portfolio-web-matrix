import { getTranslations } from 'next-intl/server';
import PageWrapper from '@/components/PageWrapper/PageWrapper';
import HomeSection from '@/components/Sections/HomeSection';
import AboutSection from '@/components/Sections/AboutSection';
import ServicesSection from '@/components/Sections/ServicesSection';
import ContactSection from '@/components/Sections/ContactSection';
import PortfolioSection from '@/components/Sections/PortfolioSection';
import StacksSection from '@/components/Sections/StacksSection';

export default async function HomePage() {
  const tHome = await getTranslations('HomeSection');
  const tPortfolio = await getTranslations('PortfolioSection');
  const tProjectsCarousel = await getTranslations('ProjectsCarousel');
  const tAbout = await getTranslations('AboutSection');
  const tStacks = await getTranslations('StacksSection');
  const tServices = await getTranslations('ServicesSection');
  const tContact = await getTranslations('ContactSection');
  const tProjectsData = await getTranslations('ProjectDetailsPage');

  const homeTranslations = {
    greeting: tHome('greeting'),
    nameCreator: tHome('nameCreator'),
    role: tHome('role'),
    title: tHome('title'),
    mainTitle: tHome.rich('mainTitle', { br: () => <br /> }),
    cvButton: tHome('cvButton'),
    avatarAriaLabel: tHome('avatarAriaLabel'),
    avatarAlt: tHome('avatarAlt'),
  };

  const portfolioTranslations = {
    title: tPortfolio('title'),
    viewMoreButton: tPortfolio('viewMoreButton'),
    projects: tProjectsData.raw('projects'),
    seeMoreButton: tProjectsCarousel('seeMoreButton'),
  };

  const aboutTranslations = {
    sectionTitle: tAbout('sectionTitle'),
    mainHeading: tAbout('mainHeading'),
    paragraph1: tAbout.rich('paragraph1', {
      strong: (chunks) => <strong>{chunks}</strong>,
    }),
    paragraph2: tAbout.rich('paragraph2', {
      strong: (chunks) => <strong>{chunks}</strong>,
    }),
    paragraph3: tAbout.rich('paragraph3', {
      strong: (chunks) => <strong>{chunks}</strong>,
    }),

    contactButton: tAbout('contactButton'),
    linkedinButton: tAbout('linkedinButton'),
  };

  const stacksTranslations = {
    sectionTitle: tStacks('sectionTitle'),
    stacks: tStacks.raw('stacks'),
  };

  const servicesTranslations = {
    sectionTitle: tServices('sectionTitle'),
    mainHeading: tServices.rich('mainHeading', { br: () => <br /> }),
    subHeading: tServices.rich('subHeading', { br: () => <br /> }),
    cards: tServices.raw('cards'),
  };

  const contactTranslations = {
    mainHeading: tContact('mainHeading'),
    subHeading: tContact('subHeading'),
    description: tContact('description'),
    ctaButton: tContact('ctaButton'),
    emailAddress: tContact('emailAddress'),
  };

  return (
    <PageWrapper
      home={<HomeSection translations={homeTranslations} />}
      portfolio={<PortfolioSection translations={portfolioTranslations} />}
      about={
        <>
          <AboutSection translations={aboutTranslations} />
          <StacksSection translations={stacksTranslations} />
        </>
      }
      services={<ServicesSection translations={servicesTranslations} />}
      contact={<ContactSection translations={contactTranslations} />}
    />
  );
}
