import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Наталья Мельхер — Поэзия и Вдохновение", short_name: "Н. Мельхер",
    description: "Поэзия, проза и вдохновение Натальи Мельхер",
    start_url: "/", display: "standalone", background_color: "#0a0a1a", theme_color: "#a855f7",
    icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }, { src: "/icon-512.png", sizes: "512x512", type: "image/png" }],
  };
}
