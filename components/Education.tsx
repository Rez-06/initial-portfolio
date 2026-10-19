import { education } from "@/lib/data";
import { formatPeriod } from "@/lib/format";
import { Section } from "./Section";

export function Education() {
  if (!education.length) return null;
  return (
    <Section id="education" title="Education">
      <ol className="space-y-6">
        {education.map((e) => {
          const period = formatPeriod(e.startDate, e.endDate, e.endIsExpected);
          return (
            <li key={`${e.institution}-${e.degree}`} className="rounded-[var(--radius-media)] border border-line bg-card p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                {e.status ? <span className="font-semibold text-ink">{e.status}</span> : null}
                {period ? <span>{period}</span> : null}
              </div>
              <h3 className="mt-3 text-2xl font-semibold leading-snug">{e.institution}</h3>
              <p className="mt-1 text-lg text-ink">{e.degree}</p>
              {e.summary ? <p className="mt-4 max-w-2xl">{e.summary}</p> : null}
              {e.focusAreas.length ? (
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-ink">Academic areas</h4>
                  <ul className="mt-3 flex flex-wrap gap-2">{e.focusAreas.map((a) => <li key={a} className="tag">{a}</li>)}</ul>
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
