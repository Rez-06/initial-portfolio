import { skillGroups } from "@/lib/data";
import { SKILL_LABEL } from "./StatusBadge";
import { Icon } from "./Icon";
import { Section } from "./Section";

const LEGEND = [
  ["comfortable", "Used in real projects"],
  ["learning", "Actively studying"],
  ["exploring", "Early-stage interest"],
] as const;

export function Skills() {
  if (!skillGroups.length) return null;
  return (
    <Section
      id="skills"
      title="Skills"
      intro="Grouped by category. The label on each one is a plain statement of where I am with it, not a score."
      aside={
        <dl className="space-y-2 text-sm">
          {LEGEND.map(([k, d]) => (
            <div key={k} className="flex gap-3">
              <dt className="w-24 shrink-0 font-semibold text-ink">{SKILL_LABEL[k]}</dt>
              <dd className="text-muted">{d}</dd>
            </div>
          ))}
        </dl>
      }
    >
      <div className="space-y-12">
        {skillGroups.map((g) => (
          <div key={g.category}>
            <h3 className="text-xl font-semibold">{g.category}</h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {g.skills.map((s) => (
                <li key={s.name} className="flex gap-3 rounded-xl border border-line bg-card p-4">
                  <span className="mt-0.5 text-cobalt"><Icon name={s.icon} size={20} /></span>
                  <div className="min-w-0">
                    <p className="break-words font-semibold leading-snug text-ink">{s.name}</p>
                    {s.status ? <p className="mt-0.5 text-sm text-muted">{SKILL_LABEL[s.status]}</p> : null}
                    {s.description ? <p className="mt-1.5 text-sm leading-snug text-muted">{s.description}</p> : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
