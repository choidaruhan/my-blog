import { Link, Meta, Title } from "@solidjs/meta";
import { Show } from "solid-js";
import { site } from "../../site.config";
import { absoluteUrl } from "../lib/format";

export default function Seo(props: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  image?: string;
  noindex?: boolean;
}) {
  const url = () => absoluteUrl(props.path);

  return (
    <>
      <Title>{props.title}</Title>
      <Meta name="description" content={props.description} />

      <Meta property="og:site_name" content={site.title} />
      <Meta property="og:type" content={props.type ?? "website"} />
      <Meta property="og:title" content={props.title} />
      <Meta property="og:description" content={props.description} />
      <Meta property="og:url" content={url()} />
      <Meta property="og:image" content={absoluteUrl(props.image ?? site.ogImage)} />

      <Meta name="twitter:card" content="summary_large_image" />
      <Meta name="twitter:title" content={props.title} />
      <Meta name="twitter:description" content={props.description} />

      <Show when={props.noindex}>
        <Meta name="robots" content="noindex" />
      </Show>

      <Link rel="canonical" href={url()} />
      <Link
        rel="alternate"
        type="application/rss+xml"
        title={site.title}
        href="/rss.xml"
      />
    </>
  );
}
