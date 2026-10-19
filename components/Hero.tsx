import { ArrowDown, Download, Mail } from "lucide-react";
import { profile, socials } from "@/lib/data";
import { getResumeLink, resolveImage } from "@/lib/assets";
import { ButtonLink } from "./ButtonLink";
import { Icon } from "./Icon";
import { SafeImage } from "./SafeImage";

export function Hero() {
  const resume = getResumeLink();
  const heroSocials = socials.filter((s) => s.hero);
  const hasPortrait = !!resolveImage(profile.portrait.src);
  const caption = [profile.university.replace(/,.*$/, ""), profile.degree.replace(/^BSc in /, "BSc "), profile.expectedGraduation ? `Expected ${profile.expectedGraduation}` : ""].filter(Boolean);

  return (
    <section id="home" className="relative scroll-mt-16 overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="container-x relative h-full"><div className="grid-lines absolute inset-y-0 inset-x-5 sm:inset-x-8" /></div>
      </div>

      <div className="container-x relative grid items-center gap-12 pb-20 pt-14 lg:grid-cols-12 lg:gap-10 lg:pb-28 lg:pt-24">
        <div className="lg:col-span-7">
          {profile.currentFocus ? (
            <p className="rise inline-flex max-w-full items-center gap-2 rounded-full border border-line bg-card px-3.5 py-1.5 text-sm text-ink" style={{ "--d": "0ms" } as React.CSSProperties}>
              <span aria-hidden className="size-2 shrink-0 rounded-full bg-cobalt" />
              <span>{profile.currentFocus}</span>
            </p>
          ) : null}

          <div className="rise mt-8" style={{ "--d": "80ms" } as React.CSSProperties}>
            <p className="font-display text-lg font-semibold text-ink">{profile.name}</p>
            <p className="text-muted">{profile.designation}</p>
          </div>

          <h1 className="rise mt-4 text-[clamp(2.75rem,8.4vw,5.9rem)] font-semibold leading-[0.98] tracking-[-0.035em]" style={{ "--d": "140ms" } as React.CSSProperties}>
            {profile.headline}
          </h1>

          <p className="rise mt-7 max-w-xl text-lg leading-relaxed sm:text-xl" style={{ "--d": "220ms" } as React.CSSProperties}>{profile.intro}</p>

          <div className="rise mt-9 flex flex-wrap items-center gap-3" style={{ "--d": "300ms" } as React.CSSProperties}>
            <ButtonLink href="/#projects"><ArrowDown size={18} aria-hidden /> Explore Projects</ButtonLink>
            <a href={resume.href} {...(resume.isFile ? { download: true } : {})} className="btn btn-outline">
              {resume.isFile ? <Download size={18} aria-hidden /> : <Mail size={18} aria-hidden />} {resume.label}
            </a>
            <ul className="flex items-center gap-2 sm:ml-2">
              {heroSocials.map((s) => (
                <li key={s.id}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="icon-btn" aria-label={`${s.label} (opens in a new tab)`}>
                    <Icon name={s.icon} fallback="link" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {!resume.isFile ? (
            <p className="rise mt-3 text-sm text-muted" style={{ "--d": "340ms" } as React.CSSProperties}>The resume PDF isn’t published yet. The button opens an email request.</p>
          ) : null}
        </div>

        <figure className="rise mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-none lg:justify-self-end lg:w-[min(100%,24rem)]" style={{ "--d": "260ms" } as React.CSSProperties}>
          <div className="relative">
            <div aria-hidden className="absolute inset-0 translate-x-3 translate-y-3 rounded-[var(--radius-media)] border border-cobalt/60" />
            {hasPortrait ? (
              <SafeImage src={profile.portrait.src} alt={profile.portrait.alt} priority sizes="(min-width:1024px) 384px, 90vw"
                className="relative aspect-[4/5] rounded-[var(--radius-media)] border border-line" />
            ) : (
              <div role="img" aria-label={`${profile.name} monogram`} className="relative grid aspect-[4/5] place-items-center rounded-[var(--radius-media)] border border-line bg-paper-deep">
                <span className="font-display text-[7rem] font-semibold leading-none tracking-tighter text-cobalt">{profile.monogram}</span>
              </div>
            )}
          </div>
          {caption.length ? <figcaption className="mt-6 text-sm text-muted">{caption.join(" · ")}</figcaption> : null}
        </figure>
      </div>
    </section>
  );
}
