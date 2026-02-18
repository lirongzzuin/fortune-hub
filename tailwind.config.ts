import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#8c2bee",
        "primary-dark": "#7a24d4",
        "primary-light": "#f3e8ff",
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      borderRadius: {
        lg: "1rem",
        xl: "1.5rem",
      },
    },
  },
  plugins: [],
};
export default config;
