export function splitByFixedLength(text: string, length = 13000): string[] {
  let parts = [];
  for (let i = 0; i < text.length; i += length) {
    parts.push(text.substring(i, i + length));
  }
  return parts;
}
