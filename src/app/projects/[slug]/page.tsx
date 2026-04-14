import { notFound } from "next/navigation";
import Header from "../../../components/Header";
import { getProjectBySlug } from "../../../data/projectsData";
import ProjectPageClient from "./ProjectPageClient";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <Header isHomePage={false} />
      <ProjectPageClient project={project} />
    </>
  );
}
