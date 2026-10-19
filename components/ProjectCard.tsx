import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import type { Project } from "@/lib/types";
import { SafeImage } from "./SafeImage";
import { StatusBadge } from "./StatusBadge";
import { TechTags } from "./TechTags";

interface Props { project: Project; variant: "wide" | "compact"; priority?: boolean }

/** The whole card is one link (via the "View Details" link's stretched ::after); live/repo links sit above it. */
export function ProjectCard({ project: p, variant, priority }: Props) {
  const wide = variant === "wide";
  const extra = [p.liveUrl && { href: p.liveUrl, label: "Live site" }, p.repositoryUrl && { href: p.repositoryUrl, label: "Repository" }].filter(Boolean) as { href: string; label: string }[];

  return (
    <article className={`card group relative ${wide ? "grid gap-6 lg:grid-cols-12 lg:items-center lg:gap-12" : "flex flex-col gap-5"}`}>
      <div className={wide ? "lg:col-span-7" : ""}>
        <SafeImage
          src={p.coverImage}
          alt={p.coverAlt ?? `Cover image for ${p.title}`}
          fallbackLabel={p.title}
          priority={priority}
          sizes={wide ? "(min-width:1024px) 720px, 92vw" : "(min-width:1024px) 480px, (min-width:640px) 45vw, 92vw"}
          className="aspect-[16/10] rounded-[var(--radius-media)] border border-line"
          imgClassName="card-img"
        />
      </div>
      <div className={`flex min-w-0 flex-col ${wide ? "lg:col-span-5" : "flex-1"}`}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <StatusBadge status={p.status} />
          {p.categories[0] ? <span className="text-sm text-muted">{p.categories.slice(0, 2).join(" · ")}</span> : null}
        </div>
        <h3 className={`mt-4 font-semibold leading-[1.1] tracking-tight [overflow-wrap:anywhere] ${wide ? "text-3xl sm:text-4xl" : "text-2xl"}`}>{p.title}</h3>
        {p.description ? <p className={`mt-4 ${wide ? "" : "line-clamp-4"}`}>{p.description}</p> : null}
        <div className="mt-5"><TechTags items={p.technologies} max={wide ? 6 : 5} /></div>
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 pt-1">
          <Link href={`/projects/${p.slug}`} className="inline-flex min-h-11 items-center gap-2 rounded-sm font-semibold text-cobalt after:absolute after:inset-0 after:content-['']">
            View Details
            <ArrowRight size={18} aria-hidden className="transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-0.5 motion-reduce:transition-none" />
            <span className="sr-only">: {p.title}</span>
          </Link>
          {extra.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="relative z-10 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-ink underline decoration-line underline-offset-4 hover:decoration-ink">
              {l.label} <ExternalLink size={14} aria-hidden /><span className="sr-only"> (opens in a new tab)</span>
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}
