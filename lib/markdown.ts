import TurndownService from "turndown";
import removeMd from "remove-markdown";

const turndownService = new TurndownService();

export function getMarkdownFromHtml(html: string) {
  return turndownService.turndown(html);
}

export function removeMarkdown(markdown: string) {
  return removeMd(markdown);
}
