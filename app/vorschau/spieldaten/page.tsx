import { notFound } from "next/navigation";
import type { Metadata } from "next";

import Umschalter from "./Umschalter";

/*
 * Erkundung "Woher kommen die Spieldaten", 09.09.2026.
 *
 * Beide Waechter (pruefe-sitemap, pruefe-verlinkung) sind VOR dem ersten
 * Build ergaenzt worden. Das ist die Lehre vom 08.09., als zwei nicht
 * eingetragene Erkundungsseiten den Build acht Commits lang lahmgelegt haben.
 */

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function VorschauSpieldaten() {
  if (process.env.NODE_ENV === "production") notFound();
  return <Umschalter />;
}
