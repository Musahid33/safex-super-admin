import type { Config } from "tailwindcss";
export default { darkMode: "class", content: ["./app/**/*.{ts,tsx}","./components/**/*.{ts,tsx}"],
  theme: { extend: { colors: { primary: "#2563EB" }, borderRadius: { card: "18px" }, boxShadow: { card: "0 1px 2px rgba(16,24,40,.04),0 4px 16px rgba(16,24,40,.06)" } } }, plugins: [] } satisfies Config;
