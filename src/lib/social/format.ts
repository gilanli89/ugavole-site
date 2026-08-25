export function composeCaption(caption: string, canonicalUrl: string, maxLength: number): string {
  const normalized = caption.trim().replace(/\s+/g, " ");
  const suffix = `\n\n${canonicalUrl}`;
  const available = Math.max(0, maxLength - Array.from(suffix).length);
  const characters = Array.from(normalized);
  const shortened = characters.length > available
    ? `${characters.slice(0, Math.max(0, available - 1)).join("").trimEnd()}…`
    : normalized;
  return `${shortened}${suffix}`;
}

// X counts links with its transformed URL length. A conservative 250-character
// envelope leaves room for one URL and avoids relying on client-side guesswork.
export function composeXText(caption: string, canonicalUrl: string): string {
  const normalized = caption.trim().replace(/\s+/g, " ");
  const characters = Array.from(normalized);
  const shortened = characters.length > 125
    ? `${characters.slice(0, 124).join("").trimEnd()}…`
    : normalized;
  return `${shortened}\n\n${canonicalUrl}`;
}
