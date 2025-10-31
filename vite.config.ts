import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const API_BASE = env.VITE_API_BASE_URL || "";
  const CLOUD_NAME = env.VITE_CLOUDINARY_CLOUD_NAME || "";

  const CSP = `
    default-src 'self' data: blob:;
    connect-src 
      'self' 
      ${API_BASE} 
      https://api.cloudinary.com 
      wss:;
    img-src 
      'self' 
      data: blob: 
      https://res.cloudinary.com/${CLOUD_NAME};
    style-src 'self' 'unsafe-inline';
    script-src 'self';
    font-src 'self' data:;
    frame-ancestors 'none';
    object-src 'none';
    base-uri 'self';
  `
    .replace(/\s+/g, " ")
    .trim();

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: "html-csp-injector",
        transformIndexHtml(html) {
          const meta = `<meta http-equiv="Content-Security-Policy" content="${CSP}">`;
          return html
            .replace(/<meta[^>]+Content-Security-Policy[^>]+>/i, "")
            .replace(/(<head>)/i, `$1\n  ${meta}`);
        },
      },
    ],
    base: "./",
    build: {
      outDir: "dist",
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
