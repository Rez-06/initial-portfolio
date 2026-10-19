import Image from "next/image";
import { ImageOff } from "lucide-react";
import { isExternal, resolveImage } from "@/lib/assets";

interface Props {
  src?: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  /** Sizing/aspect classes for the frame, e.g. "aspect-[16/10]". */
  className?: string;
  imgClassName?: string;
  /** Shown inside the fallback tile when the image file is missing. */
  fallbackLabel?: string;
}

/**
 * Renders a local (or http/https) image. If the path is missing or the file doesn't exist,
 * a neutral tile is rendered instead, so a typo in JSON never leaves a broken-image icon.
 */
export function SafeImage({ src, alt, sizes = "100vw", priority, className = "", imgClassName = "", fallbackLabel }: Props) {
  const ok = resolveImage(src);
  return (
    <div className={`relative overflow-hidden bg-paper-deep ${className}`}>
      {ok ? (
        isExternal(ok) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={ok} alt={alt} loading={priority ? "eager" : "lazy"} className={`absolute inset-0 size-full object-cover ${imgClassName}`} />
        ) : (
          <Image src={ok} alt={alt} fill sizes={sizes} priority={priority} className={`object-cover ${imgClassName}`} />
        )
      ) : (
        <div role="img" aria-label={alt} className="absolute inset-0 grid place-items-center p-4 text-center text-muted">
          <div className="flex flex-col items-center gap-2">
            <ImageOff size={28} aria-hidden />
            {fallbackLabel ? <span className="max-w-[24ch] text-sm font-medium text-balance">{fallbackLabel}</span> : null}
          </div>
        </div>
      )}
    </div>
  );
}
