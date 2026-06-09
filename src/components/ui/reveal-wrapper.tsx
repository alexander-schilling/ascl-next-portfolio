"use client";

import type { ReactNode } from "react";
import { useReveal } from "@/hooks/use-reveal";

type RevealWrapperProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function RevealWrapper({ children, className = "", delay = 0 }: RevealWrapperProps) {
  const ref = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={["reveal", className].join(" ")}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
