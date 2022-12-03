import { defineConfig } from "vite";
export default defineConfig({
  resolve: {
    alias: {
      src: path.resolve("src"),
    },
  },
});
