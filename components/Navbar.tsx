"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FileText, Menu, X } from "lucide-react";
import type { NavItem } from "@/lib/types";

interface Props {
  brand: string;
  monogram: string;
  items: NavItem[];
  resume: { href: string; label: string; isFile: boolean };
}

/** "#about" -> "/#about" so the same item works on the home page and on project pages. */
const toHref = (href: string) => (href.startsWith("#") ? `/${href}` : href);

export function Navbar({ brand, monogram, items, resume }: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const pathname = usePathname();
  const onHome = pathname === "/";

  // Highlight the section currently under the header (home page only).
  useEffect(() => {
    if (!onHome) return;
    const ids = items.filter((i) => i.href.startsWith("#")).map((i) => i.href.slice(1));
    const els = ids.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e);
    if (!els.length || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items, onHome]);

  // Escape closes the menu; leaving the mobile breakpoint resets it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const mq = window.matchMedia("(min-width: 768px)");
    const onMq = () => mq.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => { document.removeEventListener("keydown", onKey); mq.removeEventListener("change", onMq); };
  }, [open]);

  const current = onHome ? active : pathname.startsWith("/projects") ? "projects" : "";
  const linkClass = (isActive: boolean) =>
    `relative rounded-md px-3 py-2 text-[0.95rem] font-medium transition-colors duration-150 ${
      isActive ? "text-cobalt" : "text-body hover:text-ink"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-md" aria-label={`${brand}, home`}>
          <span aria-hidden className="grid size-9 place-items-center rounded-[10px] bg-cobalt font-display text-sm font-bold text-white">{monogram}</span>
          <span className="font-display text-lg font-semibold tracking-tight text-ink">{brand}</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {items.map((item) => {
            const isActive = current === item.href.replace(/^#/, "");
            return (
              <Link key={item.href} href={toHref(item.href)} aria-current={isActive ? "true" : undefined} className={linkClass(isActive)}>
                {item.label}
                <span aria-hidden className={`absolute inset-x-3 -bottom-px h-0.5 origin-left bg-cobalt transition-transform duration-200 ease-[var(--ease-out)] ${isActive ? "scale-x-100" : "scale-x-0"}`} />
              </Link>
            );
          })}
          <a href={resume.href} {...(resume.isFile ? { download: true } : {})} className="btn btn-outline ml-3 min-h-10 px-4">
            <FileText size={16} aria-hidden /> Resume
          </a>
        </nav>

        <button
          type="button"
          className="icon-btn md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
        </button>
      </div>

      {/* Mobile panel. `invisible` when closed removes links from the tab order and the accessibility tree. */}
      <div
        id="mobile-menu"
        className={`absolute inset-x-0 top-full border-b border-line bg-paper md:hidden transition-[opacity,transform,visibility] duration-200 ease-[var(--ease-out)] ${
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
        }`}
      >
        <nav aria-label="Mobile" className="container-x flex flex-col py-3">
          {items.map((item) => {
            const isActive = current === item.href.replace(/^#/, "");
            return (
              <Link key={item.href} href={toHref(item.href)} onClick={() => setOpen(false)} aria-current={isActive ? "true" : undefined}
                className={`flex min-h-12 items-center border-b border-line/70 text-lg font-medium ${isActive ? "text-cobalt" : "text-ink"}`}>
                {item.label}
              </Link>
            );
          })}
          <a href={resume.href} onClick={() => setOpen(false)} {...(resume.isFile ? { download: true } : {})} className="btn btn-primary mt-4">
            <FileText size={18} aria-hidden /> {resume.label}
          </a>
        </nav>
      </div>
    </header>
  );
}
