export interface Project {
  title: string;
  summary: string;
  description: string;
  tech: string[];
  link: string;

  // New fields used in components
  image?: string;
  technologies: string[];
  features?: string[];
  liveUrl?: string;
  repoUrl?: string;
}
