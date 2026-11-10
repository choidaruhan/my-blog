import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const outDir = path.join(root, "dist/client");
const serverEntry = path.join(root, "dist/server/server.js");
const indexPath = path.join(root, ".content/index.json");

const index = JSON.parse(await readFile(indexPath, "utf8"));
const { site, posts, routes } = index;
const base = String(site.url).replace(/\/$/, "");

const { handleRequest } = await import(pathToFileURL(serverEntry).href);

function routeToFile(route) {
  const clean = route.replace(/^\/+|\/+$/g, "");
  return clean ? path.join(outDir, clean, "index.html") : path.join(outDir, "index.html");
}

async function writeHtml(route) {
  const response = await handleRequest(new Request(new URL(route, "http://localhost")));
  if (!response.ok) {
    throw new Error(`프리렌더 실패: ${route} → HTTP ${response.status}`);
  }
  const html = await response.text();
  const file = routeToFile(route);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, html, "utf8");
  return { route, file, bytes: Buffer.byteLength(html) };
}

const results = [];
for (const route of routes) {
  if (route === "/404") continue;
  results.push(await writeHtml(route));
}

// Cloudflare Pages가 자동으로 사용하는 404 문서
const notFound = await writeHtml("/404");
await writeFile(path.join(outDir, "404.html"), await readFile(notFound.file, "utf8"), "utf8");
results.push(notFound);

/* -------------------------------------------------------------------------- */
/* RSS, sitemap, robots                                                       */
/* -------------------------------------------------------------------------- */

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function absolute(route) {
  return `${base}${route.startsWith("/") ? route : `/${route}`}`;
}

function rfc822(date) {
  return new Date(`${date}T00:00:00Z`).toUTCString();
}

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.title)}</title>
    <link>${escapeXml(base)}</link>
    <description>${escapeXml(site.description)}</description>
    <language>${escapeXml(site.lang)}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(absolute("/rss.xml"))}" rel="self" type="application/rss+xml" />
${posts
  .map(
    (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(absolute(`/blog/${post.slug}`))}</link>
      <guid isPermaLink="true">${escapeXml(absolute(`/blog/${post.slug}`))}</guid>
      <pubDate>${rfc822(post.date)}</pubDate>
      <description>${escapeXml(post.description)}</description>
${post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`).join("\n")}
    </item>`,
  )
  .join("\n")}
  </channel>
</rss>
`;

const sitemapRoutes = routes.filter((route) => route !== "/404" && route !== "/search");
const postDates = new Map(posts.map((post) => [`/blog/${post.slug}`, post.date]));

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapRoutes
  .map((route) => {
    const lastmod = postDates.get(route) ?? index.generatedAt.slice(0, 10);
    return `  <url>
    <loc>${escapeXml(absolute(route))}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`;
  })
  .join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${absolute("/sitemap.xml")}
`;

await writeFile(path.join(outDir, "rss.xml"), rss, "utf8");
await writeFile(path.join(outDir, "sitemap.xml"), sitemap, "utf8");
await writeFile(path.join(outDir, "robots.txt"), robots, "utf8");

const total = results.reduce((sum, item) => sum + item.bytes, 0);
console.log(
  `[prerender] ${results.length}개 경로, ${(total / 1024).toFixed(1)} KiB HTML 생성 완료`,
);
console.log(`[prerender] rss.xml, sitemap.xml, robots.txt 생성 완료`);
