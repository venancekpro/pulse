import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/constants";

function isPublicPath(pathname: string): boolean {
  return pathname === "/login" || pathname === "/api/auth/login";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.match(/\.(?:ico|png|jpg|jpeg|svg|webp|gif)$/)
  ) {
    return NextResponse.next();
  }

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const secret = process.env.JWT_SECRET;

  const fail = () => {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  };

  if (!token || !secret || secret.length < 16) {
    return fail();
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return NextResponse.next();
  } catch {
    return fail();
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
