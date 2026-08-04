import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Gallery from "@/components/Gallery";
import { getGalerie } from "@/lib/content";

export const metadata: Metadata = {
  title: "Galerie",
  description: "Bilder aus dem Vereinsleben des SV Fisch 1964 e.V.",
};

export default function GaleriePage() {
  const alben = getGalerie();

  return (
    <>
      <PageHeader
        eyebrow="Impressionen"
        title="Galerie"
        description="Momente aus Spielen, Trainings und Vereinsfesten."
      />
      <div className="container-fisch py-16 sm:py-20">
        <Gallery alben={alben} />
      </div>
    </>
  );
}
