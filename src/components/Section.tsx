import { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionProps {
  id: string;
  label: string;
  title: string;
  sub: string;
  children: ReactNode;
  className?: string;
}

export function Section({
  id,
  label,
  title,
  sub,
  children,
  className,
}: SectionProps) {
  return (
    <section id={id} className={cn("py-24 border-t border-line", className)}>
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-muted">
          {label}
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-fg">
          {title}
        </h2>
        <p className="mt-2 text-muted max-w-2xl text-base leading-relaxed">
          {sub}
        </p>
      </div>
      <div className="mt-12">{children}</div>
    </section>
  );
}

