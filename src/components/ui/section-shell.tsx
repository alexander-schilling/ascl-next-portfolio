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
    <section id={id} className={["py-32", className].join(" ")}>
      <div className={["mx-auto w-full max-w-7xl px-8", containerClassName].join(" ")}>{children}</div>
    </section>
  );
}

