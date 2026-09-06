export const GARAGE_COOKIE = "cukur-garage";
export const isUuid = (value: unknown): value is string =>
  typeof value === "string" &&
  /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(value);
export function garageCookie(request: Request) {
  const value = request.headers
    .get("cookie")
    ?.split(";")
    .map((v) => v.trim())
    .find((v) => v.startsWith(`${GARAGE_COOKIE}=`))
    ?.slice(GARAGE_COOKIE.length + 1);
  return isUuid(value) ? value : null;
}
