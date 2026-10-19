import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { experience } from "@/lib/data";
import { formatPeriod } from "@/lib/format";
import { Section } from "./Section";

export function Experience() {
  const { entries, emptyTitle, emptyText } = experience;
  return (
    <Section id="experience" title="Experience">
      {entries.length ? (
        <ol className="space-y-6">
          {entries.map((e) => {
            const period = formatPeriod(e.startDate, e.endDate);
            return (
              <li key={`${e.organization}-${e.role}-${e.startDate ?? ""}`} className="rounded-[var(--radius-media)] border border-line bg-card p-6 sm:p-8">
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
                  {e.type ? <span className="font-semibold text-ink">{e.type}</span> : null}
                  {period ? <span>{period}</span> : null}
                  {e.location ? <span>{e.location}</span> : null}
                </div>
                <h3 className="mt-3 text-2xl font-semibold leading-snug">{e.role}</h3>
                <p className="mt-1 text-lg text-ink">
                  {e.url ? <a href={e.url} target="_blank" rel="noopener noreferrer" className="text-link inline-flex items-center gap-1.5">{e.organization}<ExternalLink size={14} aria-hidden /><span className="sr-only"> (opens in a new tab)</span></a> : e.organization}
                </p>
                {e.summary ? <p className="mt-4 max-w-2xl">{e.summary}</p> : null}
                {e.highlights.length ? <ul className="mt-4 list-disc space-y-1.5 pl-5 marker:text-cobalt">{e.highlights.map((h) => <li key={h}>{h}</li>)}</ul> : null}
              </li>
            );
          })}
        </ol>
      ) : (
        <div className="rounded-[var(--radius-media)] border border-dashed border-ink/40 p-6 sm:p-8">
          <h3 className="text-2xl font-semibold leading-snug">{emptyTitle}</h3>
          <p className="mt-3 max-w-2xl">{emptyText}</p>
          <Link href="/#projects" className="text-link mt-5 inline-block">See the projects</Link>
        </div>
      )}
    </Section>
  );
}
