"use client";

import { useState } from "react";
import { Image } from "@/components/ui/image";
import type { Image as ProductImage } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, title }: { images: ProductImage[]; title: string }) {
  const [active, setActive] = useState(0);
  const gallery = images.length > 0 ? images : [];
  if (gallery.length === 0) return null;

  return (
    <div className="flex flex-col-reverse gap-4 lg:flex-row lg:gap-5">
      {gallery.length > 1 && (
        <div className="no-scrollbar flex gap-3 overflow-x-auto lg:w-20 lg:flex-col lg:overflow-visible">
          {gallery.map((image, i) => (
            <button
              key={image.url + i}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1} of ${title}`}
              aria-current={i === active}
              className={cn(
                "relative aspect-[4/5] w-16 shrink-0 overflow-hidden bg-paper-deep transition-opacity lg:w-full",
                i === active ? "ring-1 ring-ink" : "opacity-70 hover:opacity-100",
              )}
            >
              <Image src={image.url} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
      <div className="relative aspect-[4/5] flex-1 overflow-hidden bg-paper-deep">
        <Image
          key={gallery[active].url}
          src={gallery[active].url}
          alt={gallery[active].altText}
          fill
          priority
          sizes="(min-width:1024px) 55vw, 100vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
