import Link from "next/link";

interface Props {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline" | "quiet";
  /** Opens in a new tab with safe rel attributes. */
  external?: boolean;
  download?: boolean;
  className?: string;
}

export function ButtonLink({ href, children, variant = "primary", external, download, className = "" }: Props) {
  const cls = `btn btn-${variant} ${className}`;
  const internal = (href.startsWith("/") || href.startsWith("#")) && !download;
  if (internal) return <Link href={href} className={cls}>{children}</Link>;
  return (
    <a href={href} className={cls} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...(download ? { download: true } : {})}>
      {children}
    </a>
  );
}
