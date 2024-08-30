import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("tailwindcss-animate"), // make sure to "npm install tailwindcss-animate"
    require("@assistant-ui/react/tailwindcss")({ shadcn: true }),
  ],
};
export default config;
