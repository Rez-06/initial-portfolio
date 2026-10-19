import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { navigation, profile, socials } from "@/lib/data";
import { CurrentYear } from "./CurrentYear";
import { Icon } from "./Icon";

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper-deep">
      <div className="container-x grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="font-display text-xl font-semibold text-ink">{profile.name}</p>
          {profile.tagline ? <p className="mt-2 max-w-xs text-muted">{profile.tagline}</p> : null}
        </div>
        <nav aria-label="Footer" className="md:col-span-4">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-1">
            {navigation.map((n) => (
              <li key={n.href}><Link href={n.href.startsWith("#") ? `/${n.href}` : n.href} className="inline-flex min-h-10 items-center text-body hover:text-ink hover:underline underline-offset-4">{n.label}</Link></li>
            ))}
          </ul>
        </nav>
        <ul className="flex items-start gap-2 md:col-span-3 md:justify-end">
          {socials.map((s) => (
            <li key={s.id}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="icon-btn" aria-label={`${s.label} (opens in a new tab)`}><Icon name={s.icon} fallback="link" /></a>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-line">
        <div className="container-x flex flex-wrap items-center justify-between gap-3 py-5 text-sm text-muted">
          <p>© <CurrentYear /> {profile.name}</p>
          <Link href="#top" className="inline-flex min-h-10 items-center gap-1.5 font-medium text-ink hover:text-cobalt"><ArrowUp size={16} aria-hidden /> Back to top</Link>
        </div>
      </div>
    </footer>
  );
}
