'use client';

import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { IoClose } from 'react-icons/io5';
import { GoArrowUpRight } from 'react-icons/go';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';
import { notFound, useParams } from 'next/navigation';

type Project = {
  id: number;
  slug: string;
  src: string;
  alt: string;
  title: string;
  tag: string;
  badges: string[];
  description: string;
  details: {
    titleParagraph: string;
    strongParagraphs: { title: string; text: string }[];
    stacks: { nameStack: string; iconStack: string }[];
    gallery: { src: string; alt: string; title: string }[];
  };
};

export default function ProjectDetailsPage() {
  const t = useTranslations('ProjectDetailsPage');
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  if (!slug) {
    notFound();
  }

  const projectKey = `projects.${slug}` as const;

  let project: Project;
  try {
    project = t.raw(projectKey);
  } catch {
    notFound();
  }

  return (
    <main className="pt-27">
      <Link
        href="/portfolio"
        aria-label={t('closeButtonAriaLabel')}
        className="button-primary button-outline active:text-white-pure hover:text-white-pure dark:active:bg-white-pure dark:hover:bg-white-pure dark:hover:border-white-pure dark:active:border-white-pure fixed top-25 right-5 z-50 flex cursor-pointer items-center justify-center gap-2 rounded-full bg-transparent p-1 backdrop-blur-xs hover:translate-y-2 hover:bg-black active:translate-y-2 active:bg-black dark:border-[#414142] dark:bg-transparent dark:shadow-[#414142] dark:hover:text-black dark:active:text-black"
      >
        <IoClose className="h-5 w-5 xl:h-8 xl:w-8" />
      </Link>

      <article className="grid grid-cols-1 md:h-screen md:grid-cols-12">
        <section
          aria-label={t('detailsSectionAriaLabel')}
          className="flex flex-col px-5 md:col-span-7 md:overflow-y-auto md:px-10 lg:col-span-5 xl:col-span-4 2xl:col-span-3"
        >
          <div className="grow">
            <header>
              <h1 className="text-dark-black dark:text-white-pure mt-5 mb-2 text-2xl font-semibold 2xl:text-4xl">
                {project.title}
              </h1>
              <h2 className="text-tag-white dark:text-tag-dark py-1 text-sm uppercase 2xl:text-lg">
                {project.tag}
              </h2>
              <ul className="my-5 flex flex-wrap gap-2">
                {project.badges.map((badge, index) => (
                  <li key={index}>
                    <Badge className="text-dark-black dark:text-white-pure border-main bg-transparent px-2 py-1 text-xs font-semibold uppercase 2xl:text-base">
                      {badge}
                    </Badge>
                  </li>
                ))}
              </ul>
            </header>
            <h3 className="text-dark-black dark:text-white-pure my-4.5 text-lg font-semibold 2xl:text-2xl">
              {project.details.titleParagraph}
            </h3>
            {project.details.strongParagraphs.map((p, index) => (
              <p
                key={index}
                className="text-dark-black dark:text-white-pure my-4 text-base font-normal 2xl:text-xl"
              >
                <strong>{p.title}:</strong> {p.text}
              </p>
            ))}
          </div>
          <footer className="flex flex-col items-center justify-center py-10 text-center md:py-4">
            <h4 className="dark:text-tag-dark mb-9 text-xs uppercase sm:text-base lg:text-lg xl:text-xl 2xl:mb-12 2xl:text-2xl">
              {t('stacksAndToolsTitle')}
            </h4>
            <ol className="mt-3 mb-9 flex items-center justify-center 2xl:mb-12">
              {project.details.stacks.map((stack, index) => (
                <li
                  key={index}
                  className="group bg-white-pure dark:bg-dark-black border-green-terminal/30 dark:border-green-terminal/30 shadow-shadow-digital/30 dark:shadow-shadow-digital/30 relative z-10 -mr-3 flex h-10 w-10 transform cursor-pointer items-center justify-center rounded-full border shadow-lg transition-transform duration-500 ease-in-out hover:scale-115 focus:scale-115 focus-visible:scale-115 active:scale-115 sm:h-13 sm:w-13 2xl:h-20 2xl:w-20"
                >
                  <span className="stack-name-project">{stack.nameStack}</span>
                  <Icon
                    icon={stack.iconStack}
                    className="h-5 w-5 sm:h-8 sm:w-8 2xl:h-10 2xl:w-10"
                  />
                </li>
              ))}
            </ol>
            <Link
              href="/"
              className="button-primary button-outline flex w-full items-center justify-center gap-2 2xl:text-2xl"
            >
              <span>{t('seeMoreButton')}</span>
              <GoArrowUpRight />
            </Link>
          </footer>
        </section>
        <section
          aria-label={t('gallerySectionAriaLabel')}
          className="bg-bg-project flex flex-col items-center gap-10 overflow-y-auto p-5 md:col-span-5 lg:col-span-7 xl:col-span-8 dark:bg-transparent"
        >
          <ul className="m-0 list-none p-0">
            {project.details.gallery.map((image, index) => (
              <li key={index} className="mb-10 md:max-w-none">
                <Card className="overflow-hidden rounded-2xl border-0 bg-transparent p-0">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={640}
                    height={416}
                    className="rounded-2xl object-cover"
                    priority={index === 0}
                  />
                </Card>
                <h5 className="text-dark-black dark:text-white-pure my-8 text-center text-sm font-light lg:text-lg 2xl:text-2xl">
                  {image.title}
                </h5>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </main>
  );
}
