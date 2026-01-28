import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import type { GiscusConfig } from './src/components/Comment'
const Title = "隻恶";
const config: Config = {
  title: "隻恶",
  url: "https://lastwhisper.online", //网站域名
  baseUrl: "/",
  favicon: "svg/favicon.ico",
  organizationName: "MuscleProgrammerXiao",
  projectName: "blog",
  onBrokenLinks: "warn", // throw,warn,ignore
  plugins: [
    "./src/plugins/tailwind-config.js",
    [
      "@easyops-cn/docusaurus-search-local",
      {
        hashed: true,
        language: ["en", "zh"],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      },
    ],
  ],
  themeConfig: {
    image: "img/docusaurus-social-card.jpg",
    colorMode: {
      defaultMode: "light", // 默认主题：light | dark
      disableSwitch: true, // 是否禁用切换按钮
      respectPrefersColorScheme: false, // 跟随系统深浅色
    },
    navbar: {
      title: Title,
      logo: {
        alt: "My Site Logo",
        src: "svg/logo.gif",
      },
      items: [
        { to: "/blog", label: "博客", position: "right" },
        { to: "/project", label: "作品", position: "right" },
        { to: "/about", label: "关于", position: "right" },
        {
          type: "search",
          position: "right",
        },
      ],
    },
    // footer: {
    //   style: "dark",
    //   links: [
    //     {
    //       title: "文档",
    //       items: [
    //         {
    //           label: "Tutorial",
    //           to: "/docs/intro",
    //         },
    //       ],
    //     },
    //     {
    //       title: "社交媒体",
    //       items: [
    //         {
    //           label: "BiliBili",
    //           href: "https://space.bilibili.com/62832413",
    //         },
    //         {
    //           label: "GitHub",
    //           href: "https://github.com/MuscleProgrammerXiao",
    //         },
    //         {
    //           label: "X",
    //           href: "https://x.com/docusaurus",
    //         },
    //       ],
    //     },
    //     {
    //       title: "更多",
    //       items: [
    //         {
    //           label: "Blog",
    //           to: "/blog",
    //         },
    //         {
    //           label: "GitHub",
    //           href: "https://github.com/facebook/docusaurus",
    //         },
    //       ],
    //     },
    //   ],
    //   copyright: `Copyright © ${new Date().getFullYear()} 3vddogs , Inc. Built with Docusaurus.`,
    // },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    giscus: {
      repo: 'MuscleProgrammerXiao/blog',
      repoId: 'R_kgDOQptTUA',
      category: 'Announcements',
      categoryId: 'DIC_kwDOQptTUM4C02cn',
      theme: 'light',
      darkTheme: 'dark_dimmed',
    } satisfies Partial<GiscusConfig>,
  } satisfies Preset.ThemeConfig,
  presets: [
    [
      "classic",
      {
        docs: {
          path: "docs",
          sidebarPath: "./sidebars.ts",
        },
        blog: {
          routeBasePath: "blog",
          path: "blog",
          postsPerPage: 'ALL',
          blogSidebarTitle: "全部文章",
          authorsMapPath: "authors.yml",
          feedOptions: {
            type: "all",
            title: "我的技术博客",
            description: "分享前端开发经验与最佳实践",
            copyright: `Copyright © ${new Date().getFullYear()} Your Name`,
            language: "zh-CN",
            limit: 20,
          },
          // showLastUpdateTime: true,
          // showLastUpdateAuthor: true,
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],
  i18n: {
    defaultLocale: "zh-CN",
    locales: ["zh-CN"],
  },
  future: {
    v4: true,
  },
};

export default config;
