"use client";

import { useEffect, useRef } from "react";

/** Content remains visible without JS; animate only content below the viewport. */
export function useReveal<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (element.getBoundingClientRect().top < window.innerHeight) return;

    element.classList.add("is-pending");
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      element.classList.remove("is-pending");
      element.classList.add("is-visible");
      observer.disconnect();
    }, { rootMargin: "0px 0px -32px 0px", threshold: 0 });
    observer.observe(element);
    return () => { observer.disconnect(); element.classList.remove("is-pending"); };
  }, []);

  return ref;
}
