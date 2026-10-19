import fs from "node:fs";
import path from "node:path";
import { profile } from "./data";

const PUBLIC_DIR = path.join(process.cwd(), "public");

export const isExternal = (src: string) => /^https?:\/\//i.test(src);

/** True when a local /images/... path points at a real file inside /public. */
export function localFileExists(src: string | undefined): boolean {
  if (!src || !src.startsWith("/")) return false;
  try {
    const rel = decodeURIComponent(src.split(/[?#]/)[0]);
    const full = path.normalize(path.join(PUBLIC_DIR, rel));
    if (!full.startsWith(PUBLIC_DIR + path.sep)) return false; // no path traversal
    return fs.statSync(full).isFile();
  } catch {
    return false;
  }
}

/** Returns a renderable src, or undefined if the image is missing. */
export function resolveImage(src: string | undefined): string | undefined {
  if (!src) return undefined;
  if (isExternal(src)) return src;
  return localFileExists(src) ? src : undefined;
}

export interface ResumeLink { href: string; label: string; isFile: boolean }

/**
 * If /public/resume.pdf (or the path from profile.json) exists, link to it.
 * Otherwise fall back to an honest "request by email" link: never a dead download.
 */
export function getResumeLink(): ResumeLink {
  if (localFileExists(profile.resumePath)) {
    return { href: profile.resumePath, label: "Download Resume", isFile: true };
  }
  const subject = encodeURIComponent(`Resume request for ${profile.name}`);
  return { href: `mailto:${profile.email}?subject=${subject}`, label: "Request Resume", isFile: false };
}
