import type { ReactNode } from "react";

type CtaLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  target?: "_blank" | "_self";
  rel?: string;
  size?: "sm" | "md";
};

const variantClasses: Record<NonNullable<CtaLinkProps["variant"]>, string> = {
  primary:
    "bg-primary text-on-primary hover:bg-primary-fixed",
  secondary: "border border-outline-variant bg-surface-container-high text-primary hover:bg-surface-bright",
  ghost: "bg-on-background text-background hover:opacity-90",
};

export function CtaLink({
  href,
  children,
  variant = "primary",
  className = "",
  target,
  rel,
  size = "md",
}: CtaLinkProps) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={[
        "inline-flex min-h-11 items-center justify-center rounded-lg font-bold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        size === "sm" ? "px-3 py-2 text-xs" : "px-6 py-3 text-sm",
        variantClasses[variant],
        className,
      ].join(" ")}
    >
      {children}
    </a>
  );
}

