export function getUrlFromBackgroundImage(
  backgroundImage: string
): string | null {
  if (!backgroundImage) return null;
  const match = backgroundImage.match(/url\("(.*)"\)/);
  if (match) {
    return match[1];
  }
  return null;
}
