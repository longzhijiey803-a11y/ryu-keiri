import { NextResponse, type NextRequest } from "next/server";

import { AUTH_COOKIE } from "@/lib/auth";

const LOGIN_PATH = "/login";
const DEFAULT_AFTER_LOGIN = "/dashboard";

/** Cookie が無くてもアクセス可能なパス（前方一致）。 */
const PUBLIC_PATHS = ["/login", "/forgot-password", "/ui-lab"];

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authed = request.cookies.get(AUTH_COOKIE)?.value === "1";

  if (!authed && !isPublic(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    if (pathname && pathname !== "/") {
      url.searchParams.set("redirect", pathname + (request.nextUrl.search ?? ""));
    } else {
      url.searchParams.delete("redirect");
    }
    return NextResponse.redirect(url);
  }

  if (authed && pathname === LOGIN_PATH) {
    const url = request.nextUrl.clone();
    url.pathname = DEFAULT_AFTER_LOGIN;
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

/**
 * 静的ファイル・Next 内部・画像は除外。それ以外は middleware を通す。
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|woff|woff2|ttf|otf)$).*)",
  ],
};
