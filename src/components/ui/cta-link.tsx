import type { ReactNode } from "react";

type CtaLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  target?: "_blank" | "_self";
  rel?: string;
};

const variantClasses: Record<NonNullable<CtaLinkProps["variant"]>, string> = {
  primary:
    "bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-[0_20px_50px_rgba(192,193,255,0.18)] hover:brightness-105",
  secondary: "bg-surface-container-highest text-secondary hover:bg-surface-bright",
  ghost: "bg-on-background text-background hover:opacity-90",
};

export function CtaLink({
  href,
  children,
  variant = "primary",
  className = "",
  target,
  rel,
}: CtaLinkProps) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={[
        "inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        variantClasses[variant],
        className,
      ].join(" ")}
    >
      {children}
    </a>
  );
}

