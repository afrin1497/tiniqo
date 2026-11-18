import { useState, type MouseEvent } from "react";

import { img } from "@/data/images";
import { cn } from "@/lib/utils";

export function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const current = images[active] ?? images[0] ?? "";

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  return (
    <div className="flex flex-col-reverse gap-3 md:flex-row">
      <ul className="no-scrollbar flex gap-2 overflow-x-auto md:w-20 md:flex-col" aria-label="Product images">
        {images.map((key, i) => (
          <li key={`${key}-${i}`} className="shrink-0">
            <button
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === active}
              className={cn(
                "block size-16 overflow-hidden rounded-lg border-2 md:size-20",
                i === active ? "border-sage-deep" : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              <img src={img(key)} alt="" width={160} height={200} loading="lazy" className="size-full object-cover" />
            </button>
          </li>
        ))}
      </ul>
      <div
        className="relative aspect-[4/5] flex-1 cursor-zoom-in overflow-hidden rounded-2xl border border-border bg-secondary"
        onMouseMove={onMove}
        onMouseLeave={() => setZoom(null)}
      >
        <img
          src={img(current)}
          alt={alt}
          width={1024}
          height={1280}
          className="size-full object-cover transition-transform duration-200"
          style={zoom ? { transform: "scale(1.8)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
        />
        <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-card/90 px-3 py-1 text-xs font-semibold text-muted-foreground md:block">
          Hover to zoom
        </span>
      </div>
    </div>
  );
}
