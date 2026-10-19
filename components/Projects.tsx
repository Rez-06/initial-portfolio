import { projects } from "@/lib/data";
import { ProjectCard } from "./ProjectCard";
import { Section } from "./Section";

export function Projects() {
  const featured = projects.filter((p) => p.featured);
  const others = projects.filter((p) => !p.featured);
  return (
    <Section id="projects" title="Projects" layout="stacked"
      intro="Selected work, each with its own page covering what it does, how it’s put together, and what could come next.">
      {projects.length === 0 ? (
        <p className="rounded-[var(--radius-media)] border border-dashed border-ink/40 p-8">Projects will appear here once they’re added to <code>data/projects.json</code>.</p>
      ) : (
        <div className="space-y-16">
          {featured.length ? (
            <div className="divide-y divide-line">
              {featured.map((p, i) => (
                <div key={p.slug} className={i === 0 ? "pb-14" : "py-14 last:pb-0"}>
                  <ProjectCard project={p} variant="wide" priority={i === 0} />
                </div>
              ))}
            </div>
          ) : null}
          {others.length ? (
            <ul className={`grid gap-x-8 gap-y-14 sm:grid-cols-2 ${featured.length ? "border-t border-line pt-14" : ""}`}>
              {others.map((p) => <li key={p.slug}><ProjectCard project={p} variant="compact" /></li>)}
            </ul>
          ) : null}
        </div>
      )}
    </Section>
  );
}
