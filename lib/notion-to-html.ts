import type { NotionBlock } from "./types";

interface RichTextItem {
  type: "text";
  text: { content: string; link: { url: string } | null };
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
  plain_text: string;
  href: string | null;
}

function getRichText(block: Record<string, unknown>, key: string): RichTextItem[] {
  const value = block[key] as Record<string, unknown> | undefined;
  if (!value?.rich_text) return [];
  return value.rich_text as RichTextItem[];
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderRichText(
  items: RichTextItem[],
  defaultTag: string,
): string {
  if (items.length === 0) return "";
  const parts = items.map((item) => {
    let content = escapeHtml(item.text.content);
    if (item.text.link) {
      content = `<a href="${escapeHtml(item.text.link.url)}">${content}</a>`;
    }
    const ann = item.annotations;
    if (ann.code) content = `<code>${content}</code>`;
    if (ann.bold) content = `<strong>${content}</strong>`;
    if (ann.italic) content = `<em>${content}</em>`;
    if (ann.strikethrough) content = `<s>${content}</s>`;
    if (ann.underline) content = `<u>${content}</u>`;
    return content;
  });
  if (defaultTag === "span") return parts.join("");
  return `<${defaultTag}>${parts.join("")}</${defaultTag}>`;
}

function renderParagraph(block: Record<string, unknown>): string {
  return renderRichText(getRichText(block, "paragraph"), "p");
}

function renderHeading(block: Record<string, unknown>, level: number): string {
  const tag = `h${level}`;
  return renderRichText(getRichText(block, `heading_${level}`), tag);
}

function renderCode(block: Record<string, unknown>): string {
  const code = block.code as Record<string, unknown>;
  const text = escapeHtml(
    ((code?.rich_text as RichTextItem[] | undefined)?.[0]?.plain_text) || "",
  );
  const lang = (code?.language as string) || "";
  return `<pre><code class="language-${escapeHtml(lang)}">${text}</code></pre>`;
}

function renderImage(block: Record<string, unknown>): string {
  const img = block.image as Record<string, unknown>;
  const url = (img?.type === "external"
    ? (img?.external as Record<string, string>)?.url
    : (img?.file as Record<string, string>)?.url) || "";
  const caption = ((img?.caption as RichTextItem[] | undefined)?.[0]?.plain_text) || "";
  return `<figure><img src="${escapeHtml(url)}" alt="${escapeHtml(caption)}" />${caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ""}</figure>`;
}

function renderListItem(
  block: Record<string, unknown>,
  type: "bulleted_list_item" | "numbered_list_item",
): { tag: string; html: string } {
  const tag = type === "bulleted_list_item" ? "ul" : "ol";
  const content = renderRichText(getRichText(block, type), "span");
  return { tag, html: `<li>${content}</li>` };
}

export function notionToHtml(blocks: NotionBlock[]): string {
  let html = "";
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i] as unknown as Record<string, unknown>;
    const type = block.type as string;

    switch (type) {
      case "paragraph":
        html += renderParagraph(block);
        break;

      case "heading_1":
        html += renderHeading(block, 1);
        break;

      case "heading_2":
        html += renderHeading(block, 2);
        break;

      case "heading_3":
        html += renderHeading(block, 3);
        break;

      case "code":
        html += renderCode(block);
        break;

      case "image":
        html += renderImage(block);
        break;

      case "divider":
        html += "<hr />";
        break;

      case "quote":
        html += renderRichText(getRichText(block, "quote"), "blockquote");
        break;

      case "callout": {
        const callout = block.callout as Record<string, unknown>;
        const icon = (callout?.icon as { emoji?: string })?.emoji || "";
        html += `<div class="callout">${icon ? `<span>${icon}</span> ` : ""}${renderRichText((callout?.rich_text as RichTextItem[]) || [], "span")}</div>`;
        break;
      }

      case "bulleted_list_item": {
        const items: string[] = [];
        while (i < blocks.length && (blocks[i] as unknown as Record<string, unknown>).type === "bulleted_list_item") {
          const result = renderListItem(
            blocks[i] as unknown as Record<string, unknown>,
            "bulleted_list_item",
          );
          items.push(result.html);
          i++;
        }
        html += `<ul>${items.join("")}</ul>`;
        continue;
      }

      case "numbered_list_item": {
        const items: string[] = [];
        while (i < blocks.length && (blocks[i] as unknown as Record<string, unknown>).type === "numbered_list_item") {
          const result = renderListItem(
            blocks[i] as unknown as Record<string, unknown>,
            "numbered_list_item",
          );
          items.push(result.html);
          i++;
        }
        html += `<ol>${items.join("")}</ol>`;
        continue;
      }
    }
    i++;
  }

  return html;
}
