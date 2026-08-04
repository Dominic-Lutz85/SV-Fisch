"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { mainNav } from "@/lib/navigation";
import { siteConfig } from "@/lib/config";
import SocialIcons from "@/components/SocialIcons";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSubOpen, setMobileSubOpen] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Menüs beim Routenwechsel schließen: bewusst während des Renderns
  // angepasst (nicht in einem Effect), siehe React-Doku "Adjusting state
  // when a prop changes".
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMobileOpen(false);
    setOpenDropdown(null);
  }

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function openNow(label: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(label);
  }

  function closeSoon() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 150);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-fisch-line bg-fisch-white/95 backdrop-blur supports-[backdrop-filter]:bg-fisch-white/80">
      <div className="container-fisch flex h-20 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-3 shrink-0"
          aria-label={`${siteConfig.name} – Startseite`}
        >
          <Image
            src="/logo.svg"
            alt=""
            width={52}
            height={52}
            priority
            className="h-12 w-12 sm:h-14 sm:w-14"
          />
          <span className="hidden flex-col leading-none sm:flex">
            <span className="font-display text-lg font-bold tracking-tight text-fisch-black">
              {siteConfig.shortName}
            </span>
            <span className="text-xs font-medium text-fisch-muted">
              gegr. {siteConfig.founded}
            </span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Hauptnavigation"
        >
          {mainNav.map((item) => {
            const isActive =
              item.href === pathname ||
              item.children?.some((c) => c.href === pathname);
            if (!item.children) {
              return (
                <Link
                  key={item.label}
                  href={item.href!}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-semibold transition-colors hover:bg-fisch-black hover:text-fisch-white",
                    isActive ? "text-fisch-black underline decoration-fisch-yellow decoration-4 underline-offset-8" : "text-fisch-ink"
                  )}
                >
                  {item.label}
                </Link>
              );
            }
            const open = openDropdown === item.label;
            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => openNow(item.label)}
                onMouseLeave={closeSoon}
              >
                <button
                  type="button"
                  className={cn(
                    "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors hover:bg-fisch-black hover:text-fisch-white",
                    isActive || open ? "text-fisch-black" : "text-fisch-ink"
                  )}
                  aria-expanded={open}
                  aria-haspopup="true"
                  onClick={() => setOpenDropdown(open ? null : item.label)}
                >
                  {item.label}
                  <ChevronDown
                    className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
                    aria-hidden="true"
                  />
                </button>
                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full min-w-56 overflow-hidden rounded-lg border border-fisch-line bg-fisch-white py-2 shadow-xl"
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "block px-4 py-2.5 text-sm font-medium text-fisch-ink transition-colors hover:bg-fisch-yellow hover:text-fisch-black",
                            pathname === child.href && "bg-fisch-yellow/60"
                          )}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <SocialIcons className="text-fisch-black" />
          <a
            href={siteConfig.fanshopUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-fisch-yellow px-5 py-2.5 text-sm font-bold text-fisch-black transition-colors hover:bg-fisch-yellow-dark"
          >
            Fanshop
          </a>
        </div>

        <button
          type="button"
          className="flex items-center justify-center rounded-md p-2 text-fisch-black lg:hidden"
          aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-fisch-line bg-fisch-white lg:hidden"
          >
            <nav
              className="container-fisch flex flex-col gap-1 py-4"
              aria-label="Mobile Hauptnavigation"
            >
              {mainNav.map((item) => {
                if (!item.children) {
                  return (
                    <Link
                      key={item.label}
                      href={item.href!}
                      className="rounded-md px-3 py-3 text-base font-semibold text-fisch-ink hover:bg-fisch-yellow/40"
                    >
                      {item.label}
                    </Link>
                  );
                }
                const subOpen = mobileSubOpen === item.label;
                return (
                  <div key={item.label}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-md px-3 py-3 text-base font-semibold text-fisch-ink hover:bg-fisch-yellow/40"
                      aria-expanded={subOpen}
                      onClick={() =>
                        setMobileSubOpen(subOpen ? null : item.label)
                      }
                    >
                      {item.label}
                      <ChevronDown
                        className={cn("h-5 w-5 transition-transform", subOpen && "rotate-180")}
                        aria-hidden="true"
                      />
                    </button>
                    <AnimatePresence>
                      {subOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex flex-col overflow-hidden pl-4"
                        >
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="rounded-md px-3 py-2.5 text-sm font-medium text-fisch-muted hover:bg-fisch-yellow/40 hover:text-fisch-black"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
              <a
                href={siteConfig.fanshopUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 rounded-full bg-fisch-yellow px-5 py-3 text-center text-sm font-bold text-fisch-black"
              >
                Fanshop
              </a>
              <SocialIcons className="mt-4 justify-center text-fisch-black" />
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
