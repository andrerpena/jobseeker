import TurndownService from "turndown";

const turndownService = new TurndownService();

export function getMarkdownFromHtml(html: string) {
  return turndownService.turndown(html);
}
