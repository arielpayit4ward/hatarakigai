import { ESSAY_URL, SITE_URL } from "@/content/journey";
import shareImage from "@/assets/work-worth-doing-share.jpg.asset.json";

export const PUBLIC_URL = "https://hatarakigai.lovable.app";
export const HOME_TITLE = "Work Worth Doing | A Hatarakigai Companion by Seeking Ikigai";
export const HOME_DESCRIPTION = "Fourteen gentle exercises to help you find your hatarakigai, work worth doing. Look inward, check outside yourself, then test it small. Free and private.";

export const SHARE_IMAGE = new URL(shareImage.url, PUBLIC_URL).href;

export function pageHead(path: string, title: string, description: string, indexable = false) {
  const url = `${PUBLIC_URL}${path}`;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: indexable ? "index, follow" : "noindex, follow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:site_name", content: "Seeking Ikigai" },
      { property: "og:locale", content: "en_GB" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      ...(path === "/" ? [
        { property: "og:image", content: SHARE_IMAGE },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:image:alt", content: "Work Worth Doing, a hatarakigai companion by Seeking Ikigai, with watercolour blossoms, stepping stones and bluebells" },
        { name: "twitter:image", content: SHARE_IMAGE },
        { name: "twitter:image:alt", content: "Work Worth Doing, a hatarakigai companion by Seeking Ikigai, with watercolour blossoms, stepping stones and bluebells" },
      ] : []),
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

export const webApplication = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Work Worth Doing",
  description: HOME_DESCRIPTION,
  url: `${PUBLIC_URL}/`,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web browser",
  inLanguage: "en-GB",
  offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
  author: {
    "@type": "Person",
    name: "Sarah Ennett",
    url: `${SITE_URL}/`,
    sameAs: ["https://www.linkedin.com/in/arielpayit4ward/"],
  },
  isBasedOn: ESSAY_URL,
};