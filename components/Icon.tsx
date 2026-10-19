import { icons, CircleDot, Link2 } from "lucide-react";

/** Brand glyphs (Lucide v1 no longer ships brand icons). 24px grid, 2px stroke, to match Lucide. */
const BRAND: Record<string, React.ReactNode> = {
  github: <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />,
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
  facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
};

const toPascal = (s: string) =>
  s.split(/[^a-zA-Z0-9]+/).filter(Boolean).map((p) => p[0].toUpperCase() + p.slice(1)).join("");

interface IconProps {
  name?: string;
  size?: number;
  className?: string;
  /** Used when `name` is unknown. Social links fall back to a link glyph, skills to a dot. */
  fallback?: "dot" | "link";
}

/** Resolves an icon identifier from JSON. Unknown names never throw: they render a generic fallback. */
export function Icon({ name, size = 20, className, fallback = "dot" }: IconProps) {
  const key = (name ?? "").toLowerCase().trim();
  if (BRAND[key]) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
        strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        {BRAND[key]}
      </svg>
    );
  }
  const Lucide = key ? (icons as Record<string, React.ComponentType<{ size?: number; className?: string; "aria-hidden"?: boolean }>>)[toPascal(key)] : undefined;
  const Component = Lucide ?? (fallback === "link" ? Link2 : CircleDot);
  return <Component size={size} className={className} aria-hidden />;
}
