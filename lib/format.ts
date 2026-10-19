const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2025-03" -> "Mar 2025", "2028" -> "2028". Anything else is returned unchanged. */
export function formatDate(value?: string): string | undefined {
  if (!value) return undefined;
  const m = /^(\d{4})-(\d{2})$/.exec(value);
  if (m && Number(m[2]) >= 1 && Number(m[2]) <= 12) return `${MONTHS[Number(m[2]) - 1]} ${m[1]}`;
  return value;
}
export function formatPeriod(start?: string, end?: string, endIsExpected = false): string | undefined {
  const s = formatDate(start), e = formatDate(end);
  if (s && e) return `${s} – ${endIsExpected ? "expected " : ""}${e}`;
  if (e) return endIsExpected ? `Expected ${e}` : e;
  if (s) return `Since ${s}`;
  return undefined;
}
export const hostOf = (url: string) => {
  try { return new URL(url).host.replace(/^www\./, ""); } catch { return url; }
};
