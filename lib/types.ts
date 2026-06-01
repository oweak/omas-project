// Notion database property types used in our schema
export interface NotionPageMeta {
  id: string;
  title: string;
  slug: string;
  description: string;
  tags: string[];
  date: string;
  published: boolean;
}

// The shape we pass to page components after fetching from Notion
export interface PageData {
  meta: NotionPageMeta;
  html: string;
}

// Notion rich text annotations
export interface RichTextAnnotations {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  underline: boolean;
  code: boolean;
  color: string;
}

// A single rich text segment within a block
export interface RichTextItem {
  type: "text";
  text: { content: string; link: { url: string } | null };
  annotations: RichTextAnnotations;
  plain_text: string;
  href: string | null;
}

// Notion block types we convert to HTML
export type NotionBlockType =
  | "paragraph"
  | "heading_1"
  | "heading_2"
  | "heading_3"
  | "bulleted_list_item"
  | "numbered_list_item"
  | "code"
  | "image"
  | "divider"
  | "quote"
  | "callout";

export interface NotionBlock {
  id: string;
  type: NotionBlockType;
  [key: string]: unknown;
}
