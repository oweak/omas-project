import { notFound } from "next/navigation";
import Link from "next/link";
import { getPublishedPages, getPageContent, getPageBySlug } from "@/lib/notion";
import { notionToHtml } from "@/lib/notion-to-html";
import NotionRenderer from "@/components/NotionRenderer";
import { tagColor } from "@/lib/tag-colors";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const databaseId = process.env.NOTION_NOTES_DATABASE_ID || "";
  if (!databaseId) return [{ slug: "_placeholder" }];
  try {
    const pages = await getPublishedPages(databaseId);
    const slugs = pages.map((p) => ({ slug: p.slug })).filter((s) => s.slug);
    return slugs.length > 0 ? slugs : [{ slug: "_placeholder" }];
  } catch {
    return [{ slug: "_placeholder" }];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const databaseId = process.env.NOTION_NOTES_DATABASE_ID || "";
  if (!databaseId) return { title: slug };
  try {
    const meta = await getPageBySlug(databaseId, slug);
    if (!meta) return { title: slug };
    return {
      title: meta.title,
      description: meta.description,
    };
  } catch {
    return { title: slug };
  }
}

export default async function NoteDetailPage({ params }: Props) {
  const { slug } = await params;
  const databaseId = process.env.NOTION_NOTES_DATABASE_ID || "";
  if (!databaseId) notFound();

  let meta;
  let html = "";
  try {
    meta = await getPageBySlug(databaseId, slug);
    if (!meta) notFound();
    const blocks = await getPageContent(meta.id);
    html = notionToHtml(blocks);
  } catch {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-6 pt-8 pb-12">
      <div className="mb-8">
        <Link
          href="/notes"
          className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
        >
          &larr; 返回笔记
        </Link>
      </div>
      <article>
        <div className="mb-8">
          <p className="text-xs text-gray-400 font-mono mb-2">{meta.date}</p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">
            {meta.title}
          </h1>
          {meta.tags.length > 0 && (
            <div className="flex gap-2">
              {meta.tags.map((tag) => (
                <span key={tag.name} className={tagColor(tag.color)}>
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
        <NotionRenderer html={html} />
      </article>
    </div>
  );
}
