import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({ icon: Icon, title, text, action }: { icon: LucideIcon; title: string; text: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
      <span className="grid size-16 place-items-center rounded-full bg-sage-soft text-sage-deep">
        <Icon className="size-7" aria-hidden />
      </span>
      <h2 className="mt-4 text-xl font-extrabold">{title}</h2>
      <p className="mt-1 max-w-sm text-muted-foreground">{text}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
