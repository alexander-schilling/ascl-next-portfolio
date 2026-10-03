"use client";

import { Menu, X, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { ModalDialog } from "@/components/ui/modal-dialog";
import type { NavLink } from "@/types/portfolio";

export function MobileNavigation({ links, lang }: { links: NavLink[]; lang: "en" | "es" }) {
  const [open, setOpen] = useState(false);
  const label = lang === "es" ? "Navegación" : "Navigation";

  useEffect(() => {
    const breakpoint = window.matchMedia("(min-width: 1024px)");
    const onChange = () => { if (breakpoint.matches) setOpen(false); };
    breakpoint.addEventListener("change", onChange);
    return () => breakpoint.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <button type="button" className="icon-button lg:hidden" aria-label={lang === "es" ? "Abrir menú" : "Open menu"}
        aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>
        <Menu size={22} aria-hidden />
      </button>
      {open && (
        <ModalDialog label={label} lang={lang} onClose={() => setOpen(false)}
          className="mobile-menu fixed inset-auto top-3 right-3 m-0 ml-auto w-[min(24rem,calc(100%_-_1.5rem))] max-w-none rounded-2xl border border-outline-variant bg-surface-container p-5 text-on-surface shadow-xl">
          <div className="flex items-center justify-between gap-4 border-b border-outline-variant/50 pb-4">
            <span className="text-sm font-semibold text-primary">{label}</span>
            <button type="button" className="icon-button" aria-label={lang === "es" ? "Cerrar menú" : "Close menu"} onClick={() => setOpen(false)}>
              <X size={22} aria-hidden />
            </button>
          </div>
          <nav aria-label={label} className="flex flex-col pt-3">
            {links.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)}
                className="flex min-h-14 items-center justify-between gap-4 rounded-lg px-3 text-lg transition-colors hover:bg-surface-container-high">
                {link.label}<ArrowUpRight size={18} className="text-primary" aria-hidden />
              </a>
            ))}
          </nav>
        </ModalDialog>
      )}
    </>
  );
}
