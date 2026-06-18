'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl'; // Importação do hook de tradução
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Project } from '@/types/project-types';
import { ProjectCard } from '../ProjectCard/ProjecCard';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ProjectsCarouselProps {
  projects: Project[];
  variant?: 'home' | 'portfolio';
  // Removido ProjectDetailsPage daqui
}

export function ProjectsCarousel({
  projects,
  variant = 'home',
}: ProjectsCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // Inicialização do hook de tradução com o namespace correspondente
  const t = useTranslations('ProjectDetailsPage');

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (!projects || projects.length === 0) {
    return null;
  }

  // Portfolio variant
  if (variant === 'portfolio') {
    return (
      <div className="container mx-auto px-5 py-10">
        <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <li key={project.id}>
              <ProjectCard
                project={project}
                href={`/portfolio/${project.slug}`}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Home variant
  return (
    // pb-8 prevents the dots from floating too far from the slide contents
    <div className="relative w-full pb-8 md:pb-10">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: 'start',
          loop: true,
        }}
      >
        <CarouselContent className="ml-0">
          {projects.map((project) => (
            <CarouselItem key={project.id} className="basis-full pl-0">
              {/* items-stretch forces identical heights on desktop, gap-6 is tighter on mobile */}
              <div className="flex w-full flex-col-reverse items-stretch justify-between gap-6 px-6 py-4 md:px-16 lg:flex-row lg:gap-12 lg:px-24 2xl:px-36">
                {/* LEFT COLUMN: Content */}
                {/* justify-start on mobile to avoid stretching, justify-between on desktop */}
                <div className="flex w-full flex-1 flex-col justify-start gap-6 lg:justify-between lg:gap-0">
                  {/* Top section: Title and Description */}
                  <div className="flex flex-col gap-3 sm:gap-4 md:gap-5">
                    <h2 className="text-xl leading-[1.15] font-bold tracking-tight text-white sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl 2xl:text-6xl">
                      {project.title}
                    </h2>
                    <p className="max-w-xl text-xs leading-relaxed text-gray-400 sm:text-sm md:text-base lg:text-sm xl:text-base 2xl:text-lg">
                      {project.description}
                    </p>
                  </div>

                  {/* Bottom section: Tools & Features */}
                  <div className="flex flex-col gap-3 sm:gap-4">
                    <h4 className="text-[10px] font-semibold tracking-[0.2em] text-gray-500 uppercase sm:text-xs 2xl:text-sm">
                      {t('stacksAndToolsTitle')}
                    </h4>
                    <div className="flex flex-wrap gap-2 sm:gap-2.5">
                      {project.badges?.map((badge, idx) => (
                        <span
                          key={idx}
                          className="border-main rounded-lg border bg-transparent px-2 py-0.5 text-[10px] font-medium text-gray-200 sm:px-2.5 sm:py-1 sm:text-xs 2xl:px-3.5 2xl:py-1.5 2xl:text-sm"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: Image wrapper */}
                <div className="flex w-full flex-[1.2] items-center">
                  <Link
                    href={`/portfolio/${project.slug}`}
                    className="block w-full"
                  >
                    <div className="group relative aspect-[16/9] w-full cursor-pointer overflow-hidden rounded-xl border border-white/5 bg-zinc-900 shadow-2xl">
                      <img
                        src={project.src}
                        alt={project.alt}
                        className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  </Link>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* NAVIGATION ARROWS */}
        <div className="hidden md:block">
          <CarouselPrevious
            variant="link"
            className={cn(
              'carousel-button',
              'text-dark-black dark:text-white-pure absolute top-1/2 left-2 -translate-y-1/2 rounded-xl lg:left-6 2xl:left-12'
            )}
          />
          <CarouselNext
            variant="link"
            className={cn(
              'carousel-button',
              'text-dark-black dark:text-white-pure absolute top-1/2 right-2 -translate-y-1/2 rounded-xl lg:right-6 2xl:right-12'
            )}
          />
        </div>
      </Carousel>

      {/* PAGINATION DOTS */}
      <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 justify-center gap-3">
        {projects.map((_, index) => (
          <button
            key={index}
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              current === index
                ? 'bg-main w-6'
                : 'w-2 bg-white/20 hover:bg-white/50'
            )}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
