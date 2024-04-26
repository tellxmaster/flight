import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import dotenv from "dotenv";
import netlify from "@astrojs/netlify";

dotenv.config();

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  env: {
    AMADEUS_API_KEY: process.env.AMADEUS_API_KEY,
    AMADEUS_API_SECRET: process.env.AMADEUS_API_SECRET,
  },
  output: "hybrid",
  adapter: netlify(),
});
