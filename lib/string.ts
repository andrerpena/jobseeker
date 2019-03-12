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
  var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  return format.test(content);
}
