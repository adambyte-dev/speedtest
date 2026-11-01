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
    sitemap: "https://pingly.ktexucoder.online/sitemap.xml",
    host: "https://pingly.ktexucoder.online",
  };
}
