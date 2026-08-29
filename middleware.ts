import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_OS_PATHS = ["/os/login", "/api/os/auth/login", "/api/os/auth/logout"];
const PUBLIC_PORTAL_PATHS = ["/portal/login", "/api/portal/auth/login"];
const PUBLIC_CRON = "/api/os/cron";
const PUBLIC_WEBHOOKS = ["/api/webhooks/cullinos", "/api/webhooks/razorpay"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("rkyves_session");

  // Webhook endpoints — public (validated in route handlers)
  if (PUBLIC_WEBHOOKS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Cron endpoint — allow with bearer token (validated in route handler)
  if (pathname === PUBLIC_CRON) {
    return NextResponse.next();
  }

  // OS routes
  if (pathname.startsWith("/os") || pathname.startsWith("/api/os")) {
    const isPublic = PUBLIC_OS_PATHS.some((p) => pathname.startsWith(p));

    if (!isPublic && !session) {
      if (pathname.startsWith("/api/os")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const loginUrl = new URL("/os/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (pathname === "/os/login" && session) {
      return NextResponse.redirect(new URL("/os/dashboard", request.url));
    }
  }

  // Portal routes
  if (pathname.startsWith("/portal") || pathname.startsWith("/api/portal")) {
    const isPublic = PUBLIC_PORTAL_PATHS.some((p) => pathname.startsWith(p));

    if (!isPublic && !session) {
      if (pathname.startsWith("/api/portal")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/portal/login", request.url));
    }

    if (pathname === "/portal/login" && session) {
      return NextResponse.redirect(new URL("/portal", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/os/:path*", "/api/os/:path*", "/portal/:path*", "/api/portal/:path*", "/api/webhooks/:path*"],
};
