"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDatum } from "@/lib/utils";
import type { GalerieAlbum } from "@/types/content";

export default function Gallery({ alben }: { alben: GalerieAlbum[] }) {
  const [open, setOpen] = useState<{ album: number; bild: number } | null>(null);

  const aktuellesAlbum = open ? alben[open.album] : null;
  const aktuellesBild = aktuellesAlbum && open ? aktuellesAlbum.bilder[open.bild] : null;

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }

    function next() {
      setOpen((o) => {
        if (!o) return o;
        const album = alben[o.album];
        return { album: o.album, bild: (o.bild + 1) % album.bilder.length };
      });
    }

    function prev() {
      setOpen((o) => {
        if (!o) return o;
        const album = alben[o.album];
        return { album: o.album, bild: (o.bild - 1 + album.bilder.length) % album.bilder.length };
      });
    }

    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, alben]);

  return (
    <div className="flex flex-col gap-16">
      {alben.map((album, albumIndex) => (
        <section key={album.slug}>
          <div className="mb-5 flex items-baseline justify-between gap-4">
            <h2 className="font-display text-2xl font-bold text-fisch-black">{album.titel}</h2>
            <span className="text-sm text-fisch-muted">{formatDatum(album.datum)}</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {album.bilder.map((bild, bildIndex) => (
              <button
                key={bild.src}
                type="button"
                onClick={() => setOpen({ album: albumIndex, bild: bildIndex })}
                className="group relative aspect-square overflow-hidden rounded-lg bg-fisch-black"
              >
                <Image
                  src={bild.src}
                  alt={bild.alt}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        </section>
      ))}

      {open && aktuellesAlbum && aktuellesBild && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Bildergalerie: ${aktuellesAlbum.titel}`}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setOpen(null)}
        >
          <button
            type="button"
            aria-label="Galerie schließen"
            onClick={() => setOpen(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            type="button"
            aria-label="Vorheriges Bild"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((o) =>
                o
                  ? {
                      album: o.album,
                      bild: (o.bild - 1 + aktuellesAlbum.bilder.length) % aktuellesAlbum.bilder.length,
                    }
                  : o
              );
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 sm:left-4"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>

          <div
            className="relative flex max-h-[80vh] w-full max-w-4xl flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={aktuellesBild.src}
                alt={aktuellesBild.alt}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>
            <p className="mt-3 text-center text-sm text-white/80">{aktuellesBild.alt}</p>
          </div>

          <button
            type="button"
            aria-label="Nächstes Bild"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((o) =>
                o ? { album: o.album, bild: (o.bild + 1) % aktuellesAlbum.bilder.length } : o
              );
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 sm:right-4"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        </div>
      )}
    </div>
  );
}
