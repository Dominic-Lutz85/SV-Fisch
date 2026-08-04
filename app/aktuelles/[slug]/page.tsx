import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft } from "lucide-react";
import { getAllNews, getNewsBySlug } from "@/lib/content";
import { formatDatumLang } from "@/lib/utils";

export function generateStaticParams() {
  return getAllNews().map((artikel) => ({ slug: artikel.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const artikel = getNewsBySlug(slug);
  if (!artikel) return {};
  return {
    title: artikel.title,
    description: artikel.teaser,
    openGraph: artikel.teaserbild
      ? { images: [{ url: artikel.teaserbild }] }
      : undefined,
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artikel = getNewsBySlug(slug);
  if (!artikel) notFound();

  return (
    <article>
      <div className="relative aspect-[21/9] w-full overflow-hidden bg-fisch-black">
        {artikel.teaserbild && (
          <Image
            src={artikel.teaserbild}
            alt=""
            fill
            priority
            className="object-cover opacity-80"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-fisch-black via-fisch-black/40 to-transparent" />
        <div className="container-fisch absolute inset-x-0 bottom-0 pb-10 text-fisch-white">
          <span className="rounded-full bg-fisch-yellow px-3 py-1 text-xs font-bold text-fisch-black">
            {artikel.kategorie}
          </span>
          <h1 className="mt-4 max-w-3xl font-display text-3xl font-extrabold sm:text-4xl">
            {artikel.title}
          </h1>
          <time dateTime={artikel.date} className="mt-2 block text-sm text-fisch-white/70">
            {formatDatumLang(artikel.date)}
          </time>
        </div>
      </div>

      <div className="container-fisch max-w-2xl py-14 sm:py-20">
        <Link
          href="/aktuelles"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-fisch-muted hover:text-fisch-black"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Zurück zu allen Neuigkeiten
        </Link>
        <div className="flex flex-col gap-4 text-fisch-ink [&_h2]:mt-6 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5 [&_a]:underline [&_a]:decoration-fisch-yellow-dark [&_strong]:font-semibold [&_li]:leading-relaxed [&_p]:leading-relaxed">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{artikel.content}</ReactMarkdown>
        </div>
      </div>
    </article>
  );
}
