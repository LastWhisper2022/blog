// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx,mdx}',
    './blog/**/*.md',
    './docs/**/*.mdx', // Docusaurus 的 MDX 文件路径
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f0f4f6',
          100: '#e1e9ec',
          200: '#c3d3d9',
          300: '#a5bdc6',
          400: '#8cb6c0', // Dark mode primary (Moonlight Cyan)
          500: '#315b6e',
          600: '#2c5364', // Light mode primary (Deep Ink Cyan)
          700: '#274b5a',
          800: '#254755',
          900: '#1e3a46',
        },
      },
    },
  },
  plugins: [],
  prefix: 'tw-', // 添加前缀避免冲突
  darkMode: 'class',
  corePlugins: {
    preflight: false, // 禁用默认重置样式
    container: false, // 禁用 container 避免和 Docusaurus 冲突
  },
};