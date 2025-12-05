import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "수산물 거래 명세서",
        short_name: "거래명세서",
        description: "간편한 수산물 거래 관리 서비스",
        theme_color: "#ffffff",
        icons: [
          {
            src: "오늘의거래1.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "오늘의거래2.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
