import { normalize } from "@/lib/catalog";

/**
 * Splits `text` into parts, flagging those matching any query term.
 * Matching is accent- and case-insensitive ("camera" highlights "Caméra").
 */
export function highlightParts(text: string, query: string) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [{ text, match: false }];

  // Normalize char by char so indexes in the normalized string map back to `text`.
  let folded = "";
  const origin: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const n = normalize(text[i] ?? "") || (text[i] === " " ? " " : "");
    for (const ch of n) {
      folded += ch;
      origin.push(i);
    }
  }

  const marked = new Array<boolean>(text.length).fill(false);
  for (const term of terms) {
    let from = folded.indexOf(term);
    while (from !== -1) {
      for (let k = from; k < from + term.length; k++) marked[origin[k] ?? 0] = true;
      from = folded.indexOf(term, from + term.length);
    }
  }

  const parts: { text: string; match: boolean }[] = [];
  for (let i = 0; i < text.length; i++) {
    const match = marked[i] ?? false;
    const last = parts[parts.length - 1];
    if (last && last.match === match) last.text += text[i];
    else parts.push({ text: text[i] ?? "", match });
  }
  return parts;
}
