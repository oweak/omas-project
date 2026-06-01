import { getPublishedPages } from "@/lib/notion";
import ProjectCard from "@/components/ProjectCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "项目",
};

export default async function ProjectsPage() {
  const databaseId = process.env.NOTION_PROJECTS_DATABASE_ID || "";
  let projects: Awaited<ReturnType<typeof getPublishedPages>> = [];

  try {
    if (databaseId) {
      projects = await getPublishedPages(databaseId);
    }
  } catch {
    // Notion not configured
  }

  return (
    <div className="max-w-3xl mx-auto px-6 pt-12 pb-12">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-2">项目</h1>
      <p className="text-sm text-gray-400 mb-8">
        个人项目展示，共 {projects.length} 个
      </p>
      {projects.length > 0 ? (
        projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))
      ) : (
        <p className="text-sm text-gray-400 py-12 text-center">
          还没有项目，在 Notion 中创建并标记为已发布即可。
        </p>
      )}
    </div>
  );
}
