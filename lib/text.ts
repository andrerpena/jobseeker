export function fullTextObject(obj: Object, text: string) {
  const textNormalized = text.toLowerCase();
  for (let key in obj) {
    if (
      obj[key] &&
      obj[key]
        .toString()
        .toLowerCase()
        .indexOf(textNormalized) != -1
    ) {
      return true;
    }
  }
  return false;
}
