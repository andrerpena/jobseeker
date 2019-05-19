export function removeQueryString(url: string) {
  return url ? url.split("?")[0] : "";
}
