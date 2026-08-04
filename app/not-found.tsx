import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-fisch flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <Image src="/logo.svg" alt="" width={96} height={96} className="h-20 w-20 opacity-80" />
      <p className="mt-6 font-display text-6xl font-extrabold text-fisch-black">404</p>
      <h1 className="mt-2 font-display text-2xl font-bold text-fisch-black">
        Abseits – diese Seite gibt&apos;s nicht
      </h1>
      <p className="mt-3 max-w-md text-fisch-muted">
        Die aufgerufene Seite wurde nicht gefunden. Vielleicht wurde sie
        verschoben oder der Link ist veraltet.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-fisch-yellow px-6 py-3 text-sm font-bold text-fisch-black hover:bg-fisch-yellow-dark"
      >
        Zurück zur Startseite
      </Link>
    </div>
  );
}
