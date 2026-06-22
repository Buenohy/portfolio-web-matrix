'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { IoClose } from 'react-icons/io5';
import { GoArrowUpRight } from 'react-icons/go';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';
import { notFound, useParams } from 'next/navigation';
import { cn } from '@/lib/utils';

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

  // React state to handle current active image index in the gallery
  const [activeImageIndex, setActiveImageIndex] = useState(0);

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

  const gallery = project.details.gallery;
  const activeImage = gallery[activeImageIndex] || gallery[0];

  return (
    // Natural page scroll wrapper
    <main className="container mx-auto pt-27 pb-16">
      {/* Floating Close Button */}
      <Link
        href="/portfolio"
        aria-label={t('closeButtonAriaLabel')}
        className="button-primary button-outline active:text-white-pure hover:text-white-pure dark:active:bg-white-pure dark:hover:bg-white-pure dark:hover:border-white-pure dark:active:border-white-pure fixed top-25 right-5 z-50 flex cursor-pointer items-center justify-center gap-2 rounded-full bg-transparent p-1 backdrop-blur-xs hover:translate-y-2 hover:bg-black active:translate-y-2 active:bg-black dark:border-[#414142] dark:bg-transparent dark:shadow-[#414142] dark:hover:text-black dark:active:text-black"
      >
        <IoClose className="h-5 w-5 xl:h-8 xl:w-8" />
      </Link>

      {/* 1. Full-Width Header */}
      <header className="mx-4 mb-4 lg:mb-8">
        <span className="text-tag-white dark:text-tag-dark text-xs font-semibold tracking-wider uppercase sm:text-sm">
          {project.tag}
        </span>
        <h1 className="text-dark-black dark:text-white-pure mt-2 mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl 2xl:text-6xl">
          {project.title}
        </h1>
        <ul className="flex flex-wrap gap-2">
          {project.badges.map((badge, index) => (
            <li key={index}>
              <Badge className="text-dark-black dark:text-white-pure border-main bg-transparent px-2.5 py-1 text-xs font-semibold uppercase 2xl:text-base">
                {badge}
              </Badge>
            </li>
          ))}
        </ul>
      </header>

      {/* 2. Interactive Split Columns */}
      <article className="mx-4 grid grid-cols-1 gap-12 lg:grid-cols-12 xl:gap-16">
        {/* Left Column: Interactive Image Gallery Switcher */}
        <section
          aria-label={t('gallerySectionAriaLabel')}
          className="flex flex-col gap-6 lg:col-span-7 xl:col-span-8"
        >
          {/* Main Active Image Display */}
          <div className="flex flex-col gap-3">
            <div className="w-full overflow-hidden rounded-xl">
              <Image
                src={activeImage.src}
                alt={activeImage.alt}
                width={1280}
                height={720}
                className="h-auto w-full rounded-xl object-cover transition-all duration-300"
                priority
              />
            </div>
            {activeImage.title && (
              <h5 className="text-dark-black/60 dark:text-white-pure/60 mt-2 text-center text-xs font-light sm:text-sm">
                {activeImage.title}
              </h5>
            )}
          </div>

          {/* Interactive Thumbnails Selection Row */}
          <ul className="m-0 flex list-none flex-wrap justify-start gap-3 p-0">
            {gallery.map((image, index) => (
              <li key={index}>
                <button
                  onClick={() => setActiveImageIndex(index)}
                  className={cn(
                    'relative aspect-video w-20 cursor-pointer overflow-hidden rounded-lg border-2 bg-transparent p-0 transition-all duration-200 focus:outline-none sm:w-28 md:w-36',
                    activeImageIndex === index
                      ? 'border-main scale-102 opacity-100'
                      : 'border-transparent opacity-50 hover:opacity-80'
                  )}
                  aria-label={`Switch to gallery image ${index + 1}`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 640px) 80px, (max-width: 768px) 112px, 144px"
                    className="rounded-md object-cover"
                  />
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Right Column: Dynamic Project Details Sideboard */}
        <section
          aria-label={t('detailsSectionAriaLabel')}
          className="flex h-fit flex-col gap-8 lg:sticky lg:top-32 lg:col-span-5 xl:col-span-4"
        >
          {/* Main paragraphs */}
          <div className="flex flex-col gap-6">
            <h3 className="text-dark-black dark:text-white-pure text-md leading-snug font-semibold sm:text-lg lg:text-xl">
              {project.details.titleParagraph}
            </h3>
            <div className="flex flex-col gap-4">
              {project.details.strongParagraphs.map((p, index) => (
                <p
                  key={index}
                  className="text-dark-black/80 dark:text-white-pure/80 text-sm leading-relaxed sm:text-base"
                >
                  <strong className="text-dark-black dark:text-white-pure font-bold">
                    {p.title}:
                  </strong>{' '}
                  {p.text}
                </p>
              ))}
            </div>
          </div>

          {/* Stacks and tools list */}
          <div className="flex flex-col gap-4 border-t border-white/10 pt-8">
            <h4 className="dark:text-tag-dark text-xs font-semibold tracking-wider text-gray-500 uppercase">
              {t('stacksAndToolsTitle')}
            </h4>
            <ol className="flex flex-wrap items-center gap-3">
              {project.details.stacks.map((stack, index) => (
                <li
                  key={index}
                  className="group bg-white-pure dark:bg-dark-black border-green-terminal/30 dark:border-green-terminal/30 shadow-shadow-digital/30 dark:shadow-shadow-digital/30 relative z-10 -mr-3 flex h-10 w-10 transform cursor-pointer items-center justify-center rounded-full border shadow-lg transition-transform duration-500 ease-in-out hover:scale-115 focus:scale-115 active:scale-115 sm:h-12 sm:w-12"
                >
                  <span className="stack-name-project">{stack.nameStack}</span>
                  <Icon
                    icon={stack.iconStack}
                    className="h-5 w-5 sm:h-6 sm:w-6"
                  />
                </li>
              ))}
            </ol>
          </div>

          {/* External website link button */}
          <div className="border-t border-white/10 pt-8">
            <Link
              href="/"
              className="button-primary button-outline flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold sm:text-base"
            >
              <span>{t('seeMoreButton')}</span>
              <GoArrowUpRight />
            </Link>
          </div>
        </section>
      </article>
    </main>
  );
}
