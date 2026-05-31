import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic =
    PUBLIC_PATHS.includes(pathname) || pathname.startsWith("/join/");

  if (isPublic) return NextResponse.next();

  const session = request.cookies.get("prode_session");

  const protectedPaths = [
    "/dashboard",
    "/ligas",
    "/perfil",
    "/pronosticos",
    "/historial",
  ];

  const needsAuth = protectedPaths.some((p) => pathname.startsWith(p));

  if (needsAuth && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    try {
      const userData = JSON.parse(decodeURIComponent(session.value));
      if (userData.rol !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json).*)",
  ],
};
