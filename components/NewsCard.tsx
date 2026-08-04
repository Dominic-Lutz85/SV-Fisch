import Image from "next/image";
import Link from "next/link";
import { formatDatum } from "@/lib/utils";
import type { NewsFrontmatter } from "@/types/content";

const kategorieStyles: Record<string, string> = {
  Fußball: "bg-fisch-yellow text-fisch-black",
  Gymnastik: "bg-fisch-black text-fisch-yellow",
  Verein: "bg-fisch-white text-fisch-black border border-fisch-black",
};

export default function NewsCard({ artikel }: { artikel: NewsFrontmatter }) {
  return (
    <Link
      href={`/aktuelles/${artikel.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-fisch-line bg-white transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-fisch-black">
        {artikel.teaserbild && (
          <Image
            src={artikel.teaserbild}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${
            kategorieStyles[artikel.kategorie] ?? kategorieStyles.Verein
          }`}
        >
          {artikel.kategorie}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <time
          dateTime={artikel.date}
          className="text-xs font-semibold uppercase tracking-wide text-fisch-muted"
        >
          {formatDatum(artikel.date)}
        </time>
        <h3 className="font-display text-lg font-bold leading-snug text-fisch-black group-hover:underline decoration-fisch-yellow decoration-2 underline-offset-4">
          {artikel.title}
        </h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-fisch-muted">
          {artikel.teaser}
        </p>
      </div>
    </Link>
  );
}
