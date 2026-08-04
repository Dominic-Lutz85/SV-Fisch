"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { formatDatumLang, formatUhrzeit } from "@/lib/utils";
import type { Termin } from "@/types/content";

export default function Hero({ naechsterTermin }: { naechsterTermin?: Termin }) {
  return (
    <section className="relative overflow-hidden bg-fisch-black text-fisch-white">
      <Image
        src="/hero/home-hero.png"
        alt=""
        fill
        priority
        className="object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-fisch-black via-fisch-black/70 to-fisch-black/30" />

      <Image
        src="/logo.svg"
        alt=""
        width={640}
        height={640}
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] opacity-[0.08] sm:h-[560px] sm:w-[560px]"
      />

      <div className="container-fisch relative flex min-h-[78vh] flex-col justify-end gap-8 py-16 sm:min-h-[85vh] sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-4"
        >
          <Image
            src="/logo.svg"
            alt={`Wappen ${siteConfig.name}`}
            width={88}
            height={88}
            priority
            className="h-16 w-16 sm:h-20 sm:w-20"
          />
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-fisch-yellow">
              Gegründet {siteConfig.founded}
            </p>
            <h1 className="font-display text-3xl font-extrabold leading-tight sm:text-5xl">
              {siteConfig.name}
            </h1>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="max-w-xl text-lg text-fisch-white/85 sm:text-xl"
        >
          {siteConfig.claim} Fußball und Gymnastik, Bambini bis erste
          Mannschaft — mitten im Ort, seit {siteConfig.founded}.
        </motion.p>

        {naechsterTermin && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col gap-3 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-fisch-yellow" aria-hidden="true" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-fisch-yellow">
                  Aktuelle Meldung
                </p>
                <p className="font-semibold">{naechsterTermin.titel}</p>
                <p className="text-sm text-fisch-white/70">
                  {formatDatumLang(naechsterTermin.datum)}
                  {naechsterTermin.uhrzeit ? `, ${formatUhrzeit(naechsterTermin.datum)} Uhr` : ""}
                  {naechsterTermin.ort ? ` · ${naechsterTermin.ort}` : ""}
                </p>
              </div>
            </div>
            <Link
              href="/kalender"
              className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full bg-fisch-yellow px-4 py-2 text-sm font-bold text-fisch-black hover:bg-fisch-yellow-dark sm:self-auto"
            >
              Alle Termine <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
