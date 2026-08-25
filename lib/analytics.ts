export function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window === "undefined") return;

  const w = window as Window & {
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, options?: { props?: Record<string, unknown> }) => void;
  };

  w.gtag?.("event", name, params);
  w.plausible?.(name, params ? { props: params } : undefined);

  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", name, params);
  }
}
