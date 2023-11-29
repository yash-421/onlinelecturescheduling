import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  important:true,
  theme: {
    extend: {
     colors:{
      back:'rgba(36, 105, 92, 0.1)',
      primary:'#5f7a8d',
      secondary:"#fdc040"
     }
    },
  },
  plugins: [],
}
export default config
