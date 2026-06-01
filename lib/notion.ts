import { Client } from "@notionhq/client";
import type { NotionPageMeta, NotionBlock } from "./types";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

function getProp(obj: Record<string, unknown>, path: (string | number)[]): unknown {
  let current: unknown = obj;
  for (const key of path) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}

function extractMeta(page: Record<string, unknown>): NotionPageMeta {
  const props = (page as { properties: Record<string, unknown> }).properties;
  return {
    id: (page as { id: string }).id,
    title: (getProp(props, ["title", "title", 0, "plain_text"]) as string) || "",
    slug: ((getProp(props, ["slug", "rich_text", 0, "plain_text"]) as string) || "")
      .toLowerCase().replace(/\s+/g, "-"),
    description: (getProp(props, ["description", "rich_text", 0, "plain_text"]) as string) || "",
    tags: ((getProp(props, ["tags", "multi_select"]) as Array<{ name: string }>) || []).map((t) => t.name),
    date: (getProp(props, ["date", "date", "start"]) as string) || "",
    published: (getProp(props, ["published", "checkbox"]) as boolean) || false,
  };
}

export async function getPublishedPages(
  databaseId: string,
): Promise<NotionPageMeta[]> {
  const res = await notion.request<{
    results: Array<Record<string, unknown>>;
  }>({
    path: `/databases/${databaseId}/query`,
    method: "post",
    body: {
      filter: { property: "published", checkbox: { equals: true } },
      sorts: [{ property: "date", direction: "descending" }],
    },
  });

  return res.results.map(extractMeta);
}

export async function getPageContent(pageId: string): Promise<NotionBlock[]> {
  const res = await notion.blocks.children.list({ block_id: pageId });
  return res.results as NotionBlock[];
}

export async function getPageBySlug(
  databaseId: string,
  slug: string,
): Promise<NotionPageMeta | null> {
  const res = await notion.request<{
    results: Array<Record<string, unknown>>;
  }>({
    path: `/databases/${databaseId}/query`,
    method: "post",
    body: {
      filter: {
        and: [
          { property: "slug", rich_text: { equals: slug } },
          { property: "published", checkbox: { equals: true } },
        ],
      },
    },
  });

  if (res.results.length === 0) return null;
  return extractMeta(res.results[0] as Record<string, unknown>);
}
