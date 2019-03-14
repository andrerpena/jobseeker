export function tokenize(content: string): string[] {
  return content
    .toLowerCase()
    .replace(/[^0-9a-zA-Z\-]/g, " ")
    .replace(/ {1,}/g, " ")
    .split(" ")
    .filter(t => t !== "");
}
