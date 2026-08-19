import Image from "next/image";
import type { ProjectImage } from "@/data/projects";

/**
 * Chrome-less browser frame around a product screenshot.
 *
 * When an image is still `pending` it renders a labelled placeholder rather
 * than a broken or invented visual. Drop the real file into /public/work and
 * remove `pending: true` in data/projects.ts to swap it in.
 */
export function BrowserFrame({
  image,
  priority = false,
  label,
}: {
  image: ProjectImage;
  priority?: boolean;
  label?: string;
}) {
  return (
    <figure className="overflow-hidden rounded-[12px] border border-border bg-surface shadow-[var(--shadow-md)]">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
        </span>
        {label ? (
          <span className="label ml-2 truncate text-ink-muted">{label}</span>
        ) : null}
      </div>

      {image.pending ? (
        <div className="flex aspect-[16/10] flex-col items-center justify-center gap-3 bg-surface-sunken px-6 text-center">
          <span className="label text-ink-muted">Screenshot pending</span>
          <span className="text-body-sm measure-tight text-ink-muted">
            {image.alt}
          </span>
        </div>
      ) : (
        <Image
          src={image.src}
          alt={image.alt}
          width={1600}
          height={1000}
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1100px"
          className="h-auto w-full"
        />
      )}
    </figure>
  );
}
