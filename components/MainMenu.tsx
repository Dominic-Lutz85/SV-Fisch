"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import gsap from "gsap";

import { mainNav, footerLinks } from "@/lib/navigation";
import { siteConfig } from "@/lib/config";
import SocialIcons from "@/components/SocialIcons";
import { useImBrowser } from "@/lib/useImBrowser";

/*
 * Vollflächiges Hauptmenü.
 *
 * Es ersetzt die frühere Menüleiste vollständig: in der Kopfleiste stehen nur
 * noch Wappen, Fanshop und dieser Knopf. Bewusste Entscheidung des
 * Auftraggebers. Der Preis ist Auffindbarkeit, ein Vereinsmitglied braucht zum
 * Spielplan jetzt zwei Klicks statt einem. Die alte Leiste steht in der
 * Versionsgeschichte vor dem 02.09.2026.
 *
 * Nach dem Vorbild einer Agentur-Navigation, aber nicht davon abgeschrieben.
 * Übernommen wurde die Bewegung: mehrere Flächen fahren zeitversetzt von rechts
 * herein, danach kippen die Links von unten ins Bild. Nicht übernommen wurden:
 *
 * - Die dekorativen Formen (Kreise, Wellen, Punkteraster in Indigo und Pink).
 *   Ein Hintergrund, der auf jeder beliebigen Seite genauso liegen könnte, macht
 *   die Seite austauschbar. Hier steht stattdessen das Wappen.
 * - Der Auslöser als div mit onClick, mit der Tastatur nicht erreichbar. Hier
 *   ist es ein button mit aria-expanded und aria-controls, der Fokus wird
 *   eingefangen, Escape schließt, und beim Schließen springt der Fokus zurück.
 *
 * ZWEI FALLEN, die beim Bauen zugeschlagen haben und die man nicht sieht:
 *
 * 1. Sichtbarkeit gehört React, Bewegung gehört GSAP. Im ersten Versuch setzte
 *    GSAP display auf block, während im JSX display:none stand. React schreibt
 *    das bei jedem Rendern zurück: der Zustand kippte korrekt, zu sehen war
 *    nichts. Deshalb gibt es zwei Zustände, "offen" ist die Absicht und
 *    "sichtbar" ist, ob die Fläche hängt, damit sie das Schließen überlebt.
 *
 * 2. Das Menü hängt per Portal am body und nicht in der Kopfleiste. Die
 *    Kopfleiste hat backdrop-blur, und ein Element mit Hintergrundfilter wird
 *    zum Bezugsrahmen für position:fixed. Das Menü klebte dadurch in einem
 *    80 Pixel hohen Streifen am oberen Rand statt über der ganzen Seite. Wer
 *    das Portal entfernt, bekommt genau diesen Streifen zurück.
 */

const WENIGER_BEWEGUNG = "(prefers-reduced-motion: reduce)";

