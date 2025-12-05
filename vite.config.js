import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Vercel은 별도 설정 없이 기본 상태가 가장 잘 돌아갑니다.
});
