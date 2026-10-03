import type { ReactNode } from "react";

type SectionShellProps = {
  id?: string;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
};

export function SectionShell({
  id,
  className = "",
  containerClassName = "",
  children,
}: SectionShellProps) {
  return (
    <section id={id} className={["py-20 sm:py-24 lg:py-32", className].join(" ")}>
      <div className={["mx-auto w-full max-w-7xl px-5 sm:px-8", containerClassName].join(" ")}>{children}</div>
    </section>
  );
}

