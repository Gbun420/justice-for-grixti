import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), "index.html"),
        privacy: resolve(process.cwd(), "privacy.html"),
        blog: resolve(process.cwd(), "blog.html"),
        admin: resolve(process.cwd(), "admin.html"),
      },
    },
  },
});
