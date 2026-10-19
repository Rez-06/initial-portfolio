"use client";

/** Renders the visitor's current year, so a long-lived static build never shows a stale year. */
export function CurrentYear() {
  return <span suppressHydrationWarning>{new Date().getFullYear()}</span>;
}
