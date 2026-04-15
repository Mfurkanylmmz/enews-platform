export const ADMIN_COOKIE_NAME = "enews_admin_session";

function getAdminSecret() {
  return process.env.ADMIN_UI_PASSWORD ?? process.env.ADMIN_API_KEY ?? "";
}

export function hasAdminSecretConfigured() {
  return Boolean(getAdminSecret());
}

export function isValidAdminSecret(value: string | null | undefined) {
  const secret = getAdminSecret();
  return Boolean(secret) && value === secret;
}

export function hasAdminSessionFromCookieHeader(cookieHeader: string | null) {
  if (!cookieHeader) {
    return false;
  }

  const token = cookieHeader
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${ADMIN_COOKIE_NAME}=`))
    ?.split("=")[1];

  return isValidAdminSecret(token);
}

export function isAuthorizedRequest(request: Request) {
  const bearer = request.headers.get("authorization");
  const adminKey = request.headers.get("x-admin-key");

  if (adminKey && isValidAdminSecret(adminKey)) {
    return true;
  }

  if (bearer?.startsWith("Bearer ")) {
    return isValidAdminSecret(bearer.slice("Bearer ".length));
  }

  return hasAdminSessionFromCookieHeader(request.headers.get("cookie"));
}
