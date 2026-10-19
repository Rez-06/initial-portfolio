import { profile } from "@/lib/data";
import { Section } from "./Section";

export function About() {
  if (!profile.about.length) return null;
  const [lead, ...rest] = profile.about;
  return (
    <Section id="about" title="About">
      <p className="max-w-2xl text-balance text-xl leading-snug text-ink sm:text-2xl">{lead}</p>
      <div className="mt-8 max-w-2xl space-y-5">{rest.map((p) => <p key={p}>{p}</p>)}</div>
      {profile.interests.length ? (
        <div className="mt-12">
          <h3 className="text-lg font-semibold">What pulls my attention</h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {profile.interests.map((i) => <li key={i} className="tag">{i}</li>)}
          </ul>
        </div>
      ) : null}
    </Section>
  );
}
