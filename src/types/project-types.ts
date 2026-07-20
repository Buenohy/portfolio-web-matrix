import { StaticImageData } from 'next/image';

export interface Project {
  id: number;
  slug: string;
  src: string;
  alt: string;
  title: string;
  tag: string;
  viewProject: string;
  badges: string[];
  description: string;
  details: {
    titleParagraph: string;
    strongParagraphs: { title: string; text: string }[];
    stacks: {
      nameStack: string;
      iconStack: string;
    }[];
    gallery: {
      src: StaticImageData;
      alt: string;
      title: string;
    }[];
  };
}
