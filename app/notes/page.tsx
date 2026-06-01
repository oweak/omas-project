import { getPublishedPages } from "@/lib/notion";
import NoteCard from "@/components/NoteCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "笔记",
};

export default async function NotesPage() {
  const databaseId = process.env.NOTION_NOTES_DATABASE_ID || "";
  let notes: Awaited<ReturnType<typeof getPublishedPages>> = [];

  try {
    if (databaseId) {
      notes = await getPublishedPages(databaseId);
    }
  } catch {
    // Notion not configured
  }

  return (
    <div className="max-w-3xl mx-auto px-6 pt-12 pb-12">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-2">笔记</h1>
      <p className="text-sm text-gray-400 mb-8">
        技术学习记录，共 {notes.length} 篇
      </p>
      {notes.length > 0 ? (
        notes.map((note, i) => (
          <NoteCard key={note.id} note={note} index={i} />
        ))
      ) : (
        <p className="text-sm text-gray-400 py-12 text-center">
          还没有笔记，在 Notion 中创建并标记为已发布即可。
        </p>
      )}
    </div>
  );
}
