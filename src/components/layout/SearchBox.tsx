import { Search } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

import { cn } from "@/lib/utils";

export function SearchBox({ className, autoFocus, onDone, id = "site-search" }: { className?: string; autoFocus?: boolean; onDone?: () => void; id?: string }) {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    void navigate({ to: "/search", search: { q: q.trim() } });
    onDone?.();
  };
  return (
    <form role="search" onSubmit={onSubmit} className={cn("relative", className)}>
      <label htmlFor={id} className="sr-only">Search products</label>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
      <input
        id={id}
        type="search"
        value={q}
        autoFocus={autoFocus}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search frocks, kurtas, rompers…"
        className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary-hover focus:ring-2 focus:ring-primary/40"
      />
    </form>
  );
}
