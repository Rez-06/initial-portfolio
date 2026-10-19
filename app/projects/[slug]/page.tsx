import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink, Info } from "lucide-react";
import { getAdjacentProjects, getProject, projects } from "@/lib/data";
import { resolveImage } from "@/lib/assets";
import { formatPeriod, hostOf } from "@/lib/format";
import { ButtonLink } from "@/components/ButtonLink";
import { SafeImage } from "@/components/SafeImage";
import { StatusBadge } from "@/components/StatusBadge";
import { TechTags } from "@/components/TechTags";
import {
  ArchitectureDiagram, BulletList, CheckList, DetailSection, FeatureGroups, Gallery, Paragraphs, usableGallery,
} from "@/components/ProjectSections";

type Params = { slug: string };

/** Every slug in projects.json becomes a static route. Unknown slugs 404. */
export const dynamicParams = false;
export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return { title: "Project not found" };
  const cover = resolveImage(p.coverImage);
  return {
    title: p.title,
    description: p.description || p.subtitle,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: {
      title: p.title,
      description: p.description || p.subtitle,
      type: "article",
      url: `/projects/${p.slug}`,
      ...(cover && !cover.startsWith("http") ? { images: [{ url: cover, alt: p.coverAlt ?? p.title }] } : {}),
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const { prev, next } = getAdjacentProjects(p.slug);
  const gallery = usableGallery(p.gallery, p.slug);
  const overview = p.overview.length ? p.overview : p.description ? [p.description] : []; // fallback for minimal entries
  const period = formatPeriod(p.startDate, p.endDate);
  const hasProblem = p.problem.length > 0 || p.goals.length > 0;
  const hasFeatures = p.features.length > 0 || p.featureGroups.length > 0;
  const links = [
    p.liveUrl && { href: p.liveUrl, label: "Live website" },
    p.repositoryUrl && { href: p.repositoryUrl, label: "GitHub repository" },
  ].filter(Boolean) as { href: string; label: string }[];
  const sidebarFacts = [...p.facts, ...(period ? [{ label: "Timeline", value: period }] : [])];

  return (
    <main id="main" className="pb-24">
      <article>
        <header className="container-x pt-10 sm:pt-14">
          <Link href="/#projects" className="inline-flex min-h-11 items-center gap-2 font-semibold text-cobalt">
            <ArrowLeft size={18} aria-hidden /> Back to projects
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
            <StatusBadge status={p.status} />
            {p.categories.length ? <span className="text-sm text-muted">{p.categories.join(" · ")}</span> : null}
          </div>
          <h1 className="mt-5 max-w-4xl text-[clamp(2.25rem,6vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.03em] [overflow-wrap:anywhere]">{p.title}</h1>
          {p.subtitle ? <p className="mt-5 max-w-2xl text-xl leading-snug text-ink">{p.subtitle}</p> : null}
          {links.length ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {links.map((l, i) => (
                <ButtonLink key={l.label} href={l.href} external variant={i === 0 ? "primary" : "outline"}>
                  {l.label} <ExternalLink size={16} aria-hidden /><span className="sr-only"> (opens in a new tab)</span>
                </ButtonLink>
              ))}
            </div>
          ) : null}
          {p.liveNote ? <p className="mt-5 flex max-w-2xl items-start gap-2 text-sm text-muted"><Info size={16} aria-hidden className="mt-0.5 shrink-0" />{p.liveNote}</p> : null}
        </header>

        <div className="container-x mt-10">
          <SafeImage src={p.coverImage} alt={p.coverAlt ?? `Cover image for ${p.title}`} fallbackLabel={p.title} priority
            sizes="(min-width:1280px) 1216px, 94vw" className="aspect-[16/9] rounded-[var(--radius-media)] border border-line sm:aspect-[2/1]" />
        </div>

        <div className="container-x mt-14 grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 space-y-14 lg:col-span-8">
            {overview.length ? <DetailSection title="Overview"><Paragraphs items={overview} /></DetailSection> : null}

            {hasProblem ? (
              <DetailSection title="Problem and goals">
                {p.problem.length ? <Paragraphs items={p.problem} /> : null}
                {p.goals.length ? <div className={p.problem.length ? "mt-6" : ""}><CheckList items={p.goals} /></div> : null}
              </DetailSection>
            ) : null}

            {hasFeatures ? (
              <DetailSection title="Key features">
                {p.featureGroups.length ? <FeatureGroups groups={p.featureGroups} /> : null}
                {p.features.length ? <div className={p.featureGroups.length ? "mt-8" : ""}><CheckList items={p.features} columns /></div> : null}
              </DetailSection>
            ) : null}

            {p.architecture ? <DetailSection title="Architecture"><ArchitectureDiagram architecture={p.architecture} /></DetailSection> : null}

            {gallery.length ? <DetailSection title="Gallery"><Gallery items={gallery} title={p.title} /></DetailSection> : null}

            {p.challenges.length ? <DetailSection title="Challenges" note={p.challengesNote}><BulletList items={p.challenges} /></DetailSection> : null}

            {p.lessonsLearned.length ? <DetailSection title="Lessons learned"><BulletList items={p.lessonsLearned} /></DetailSection> : null}

            {p.futureImprovements.length ? (
              <DetailSection title="Future improvements" note="Ideas for what could come next. None of these are implemented yet.">
                <BulletList items={p.futureImprovements} />
              </DetailSection>
            ) : null}

            {p.runLocally ? <DetailSection title="Running it locally"><p className="max-w-2xl">{p.runLocally}</p></DetailSection> : null}
          </div>

          <aside className="lg:col-span-4" aria-label="Project summary">
            <div className="space-y-8 lg:sticky lg:top-24">
              {p.technologies.length ? (
                <div>
                  <h2 className="text-lg font-semibold">Technology stack</h2>
                  <div className="mt-3"><TechTags items={p.technologies} /></div>
                </div>
              ) : null}
              {sidebarFacts.length ? (
                <div>
                  <h2 className="text-lg font-semibold">At a glance</h2>
                  <dl className="mt-3 divide-y divide-line border-y border-line">
                    {sidebarFacts.map((f) => (
                      <div key={f.label} className="py-3">
                        <dt className="text-sm text-muted">{f.label}</dt>
                        <dd className="font-medium text-ink [overflow-wrap:anywhere]">{f.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : null}
              {links.length ? (
                <div>
                  <h2 className="text-lg font-semibold">Links</h2>
                  <ul className="mt-3 space-y-2">
                    {links.map((l) => (
                      <li key={l.label}>
                        <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-link inline-flex min-h-10 max-w-full items-center gap-1.5 [overflow-wrap:anywhere]">
                          {l.label}: {hostOf(l.href)} <ExternalLink size={14} aria-hidden className="shrink-0" /><span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </aside>
        </div>
      </article>

      <nav aria-label="More projects" className="container-x mt-20">
        <div className="grid gap-4 border-t border-line pt-8 sm:grid-cols-2">
          {prev ? (
            <Link href={`/projects/${prev.slug}`} className="group rounded-xl border border-line bg-card p-5 hover:border-ink">
              <span className="flex items-center gap-2 text-sm text-muted"><ArrowLeft size={16} aria-hidden /> Previous project</span>
              <span className="mt-1 block font-display text-lg font-semibold leading-snug text-ink">{prev.title}</span>
            </Link>
          ) : <span />}
          {next ? (
            <Link href={`/projects/${next.slug}`} className="group rounded-xl border border-line bg-card p-5 hover:border-ink sm:text-right">
              <span className="flex items-center gap-2 text-sm text-muted sm:justify-end">Next project <ArrowRight size={16} aria-hidden /></span>
              <span className="mt-1 block font-display text-lg font-semibold leading-snug text-ink">{next.title}</span>
            </Link>
          ) : null}
        </div>
        <div className="mt-8"><ButtonLink href="/#projects" variant="outline"><ArrowLeft size={18} aria-hidden /> Back to projects</ButtonLink></div>
      </nav>
    </main>
  );
}
