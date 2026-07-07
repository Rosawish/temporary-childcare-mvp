import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#263238",
        leaf: "#2f6f62",
        coral: "#ec7357",
        honey: "#f4b860",
        mist: "#f5f7f4"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(38, 50, 56, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
