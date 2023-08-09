import type { Config } from 'tailwindcss/types';
// import type { Config } from 'tailwindcss';


const config: Config = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
export default config;