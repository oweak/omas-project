import Link from "next/link";
import { getPublishedPages } from "@/lib/notion";
import NoteCard from "@/components/NoteCard";
import ProjectCard from "@/components/ProjectCard";

export default async function HomePage() {
  const notesDbId = process.env.NOTION_NOTES_DATABASE_ID || "";
  const projectsDbId = process.env.NOTION_PROJECTS_DATABASE_ID || "";

  let recentNotes: Awaited<ReturnType<typeof getPublishedPages>> = [];
  let recentProjects: Awaited<ReturnType<typeof getPublishedPages>> = [];

  try {
    if (notesDbId) {
      const allNotes = await getPublishedPages(notesDbId);
      recentNotes = allNotes.slice(0, 5);
    }
    if (projectsDbId) {
      const allProjects = await getPublishedPages(projectsDbId);
      recentProjects = allProjects.slice(0, 3);
    }
  } catch {
    // Notion not configured yet — homepage still renders
  }

  return (
    <div className="max-w-3xl mx-auto px-6 pt-20 pb-12">
      {/* Hero */}
      <section className="mb-20">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
          Hi, I&apos;m a Developer.
        </h1>
        <p className="text-gray-500 text-base leading-relaxed max-w-lg">
          记录学习，分享技术笔记与项目实践。
        </p>
      </section>

      {/* Recent Notes */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            最近笔记
          </h2>
          {recentNotes.length > 0 && (
            <Link
              href="/notes"
              className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
            >
              查看全部 &rarr;
            </Link>
          )}
        </div>
        {recentNotes.length > 0 ? (
          recentNotes.map((note, i) => (
            <NoteCard key={note.id} note={note} index={i} />
          ))
        ) : (
          <p className="text-sm text-gray-400 py-8 text-center">
            暂无笔记，配置 Notion 后开始发布。
          </p>
        )}
      </section>

      {/* Recent Projects */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            精选项目
          </h2>
          {recentProjects.length > 0 && (
            <Link
              href="/projects"
              className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
            >
              查看全部 &rarr;
            </Link>
          )}
        </div>
        {recentProjects.length > 0 ? (
          recentProjects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))
        ) : (
          <p className="text-sm text-gray-400 py-8 text-center">
            暂无项目展示。
          </p>
        )}
      </section>
    </div>
  );
}
