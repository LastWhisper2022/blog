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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
  prefix: 'tw-', // 添加前缀避免冲突
  darkMode: ['class', '[data-theme="dark"]'], // Adapt to Docusaurus dark mode
  corePlugins: {
    preflight: false, // 禁用默认重置样式
    container: false, // 禁用 container 避免和 Docusaurus 冲突
  },
};
