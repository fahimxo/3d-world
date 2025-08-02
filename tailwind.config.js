/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,html}", // Scan all relevant files in your src folder
  ],
  theme: {
    extend: {
      boxShadow: {
        neon: "0 0 8px #0ff, 0 0 16px #0ff, 0 0 24px #0ff", // cyan glow
        "neon-pink": "0 0 8px #f0f, 0 0 16px #f0f, 0 0 24px #f0f",
      },
    },
  },
  plugins: [],
};
