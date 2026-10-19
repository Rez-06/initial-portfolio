import { ArrowDown, Check } from "lucide-react";
import type { ProjectArchitecture, ProjectImage, FeatureGroup } from "@/lib/types";
import { localFileExists, isExternal } from "@/lib/assets";
import { SafeImage } from "./SafeImage";

export function DetailSection({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  const id = `sec-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <section aria-labelledby={id} className="scroll-mt-24 border-t border-line pt-10">
      <h2 id={id} className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      {note ? <p className="mt-3 max-w-2xl text-sm text-muted">{note}</p> : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}

export const Paragraphs = ({ items }: { items: string[] }) => (
  <div className="max-w-2xl space-y-5">{items.map((p) => <p key={p}>{p}</p>)}</div>
);

export const CheckList = ({ items, columns = false }: { items: string[]; columns?: boolean }) => (
  <ul className={`space-y-3 ${columns ? "sm:grid sm:grid-cols-2 sm:gap-x-8 sm:space-y-0 sm:gap-y-3" : ""}`}>
    {items.map((i) => (
      <li key={i} className="flex gap-3">
        <Check size={18} aria-hidden className="mt-1 shrink-0 text-cobalt" />
        <span className="min-w-0 [overflow-wrap:anywhere]">{i}</span>
      </li>
    ))}
  </ul>
);

export const BulletList = ({ items }: { items: string[] }) => (
  <ul className="max-w-2xl list-disc space-y-2.5 pl-5 marker:text-cobalt">{items.map((i) => <li key={i}>{i}</li>)}</ul>
);

export function FeatureGroups({ groups }: { groups: FeatureGroup[] }) {
  return (
    <div className="grid gap-x-10 gap-y-9 md:grid-cols-2">
      {groups.map((g) => (
        <div key={g.title}>
          <h3 className="text-lg font-semibold">{g.title}</h3>
          <div className="mt-3"><CheckList items={g.items} /></div>
        </div>
      ))}
    </div>
  );
}

/** Stacked block diagram built purely from the `architecture.layers` JSON. */
export function ArchitectureDiagram({ architecture: a }: { architecture: ProjectArchitecture }) {
  return (
    <div>
      {a.summary ? <p className="max-w-2xl">{a.summary}</p> : null}
      {a.layers.length ? (
        <ol aria-label="Architecture layers" className={`${a.summary ? "mt-8" : ""} flex flex-col`}>
          {a.layers.map((l, i) => (
            <li key={l.title} className="flex flex-col items-stretch">
              <div className="grid gap-3 rounded-xl border border-line bg-card p-4 sm:grid-cols-[11rem_1fr] sm:gap-6 sm:p-5">
                <div>
                  <h3 className="font-semibold leading-snug text-ink">{l.title}</h3>
                  {l.description ? <p className="mt-1 text-sm leading-snug text-muted">{l.description}</p> : null}
                </div>
                {l.items.length ? (
                  <ul className="flex flex-wrap content-start gap-2">
                    {l.items.map((it) => <li key={it} className="rounded-md border border-cobalt/30 bg-cobalt-wash px-2.5 py-1 text-sm font-medium text-cobalt-deep [overflow-wrap:anywhere]">{it}</li>)}
                  </ul>
                ) : null}
              </div>
              {i < a.layers.length - 1 ? <ArrowDown size={18} aria-hidden className="mx-auto my-1.5 text-muted" /> : null}
            </li>
          ))}
        </ol>
      ) : null}
      {a.notes.length ? <div className="mt-8"><BulletList items={a.notes} /></div> : null}
    </div>
  );
}

/** Gallery items whose files don't exist are skipped (and the section hides if none remain). */
export function usableGallery(items: ProjectImage[], slug: string): ProjectImage[] {
  return items.filter((g) => {
    const ok = isExternal(g.src) || localFileExists(g.src);
    if (!ok) console.warn(`[portfolio-data] Project "${slug}": gallery image "${g.src}" not found in public/, skipped.`);
    return ok;
  });
}

export function Gallery({ items, title }: { items: ProjectImage[]; title: string }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2">
      {items.map((g, i) => (
        <li key={g.src}>
          <figure>
            <SafeImage src={g.src} alt={g.alt} fallbackLabel={title} sizes="(min-width:1024px) 480px, (min-width:640px) 45vw, 92vw"
              className="aspect-[16/10] rounded-[var(--radius-media)] border border-line" priority={i === 0 && false} />
            {g.caption ? <figcaption className="mt-2 text-sm text-muted">{g.caption}</figcaption> : null}
          </figure>
        </li>
      ))}
    </ul>
  );
}
