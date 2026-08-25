export function safeAdminDestination(
  value: string | null | undefined,
  origin: string
): string {
  if (!value || value.includes("\\")) return "/admin";
  try {
    const expectedOrigin = new URL(origin).origin;
    const url = new URL(value, expectedOrigin);
    if (url.origin !== expectedOrigin) return "/admin";
    if (url.pathname !== "/admin" && !url.pathname.startsWith("/admin/")) {
      return "/admin";
    }
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/admin";
  }
}
