'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Project } from '@/types/project-types';
import { ProjectCard } from '../ProjectCard/ProjecCard';
import { cn } from '@/lib/utils';

interface ProjectsCarouselProps {
  projects: Project[];
  variant?: 'home' | 'portfolio';
}

export function ProjectsCarousel({
  projects,
  variant = 'home',
}: ProjectsCarouselProps) {
  if (!projects || projects.length === 0) {
    return null;
  }

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

  return (
    <Carousel
      className="w-full"
      opts={{
        align: 'start',
        loop: false,
      }}
    >
      <CarouselContent className="ml-3">
        {projects.map((project) => (
          <CarouselItem
            key={project.id}
            className="box-content max-w-65 pl-5 sm:max-w-95"
          >
            <ProjectCard
              project={project}
              href={`/portfolio/${project.slug}`}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="">
        <CarouselPrevious
          variant="link"
          className={cn(
            'carousel-button',
            'text-dark-black dark:text-white-pure left-8 translate-y-75 rounded-xl md:-translate-y-25'
          )}
        />
        <CarouselNext
          variant="link"
          className={cn(
            'carousel-button',
            'text-dark-black dark:text-white-pure right-8 translate-y-75 rounded-xl md:-translate-y-25'
          )}
        />
      </div>
    </Carousel>
  );
}
