import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/speedtest/download",
          "/api/speedtest/upload",
          "/api/speedtest/ping",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/api/speedtest/download",
          "/api/speedtest/upload",
          "/api/speedtest/ping",
        ],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
      },
    ],
    sitemap: "https://speedtest.pingly.net/sitemap.xml",
    host: "https://speedtest.pingly.net",
  };
}
