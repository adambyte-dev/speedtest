import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pingly Speed Test — Uji Kecepatan Internet Akurat & Transparan",
    short_name: "Pingly",
    description: "Uji kecepatan internet unduh, unggah, latensi, dan jitter secara real-time tanpa manipulasi.",
    start_url: "/",
    display: "standalone",
    background_color: "#0F0205",
    theme_color: "#800020",
    icons: [
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
