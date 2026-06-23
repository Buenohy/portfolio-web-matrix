import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import Image from 'next/image';
import Link from 'next/link';

// Import FiArrowRight from react-icons/fi
import { FiArrowRight } from 'react-icons/fi';

import { Project } from '@/types/project-types';

interface ProjectCardProps {
  project: Project;
  href: string;
}

export function ProjectCard({ project, href }: ProjectCardProps) {
  const { src, alt, title, description, badges } = project;

  return (
    // Unified Card layout to match reference proportions
    <Card className="text-white-pure border-main hover:border-main/70 flex h-full w-full flex-col overflow-hidden rounded-lg border-2 bg-transparent p-0 transition-all duration-300">
      {/* 1. Project Image (top aligned, using 16:9 aspect ratio) */}
      <div className="relative aspect-video w-full overflow-hidden">
        <Link href={href} className="block h-full w-full">
          <Image
            src={src}
            alt={alt}
            width={370}
            height={210}
            className="h-full w-full cursor-pointer bg-transparent object-cover transition-transform duration-500 hover:scale-102"
          />
        </Link>
      </div>

      {/* 2. Text Content & Action container */}
      <CardContent className="flex flex-grow flex-col gap-4 p-5">
        {/* Title */}
        <h2 className="text-dark-black dark:text-white-pure text-xl leading-tight font-bold">
          {title}
        </h2>

        {/* Description with line clamping to enforce vertical uniformity */}
        <p className="text-dark-black/70 dark:text-white-pure/70 line-clamp-3 text-sm leading-relaxed">
          {description}
        </p>

        {/* Badges container pushed to bottom to maintain layout alignment */}
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {badges?.map((badge, idx) => (
            <Badge
              key={idx}
              variant="outline"
              className="text-dark-black dark:text-white-pure border-main bg-transparent px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase"
            >
              {badge}
            </Badge>
          ))}
        </div>

        {/* Underlined Action Link with react-icon and mobile touch-active states */}
        <Link
          href={href}
          className="text-black-matrix dark:text-white-pure hover:text-main dark:hover:text-main active:text-main dark:active:text-main mt-2 flex items-center gap-1.5 text-sm font-semibold underline underline-offset-4 transition-colors duration-150"
        >
          Ver resultado <FiArrowRight className="text-base" />
        </Link>
      </CardContent>
    </Card>
  );
}
