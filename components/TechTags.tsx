export function TechTags({ items, max, label = "Technologies" }: { items: string[]; max?: number; label?: string }) {
  if (!items.length) return null;
  const shown = max ? items.slice(0, max) : items;
  const hidden = items.length - shown.length;
  return (
    <ul aria-label={label} className="flex flex-wrap gap-2">
      {shown.map((t) => <li key={t} className="tag">{t}</li>)}
      {hidden > 0 ? <li className="tag text-muted" title={items.slice(max).join(", ")}>+{hidden} more</li> : null}
    </ul>
  );
}
