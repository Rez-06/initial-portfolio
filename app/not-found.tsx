import type { Metadata } from "next";
import { ButtonLink } from "@/components/ButtonLink";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <main id="main" className="container-x grid min-h-[60vh] place-content-center py-24">
      <p className="font-display text-7xl font-semibold tracking-tighter text-cobalt sm:text-8xl">404</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">This page doesn’t exist.</h1>
      <p className="mt-3 max-w-md text-muted">The link may be mistyped, or the project may have been renamed.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/">Back home</ButtonLink>
        <ButtonLink href="/#projects" variant="outline">See projects</ButtonLink>
      </div>
    </main>
  );
}
