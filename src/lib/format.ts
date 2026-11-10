import { site } from "../../site.config";

export function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  return `${year}.${month}.${day}`;
}

export function formatDateLong(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function postHref(slug: string): string {
  return `/blog/${slug}`;
}

export function tagHref(tag: string): string {
  return `/tags/${encodeURIComponent(tag)}`;
}

export function seriesHref(name: string): string {
  return `/series/${encodeURIComponent(name)}`;
}

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  const base = site.url.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
