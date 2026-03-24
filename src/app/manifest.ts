import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Alexander | Data Engineering Portfolio",
    short_name: "Alexander",
    description:
      "Personal portfolio for a Data Engineering Tech Lead focused on distributed systems, leadership, and creative work.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b1326",
    theme_color: "#0b1326",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}

