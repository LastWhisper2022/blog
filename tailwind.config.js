// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './docs/**/*.mdx', // Docusaurus 的 MDX 文件路径
  ],
  theme: { extend: {} },
  plugins: [],
  prefix: 'tw-', // 添加前缀避免冲突
  darkMode: 'class',
  corePlugins: {
    preflight: false, // 禁用默认重置样式
    container: false, // 禁用 container 避免和 Docusaurus 冲突
  },
};