"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type SearchResult = {
  id: string;
  title: string;
  subtitle: string;
  type: string;
};

const typeRoutes: Record<string, (id: string) => string> = {
  client: (id) => `/os/clients/${id}`,
  invoice: (id) => `/os/invoices`,
  project: (id) => `/os/projects`,
  ticket: (id) => `/os/tickets`,
};

export function GlobalSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/os/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, search]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSelect(result: SearchResult) {
    const route = typeRoutes[result.type]?.(result.id);
    if (route) {
      router.push(route);
      setOpen(false);
      setQuery("");
    }
  }

  return (
    <div ref={ref} className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <input
        type="search"
        placeholder="Search clients, invoices, projects..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        className="h-10 w-full rounded-lg border border-border bg-surface pl-10 pr-4 text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
      />

      {open && query.length >= 2 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-border bg-surface-elevated shadow-xl">
          {loading ? (
            <div className="flex items-center justify-center gap-2 p-4 text-sm text-muted">
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching...
            </div>
          ) : results.length === 0 ? (
            <p className="p-4 text-sm text-muted">No results for &ldquo;{query}&rdquo;</p>
          ) : (
            <ul>
              {results.map((r) => (
                <li key={`${r.type}-${r.id}`}>
                  <button
                    onClick={() => handleSelect(r)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-white/5"
                  >
                    <span className="rounded bg-primary/15 px-2 py-0.5 text-xs capitalize text-primary">
                      {r.type}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{r.title}</p>
                      <p className="truncate text-xs text-muted">{r.subtitle}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
