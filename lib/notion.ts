import https from "https";
import type { NotionPageMeta, NotionBlock } from "./types";

const API_BASE = "api.notion.com";

function notionRequest<T = unknown>(
  method: string,
  path: string,
  body?: Record<string, unknown>,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : undefined;
    const req = https.request({
      hostname: API_BASE,
      path,
      method,
      headers: {
        Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
        "Notion-Version": "2025-09-03",
        "Content-Type": "application/json",
      },
    }, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (c: Buffer) => chunks.push(c));
      res.on("end", () => {
        const raw = Buffer.concat(chunks).toString("utf8");
        try {
          resolve(JSON.parse(raw) as T);
        } catch {
          reject(new Error(`Failed to parse response: ${raw.slice(0, 200)}`));
        }
      });
    });
    req.on("error", reject);
    if (data) req.write(data);
    req.end();
  });
}

function getProp(
  obj: Record<string, unknown>,
  path: (string | number)[],
): unknown {
  let current: unknown = obj;
  for (const key of path) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}

function slugify(text: string): string {
  const slug = text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  // If slug contains only Chinese (no ASCII letters), use ID-based fallback
  if (!/[a-z0-9]/.test(slug)) return "";
  return slug;
}

function extractMeta(page: Record<string, unknown>): NotionPageMeta {
  const props = (page as { properties: Record<string, unknown> }).properties;
  const title =
    (getProp(props, ["title", "title", 0, "plain_text"]) as string) || "";
  const rawSlug =
    (getProp(props, ["slug", "rich_text", 0, "plain_text"]) as string) || "";
  const slug = rawSlug
    ? rawSlug.toLowerCase().replace(/\s+/g, "-")
    : slugify(title) || (page as { id: string }).id.slice(0, 8);
  return {
    id: (page as { id: string }).id,
    title,
    slug,
    description:
      (getProp(props, ["description", "rich_text", 0, "plain_text"]) as string) ||
      "",
    tags: (
      (getProp(props, ["tags", "multi_select"]) as Array<{ name: string; color: string }>) ||
      []
    ).map((t) => ({ name: t.name, color: t.color || "default" })),
    date: (getProp(props, ["date", "date", "start"]) as string) || "",
    published:
      (getProp(props, ["published", "checkbox"]) as boolean) || false,
  };
}

export async function getPublishedPages(
  databaseId: string,
): Promise<NotionPageMeta[]> {
  const res = await notionRequest<{
    results: Array<Record<string, unknown>>;
  }>("POST", `/v1/data_sources/${databaseId}/query`, {
    filter: { property: "published", checkbox: { equals: true } },
    sorts: [{ property: "date", direction: "descending" }],
  });

  return (res.results?.map(extractMeta)) ?? [];
}

export async function getPageContent(
  pageId: string,
): Promise<NotionBlock[]> {
  const res = await notionRequest<{
    results: NotionBlock[];
  }>("GET", `/v1/blocks/${pageId}/children`);

  return res.results;
}

export async function getPageBySlug(
  databaseId: string,
  slug: string,
): Promise<NotionPageMeta | null> {
  const allPages = await getPublishedPages(databaseId);
  return allPages.find((p) => p.slug === slug) || null;
}
