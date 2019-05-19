export function flatten(input: string[][]): string[] {
  if (input.length === 0) {
    return [];
  }
  if (input.length === 1) {
    return input[0];
  }
  const flattenedChildren = flatten(input.slice(1, input.length));
  const result: string[] = [];
  for (let item of input[0]) {
    for (let child of flattenedChildren) {
      result.push(item.toLowerCase() + " " + child.toLowerCase());
    }
  }
  return result;
}
