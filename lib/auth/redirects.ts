export function getSafeRedirectPath(value?: string | null) {
  if (!value || !value.startsWith("/")) {
    return "/dashboard";
  }

  return value;
}

export function buildAuthPageUrl(
  origin: string,
  pathname: "/login" | "/signup",
  options?: {
    redirectTo?: string | null;
    error?: string | null;
    message?: string | null;
  },
) {
  const url = new URL(pathname, origin);
  const safeRedirect = getSafeRedirectPath(options?.redirectTo);

  if (safeRedirect !== "/dashboard") {
    url.searchParams.set("redirectTo", safeRedirect);
  }

  if (options?.error) {
    url.searchParams.set("error", options.error);
  }

  if (options?.message) {
    url.searchParams.set("message", options.message);
  }

  return url;
}

export function buildAuthCallbackUrl(origin: string, next?: string | null) {
  const url = new URL("/auth/callback", origin);
  const safeNext = getSafeRedirectPath(next);

  if (safeNext !== "/dashboard") {
    url.searchParams.set("next", safeNext);
  }

  return url.toString();
}
