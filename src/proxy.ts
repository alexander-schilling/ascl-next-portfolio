import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { LANGUAGE_COOKIE_NAME, getLanguageFromLocalizedPathname, resolvePreferredLanguage } from "@/lib/i18n-preference";
import type { SupportedLanguage } from "@/lib/i18n";

const LANGUAGE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

function setLanguageCookie(response: NextResponse, lang: SupportedLanguage) {
  response.cookies.set(LANGUAGE_COOKIE_NAME, lang, {
    path: "/",
    sameSite: "lax",
    maxAge: LANGUAGE_COOKIE_MAX_AGE_SECONDS,
    secure: process.env.NODE_ENV === "production",
  });
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathnameLang = getLanguageFromLocalizedPathname(pathname);

  if (pathname === "/") {
    const resolvedLanguage = resolvePreferredLanguage({
      cookieLang: request.cookies.get(LANGUAGE_COOKIE_NAME)?.value,
      acceptLanguage: request.headers.get("accept-language"),
      countryCode: request.headers.get("x-vercel-ip-country") ?? request.headers.get("cf-ipcountry"),
    });
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/${resolvedLanguage}`;

    const response = NextResponse.redirect(redirectUrl);
    setLanguageCookie(response, resolvedLanguage);
    return response;
  }

  if (!pathnameLang) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  setLanguageCookie(response, pathnameLang);
  return response;
}

export const config = {
  matcher: ["/", "/:lang(en|es)/:path*"],
};


