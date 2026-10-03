"use client";

import { useEffect, useState } from "react";
import type { NavLink } from "@/types/portfolio";

export function ScrollSpyNavLinks({ links }: { links: NavLink[] }) {
  const [activeHref, setActiveHref] = useState("");

  useEffect(() => {
    const sections = links.filter((link) => link.href.startsWith("#") && link.href.length > 1)
      .map((link) => ({ href: link.href, element: document.getElementById(link.href.slice(1)) }))
      .filter((section): section is { href: string; element: HTMLElement } => !!section.element);
    if (!sections.length || !("IntersectionObserver" in window)) return;

    const update = () => {
      // Only measure when a section crosses the header, never on every scroll frame.
      // Leave a little tolerance for fractional scroll positions at hash targets.
      const reached = sections.filter(({ element }) => element.getBoundingClientRect().top <= 128);
      setActiveHref(reached.at(-1)?.href ?? "");
    };
    let observer: IntersectionObserver;
    const observe = () => {
      observer?.disconnect();
      // A narrow band immediately below the fixed header changes intersection
      // when each section starts, including sections taller than the viewport.
      observer = new IntersectionObserver(update, { rootMargin: `-96px 0px ${112 - window.innerHeight}px 0px`, threshold: 0 });
      sections.forEach(({ element }) => observer.observe(element));
      update();
    };
    observe();
    window.addEventListener("resize", observe);
    window.addEventListener("hashchange", update);
    return () => { observer.disconnect(); window.removeEventListener("resize", observe); window.removeEventListener("hashchange", update); };
  }, [links]);

  return links.map((link) => (
    <a key={`${link.href}-${link.label}`} href={link.href}
      className={`inline-flex min-h-11 items-center border-b-2 transition-colors ${link.href === activeHref ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-on-surface"}`}
      aria-current={link.href === activeHref ? "location" : undefined}>
      {link.label}
    </a>
  ));
}
