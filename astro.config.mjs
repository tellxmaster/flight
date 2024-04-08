import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import dotenv from "dotenv";

// Load the environment variables from the .env file
import preact from "@astrojs/preact";
import vercel from "@astrojs/vercel/serverless";
dotenv.config();

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    preact({
      include: ["**/preact/*"],
    }),
  ],
  env: {
    AMADEUS_API_KEY: process.env.AMADEUS_API_KEY,
    AMADEUS_API_SECRET: process.env.AMADEUS_API_SECRET,
  },
  output: "server",
  adapter: vercel(),
});
