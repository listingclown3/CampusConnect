const CONTROL_CHARS = new RegExp('[\\u0000-\\u001F\\u007F]', 'g');

/**
 * Trims, strips control characters, and caps the length of free-text user
 * input before it's stored or sent to the backend. React already escapes
 * text content on render, so this guards against garbage/oversized data
 * reaching storage rather than against HTML injection.
 */
export function sanitizeText(value: string, maxLength: number): string {
  const stripped = value.replace(CONTROL_CHARS, '');
  return stripped.trim().slice(0, maxLength);
}

export function sanitizeTextList(
  values: string[],
  { maxItems, maxLengthPerItem }: { maxItems: number; maxLengthPerItem: number }
): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const raw of values) {
    if (result.length >= maxItems) break;
    const cleaned = sanitizeText(raw, maxLengthPerItem);
    const key = cleaned.toLowerCase();
    if (!cleaned || seen.has(key)) continue;
    seen.add(key);
    result.push(cleaned);
  }

  return result;
}
