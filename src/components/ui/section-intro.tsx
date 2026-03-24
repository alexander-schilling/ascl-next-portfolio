import type { ReactNode } from "react";

type SectionIntroProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function SectionIntro({
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
}: SectionIntroProps) {
  const alignment = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <div className={["flex flex-col gap-4", alignment, className].join(" ")}>
      {eyebrow ? (
        <span className="text-xs uppercase tracking-[0.3em] text-secondary">{eyebrow}</span>
      ) : null}
      <div className="space-y-4">
        <div className="font-headline text-4xl font-bold leading-tight text-on-surface md:text-5xl">{title}</div>
        {description ? <div className="max-w-2xl text-lg leading-relaxed text-on-surface-variant">{description}</div> : null}
      </div>
    </div>
  );
}

