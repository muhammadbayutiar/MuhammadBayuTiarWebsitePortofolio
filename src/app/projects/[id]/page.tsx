import { projectsData } from '@/data/projects';
import { notFound } from 'next/navigation';
import ProjectDetailContent from '@/components/ProjectDetailContent';

interface Params {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: Params) {
  const { id } = await params;
  const project = projectsData.find((p) => p.id === id);

  if (!project) notFound();

  return <ProjectDetailContent project={project} />;
}

export async function generateStaticParams() {
  return projectsData.map((project) => ({
    id: project.id,
  }));
}
