"use client";

import { useEffect, useMemo, useState } from "react";

import type { NavLink } from "@/types/portfolio";

type ScrollSpyNavLinksProps = {
  links: NavLink[];
};

const HEADER_OFFSET_PX = 120;

function isHashLink(href: string) {
  return href.startsWith("#") && href.length > 1;
}

export function ScrollSpyNavLinks({ links }: ScrollSpyNavLinksProps) {
  const hashLinks = useMemo(() => links.filter((link) => isHashLink(link.href)), [links]);
  const [activeHref, setActiveHref] = useState<string>(hashLinks[0]?.href ?? "");

  useEffect(() => {
    if (hashLinks.length === 0) {
      return;
    }

    const updateActiveFromScroll = () => {
      let nextActiveHref = hashLinks[0].href;

      for (const link of hashLinks) {
        const section = document.querySelector(link.href);

        if (!section) {
          continue;
        }

        const top = section.getBoundingClientRect().top;

        if (top - HEADER_OFFSET_PX <= 0) {
          nextActiveHref = link.href;
        }
      }

      setActiveHref((current) => (current === nextActiveHref ? current : nextActiveHref));
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(() => {
        updateActiveFromScroll();
        ticking = false;
      });
    };

    updateActiveFromScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [hashLinks]);

  return (
    <>
      {links.map((link) => {
        const isActive = link.href === activeHref;

        return (
          <a
            key={`${link.href}-${link.label}`}
            className={
              isActive
                ? "border-b-2 border-indigo-400 pb-1 text-indigo-400"
                : "text-slate-400 transition-colors hover:text-slate-100"
            }
            href={link.href}
            aria-current={isActive ? "page" : undefined}
          >
            {link.label}
          </a>
        );
      })}
    </>
  );
}

