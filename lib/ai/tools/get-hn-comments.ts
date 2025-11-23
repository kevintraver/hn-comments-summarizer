import { tool } from "ai";
import { z } from "zod";

const ID_REGEX = /id=(\d+)/;
const ITEM_ID_REGEX = /item\?id=(\d+)/;
const ITEMS_REGEX = /\/items\/(\d+)/;
const HTML_TAG_REGEX = /<[^>]*>?/gm;

const stripHtml = (html: string) => {
  if (!html) {
    return "";
  }
  return html.replace(HTML_TAG_REGEX, "");
};

type HNItem = {
  id: number;
  author: string;
  text?: string;
  points?: number;
  children?: HNItem[];
  [key: string]: any;
};

export type HNComment = {
  id: number;
  author: string;
  points?: number;
  text?: string;
  children?: HNComment[];
};

const processComments = (item: HNItem): HNComment | null => {
  if (!item) {
    return null;
  }

  const result: HNComment = {
    id: item.id,
    author: item.author,
    points: item.points,
  };

  if (item.text) {
    result.text = stripHtml(item.text);
  }

  if (item.children && item.children.length > 0) {
    result.children = item.children
      .map(processComments)
      .filter((child): child is HNComment => child !== null);
  }

  return result;
};

export const getHnComments = tool({
  description: "Fetch Hacker News comments for a given item ID or URL",
  inputSchema: z.object({
    itemId: z
      .union([z.string(), z.number()])
      .describe("The Hacker News item ID or URL"),
  }),
  execute: async ({ itemId }: { itemId: string | number }) => {
    let id = itemId;
    if (typeof itemId === "string") {
      const match =
        itemId.match(ID_REGEX) ||
        itemId.match(ITEM_ID_REGEX) ||
        itemId.match(ITEMS_REGEX);
      if (match) {
        id = match[1];
      }
    }

    const url = `https://hn.algolia.com/api/v1/items/${id}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch HN item: ${response.statusText}`);
      }

      const data = await response.json();
      return processComments(data);
    } catch (error: any) {
      return { error: error.message };
    }
  },
});
