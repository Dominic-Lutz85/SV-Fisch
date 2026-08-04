"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/lib/config";

const stats = [
  { label: "Gegründet", value: `${siteConfig.numbers.founded}` },
  { label: "Mitglieder", value: `${siteConfig.numbers.members}+` },
  { label: "Abteilungen", value: `${siteConfig.numbers.departments}` },
  { label: "Mannschaften", value: `${siteConfig.numbers.teams}` },
];

export default function StatsRow() {
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
          className="rounded-2xl border border-fisch-line bg-white p-6 text-center"
        >
          <p className="font-display text-3xl font-extrabold text-fisch-black sm:text-4xl">
            {stat.value}
          </p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-fisch-muted">
            {stat.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
