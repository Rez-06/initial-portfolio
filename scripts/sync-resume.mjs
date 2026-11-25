import fs from "node:fs";
import path from "node:path";

// Keeps the published resume (public/) in sync with the working copy at the
// repo root, so the Download Resume button always serves the current version.
const root = process.cwd();
const profile = JSON.parse(
  fs.readFileSync(path.join(root, "data", "profile.json"), "utf8"),
);
const resumePath = String(profile.resume?.path ?? "/Rezwan_Ahmed_Ovi_Resume.pdf").replace(/^\/+/, "");
const source = path.join(root, path.basename(resumePath));
const target = path.join(root, "public", resumePath);

if (!fs.existsSync(source)) {
  if (!fs.existsSync(target)) {
    console.warn(`[resume] No resume found at ${source} or ${target}`);
  }
  process.exit(0);
}

const upToDate =
  fs.existsSync(target) && fs.readFileSync(source).equals(fs.readFileSync(target));

if (!upToDate) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
  console.log(`[resume] Synced ${path.basename(source)} -> public/${resumePath}`);
}
