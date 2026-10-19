interface Props {
  id: string;
  title: string;
  intro?: React.ReactNode;
  /** "split": heading left, content right (desktop). "stacked": heading above full-width content. */
  layout?: "split" | "stacked";
  aside?: React.ReactNode;
  children: React.ReactNode;
}

export function Section({ id, title, intro, layout = "split", aside, children }: Props) {
  const heading = (
    <>
      <h2 id={`${id}-title`} className="text-[2rem] font-semibold leading-tight tracking-tight sm:text-4xl">{title}</h2>
      {intro ? <p className="mt-4 max-w-md text-muted">{intro}</p> : null}
      {aside ? <div className="mt-6">{aside}</div> : null}
    </>
  );
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-16 border-t border-line py-20 sm:py-28">
      <div className={`container-x ${layout === "split" ? "grid gap-10 lg:grid-cols-12 lg:gap-12" : ""}`}>
        {layout === "split" ? (
          <>
            <div className="lg:col-span-4"><div className="lg:sticky lg:top-28">{heading}</div></div>
            <div className="min-w-0 lg:col-span-8">{children}</div>
          </>
        ) : (
          <>
            <div className="max-w-2xl">{heading}</div>
            <div className="mt-12">{children}</div>
          </>
        )}
      </div>
    </section>
  );
}
