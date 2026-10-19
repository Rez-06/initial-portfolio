/**
 * Validates the JSON in /data without starting Next.js.
 *   bun run check:data
 * Prints every problem it finds (bad URLs, unknown icons, missing images) and exits non-zero if any exist.
 */
import { icons } from "lucide-react";
import { getDataWarnings, projects, skillGroups, socials } from "../lib/data";
import { localFileExists, isExternal } from "../lib/assets";

const problems: string[] = [...getDataWarnings()];
const pascal = (s: string) => s.split(/[^a-zA-Z0-9]+/).filter(Boolean).map((p) => p[0].toUpperCase() + p.slice(1)).join("");
const BRAND = new Set(["github", "linkedin", "facebook"]);

for (const g of skillGroups)
  for (const s of g.skills)
    if (s.icon && !BRAND.has(s.icon.toLowerCase()) && !(pascal(s.icon) in icons))
      problems.push(`Skill "${s.name}": unknown icon "${s.icon}" (a generic dot will be shown).`);
for (const s of socials)
  if (!BRAND.has(s.icon.toLowerCase()) && !(pascal(s.icon) in icons))
    problems.push(`Social "${s.label}": unknown icon "${s.icon}" (a link glyph will be shown).`);
for (const p of projects) {
  const imgs = [p.coverImage, ...p.gallery.map((g) => g.src)].filter((x): x is string => !!x);
  for (const src of imgs) if (!isExternal(src) && !localFileExists(src)) problems.push(`Project "${p.slug}": image "${src}" not found in public/.`);
  if (!p.coverImage) problems.push(`Project "${p.slug}": no coverImage (a placeholder tile will be shown).`);
  if (!p.description) problems.push(`Project "${p.slug}": empty description.`);
}

console.log(`Checked ${projects.length} projects, ${skillGroups.reduce((n, g) => n + g.skills.length, 0)} skills in ${skillGroups.length} categories.`);
if (problems.length) { console.log(`\n${problems.length} issue(s):`); problems.forEach((m) => console.log(` - ${m}`)); process.exit(1); }
console.log("No problems found.");
