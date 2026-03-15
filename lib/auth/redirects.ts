export function getSafeRedirectPath(value?: string | null) {
  if (!value || !value.startsWith("/")) {
    return "/dashboard";
  }

  return value;
}

export function buildAuthCallbackUrl(origin: string, next?: string | null) {
  const url = new URL("/auth/callback", origin);
  const safeNext = getSafeRedirectPath(next);

  if (safeNext !== "/dashboard") {
    url.searchParams.set("next", safeNext);
  }

  return url.toString();
}
