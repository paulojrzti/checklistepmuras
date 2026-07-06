import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Checklist EPMURAS — Compra de Gado",
    short_name: "EPMURAS",
    description:
      "Avalie bovinos no curral com o método EPMURAS: pontuação por característica, vetos automáticos e parecer de compra imediato.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#F7F3E8",
    theme_color: "#123C2F",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
