export function replaceAll(
  content: string,
  search: string,
  replacement: string
): string {
  return content.split(search).join(replacement);
}

export function encodeToHex(content: string): string {
  return Buffer.from(content).toString("hex");
}

export function decodeFromHex(content: string): string {
  return Buffer.from(content, "hex").toString("ascii");
}

export function hasSpecialCharacters(content: string): boolean {
  var format = /[\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  return format.test(content);
}

export function tokenize(content: string): string[] {
  return content
    .toLowerCase()
    .replace(/[^0-9a-zA-Z\-]/g, " ")
    .replace(/ {1,}/g, " ")
    .split(" ")
    .filter(t => t !== "");
}

export function normalizeText(input: string) {
  if (!input) {
    return "";
  }
  return input.toLowerCase();
}

export function findInArray(textToFind: string, combinations: string[]) {
  return (
    combinations.findIndex(
      c => normalizeText(textToFind).indexOf(normalizeText(c)) !== -1
    ) !== -1
  );
}