export default function MainMenu() {
  const pathname = usePathname();
  const [offen, setOffen] = useState(false);
  const [sichtbar, setSichtbar] = useState(false);

  const menueId = useId();
  const knopf = useRef<HTMLButtonElement>(null);
  const huelle = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDivElement>(null);

  // Portale brauchen document, also erst im Browser einhängen.
  const imBrowser = useImBrowser();

  // Beim Seitenwechsel schließen, ohne Effect (React-Muster "Adjusting state
  // when a prop changes").
  const [letzterPfad, setLetzterPfad] = useState(pathname);
  if (pathname !== letzterPfad) {
    setLetzterPfad(pathname);
    setOffen(false);
  }

  // Sichtbar werden muss vor der Animation passieren, sonst misst GSAP eine
  // Fläche ohne Ausdehnung.
  if (offen && !sichtbar) setSichtbar(true);

  const schliessen = useCallback(() => setOffen(false), []);

  /* Bewegung ------------------------------------------------------------- */
  useEffect(() => {
    if (!huelle.current) return;

    const ruhig = window.matchMedia(WENIGER_BEWEGUNG).matches;

    const ctx = gsap.context(() => {
      const schleier = huelle.current!.querySelector(".menue-schleier");
      const flaechen = huelle.current!.querySelectorAll(".menue-flaeche");
      const links = huelle.current!.querySelectorAll(".menue-link-innen");
      const nebensachen = huelle.current!.querySelectorAll("[data-menue-fade]");

      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut", duration: ruhig ? 0 : 0.7 },
      });

      if (offen) {
        tl.fromTo(
          schleier,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: ruhig ? 0 : 0.4 }
        )
          .fromTo(
            flaechen,
            { xPercent: 101 },
            { xPercent: 0, stagger: ruhig ? 0 : 0.1, duration: ruhig ? 0 : 0.6 },
            "<"
          )
          .fromTo(
            links,
            { yPercent: 140, rotate: 8 },
            {
              yPercent: 0,
              rotate: 0,
              stagger: ruhig ? 0 : 0.04,
              duration: ruhig ? 0 : 0.6,
            },
            ruhig ? "<" : "<+=0.3"
          )
          .fromTo(
            nebensachen,
            { autoAlpha: 0, yPercent: 40 },
            {
              autoAlpha: 1,
              yPercent: 0,
              stagger: ruhig ? 0 : 0.05,
              duration: ruhig ? 0 : 0.4,
              clearProps: "transform",
            },
            ruhig ? "<" : "<+=0.15"
          );
      } else if (sichtbar) {
        tl.to(schleier, { autoAlpha: 0, duration: ruhig ? 0 : 0.35 })
          .to(
            flaechen,
            {
              xPercent: 101,
              stagger: ruhig ? 0 : 0.06,
              duration: ruhig ? 0 : 0.45,
            },
            "<"
          )
          .call(() => setSichtbar(false));
      }
    }, huelle);

    return () => ctx.revert();
  }, [offen, sichtbar]);

  /* Rollbalken sperren ---------------------------------------------------- */
  useEffect(() => {
    if (!sichtbar) return;
    const vorher = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = vorher;
    };
  }, [sichtbar]);

  /* Tastatur -------------------------------------------------------------- */
  useEffect(() => {
    if (!offen) return;

    const knopfJetzt = knopf.current;
    dialog.current
      ?.querySelector<HTMLElement>("a[href], button:not([disabled])")
      ?.focus();

    function beiTaste(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        setOffen(false);
        return;
      }
      if (e.key !== "Tab" || !dialog.current) return;

      const ziele = Array.from(
        dialog.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.offsetParent !== null);
      if (ziele.length === 0) return;

      const erst = ziele[0];
      const letzt = ziele[ziele.length - 1];
      if (e.shiftKey && document.activeElement === erst) {
        e.preventDefault();
        letzt.focus();
      } else if (!e.shiftKey && document.activeElement === letzt) {
        e.preventDefault();
        erst.focus();
      }
    }

    window.addEventListener("keydown", beiTaste);
    return () => {
      window.removeEventListener("keydown", beiTaste);
      knopfJetzt?.focus();
    };
  }, [offen]);

  const ueberlagerung = (
    <div
      ref={huelle}
      className="fixed inset-0 z-[100]"
      style={{ display: sichtbar ? "block" : "none" }}
    >
      <div
        className="menue-schleier absolute inset-0 bg-fisch-black/60"
        onClick={schliessen}
        aria-hidden="true"
      />

      <div
        ref={dialog}
        id={menueId}
        role="dialog"
        aria-modal="true"
        aria-label="Hauptmenü"
        className="absolute inset-y-0 right-0 w-full max-w-3xl overflow-y-auto overflow-x-hidden"
      >
        {/* Drei Flächen, zeitversetzt. Die ersten beiden sind reine Bewegung,
            die dritte trägt den Inhalt. */}
        <div className="menue-flaeche absolute inset-0 bg-fisch-yellow" />
        <div className="menue-flaeche absolute inset-0 bg-fisch-black/70" />
        <div className="menue-flaeche absolute inset-0 bg-fisch-black" />

        {/*
          Hier lag zuerst ein großes Wappen als Hintergrundmotiv, wie im
          Vorbild die abstrakten Formen. Nachgemessen lagen dann 16 der 17
          Links darüber, "Darts" und "Gymnastik" waren kaum noch zu lesen.

          Ein Motiv halbdurchsichtig zu dämpfen wäre die schlechteste Lösung
          gewesen: kaum sichtbar und trotzdem im Weg. Bei zwei Spalten Links
          gibt es in dieser Fläche keinen freien Bereich für ein großes Motiv,
          also steht das Wappen jetzt klein und scharf unten im Fuß.
        */}

        <div className="relative flex min-h-full flex-col gap-10 px-6 pb-10 pt-24 sm:px-12 sm:pt-28">
          <button
            type="button"
            onClick={schliessen}
            className="absolute right-6 top-7 rounded-full border border-linie px-4 py-2 text-sm font-bold uppercase tracking-wider text-text transition-colors hover:bg-fisch-yellow hover:text-fisch-black sm:right-12"
          >
            Schließen
          </button>

          <nav aria-label="Hauptnavigation">
            <ul className="grid gap-x-12 gap-y-8 sm:grid-cols-2">
              {mainNav.map((eintrag) => (
                <li key={eintrag.label}>
                  {eintrag.href ? (
                    <span className="block overflow-hidden py-1">
                      <Link
                        href={eintrag.href}
                        className="menue-link-innen group/link relative inline-block font-display text-3xl font-extrabold text-text sm:text-4xl"
                      >
                        <span
                          aria-hidden="true"
                          className="absolute -inset-x-2 -inset-y-1 origin-left scale-x-0 bg-fisch-yellow transition-transform duration-300 ease-out group-hover/link:scale-x-100"
                        />
                        <span className="relative transition-colors duration-300 group-hover/link:text-text">
                          {eintrag.label}
                        </span>
                      </Link>
                    </span>
                  ) : (
                    <>
                      <span className="block overflow-hidden py-1">
                        <span className="menue-link-innen block font-display text-3xl font-extrabold text-fisch-yellow sm:text-4xl">
                          {eintrag.label}
                        </span>
                      </span>
                      <ul className="mt-3 flex flex-col gap-1.5">
                        {eintrag.children!.map((kind) => (
                          <li key={kind.href} data-menue-fade>
                            <Link
                              href={kind.href}
                              className="inline-block py-0.5 text-base font-semibold text-text-leise underline-offset-4 transition-colors hover:text-fisch-yellow hover:underline"
                            >
                              {kind.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div
            data-menue-fade
            className="mt-auto flex flex-col gap-5 border-t border-linie pt-6"
          >
            <div className="flex items-center gap-4">
              <Image
                src="/logo.svg"
                alt=""
                width={56}
                height={56}
                aria-hidden="true"
                className="h-12 w-12"
              />
              <SocialIcons className="text-text" />
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-text-leise">
              {footerLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="hover:text-fisch-yellow"
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <p className="text-sm text-text-leise">
              {siteConfig.contact.addressLines.join(" · ")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        ref={knopf}
        type="button"
        onClick={() => setOffen((o) => !o)}
        aria-expanded={offen}
        aria-controls={menueId}
        /*
          Der Name muss immer da sein, auch wenn das Wort "Menü" ausgeblendet
          ist. Auf schmalen Bildschirmen steht nur das Symbol, und das ist
          aria-hidden: der Knopf hatte damit für Vorleseprogramme gar keinen
          Namen. Lighthouse misst mobil und hat die Barrierefreiheit deswegen
          von 100 auf 95 gezogen.
        */
        aria-label={offen ? "Menü schließen" : "Menü öffnen"}
        /* Schwarz: der Knopf sitzt auf der gelben Kopfleiste. */
        className="flex items-center gap-2.5 px-1 py-2 text-sm font-bold uppercase tracking-wider text-fisch-black"
      >
        <span aria-hidden="true" className="hidden sm:inline">
          Menü
        </span>
        <span
          aria-hidden="true"
          className={`grid h-9 w-9 place-items-center rounded-full bg-fisch-black text-fisch-yellow transition-transform duration-500 ${
            offen ? "rotate-[315deg]" : ""
          }`}
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor">
            <path d="M7.33 16V0h1.34v16z" />
            <path d="M16 8.67H0V7.33h16z" />
          </svg>
        </span>
      </button>

      {imBrowser ? createPortal(ueberlagerung, document.body) : null}
    </>
  );
}
