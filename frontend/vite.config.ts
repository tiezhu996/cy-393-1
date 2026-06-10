import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: { port: 18413 },
    test: {
        globals: true,
        environment: "jsdom",
        include: ["src/**/*.test.{ts,tsx}"],
    },
});
