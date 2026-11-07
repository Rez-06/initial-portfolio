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

/** The resume is published from /public, so the buttons always download the PDF. */
export function getResumeLink(): ResumeLink {
  return { href: profile.resumePath, label: "Download Resume", isFile: true };
}
