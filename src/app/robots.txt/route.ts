import { NextResponse } from "next/server";

export function GET() {
  const body = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

User-agent: Googlebot
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: https://ugavole.com/sitemap.xml
Host: https://ugavole.com
`;
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "s-maxage=86400",
    },
  });
}
