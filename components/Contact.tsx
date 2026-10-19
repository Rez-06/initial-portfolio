import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { profile, socials } from "@/lib/data";
import { hostOf } from "@/lib/format";
import { ButtonLink } from "./ButtonLink";
import { Icon } from "./Icon";
import { Section } from "./Section";

export function Contact() {
  return (
    <Section id="contact" title="Contact" intro="If you’d like to talk about a project, a collaboration, or something I’ve built, email is the quickest way to reach me.">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="min-w-0">
          {profile.email ? (
            <>
              <a href={`mailto:${profile.email}`} className="block break-all font-display text-2xl font-semibold leading-snug tracking-tight text-ink underline decoration-line decoration-2 underline-offset-8 hover:decoration-cobalt sm:text-3xl">
                {profile.email}
              </a>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <ButtonLink href={`mailto:${profile.email}`}><Mail size={18} aria-hidden /> Email Me</ButtonLink>
                {profile.phone ? (
                  <a href={`tel:${profile.phone.tel}`} className="btn btn-quiet"><Phone size={18} aria-hidden /> {profile.phone.display}</a>
                ) : null}
              </div>
            </>
          ) : null}
        </div>

        {socials.length ? (
          <ul className="divide-y divide-line border-y border-line">
            {socials.map((s) => (
              <li key={s.id}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="group flex min-h-16 items-center gap-4 py-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-[10px] border border-line bg-card text-ink"><Icon name={s.icon} fallback="link" /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-ink">{s.label}</span>
                    <span className="block truncate text-sm text-muted">{s.handle ?? hostOf(s.url)}</span>
                  </span>
                  <ArrowUpRight size={18} aria-hidden className="shrink-0 text-muted transition-transform duration-200 ease-[var(--ease-out)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cobalt motion-reduce:transition-none" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Section>
  );
}
