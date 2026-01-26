export interface Project {
  id: string;
  title: string;
  description: string;
  preview: string; // 图片路径
  website: string; // 详情页链接或外部链接
  tags: string[];
  source?: string; // 源码链接（可选）
}

export const projects: Project[] = [
  {
    id: "finance-copilot-web",
    title: "AI 智能财报录入",
    description: "利用 OCR 识别，大模型分析，通过问答式界面，实现智能录入财务数据。",
    preview: "/img/finance.png", // 暂时使用默认图，后续替换
    website: "/project/finance-copilot-web",
    tags: ["React", "TypeScript", "LLM"],
  },
  {
    id: "personal-blog",
    title: "隻恶博客",
    description: "基于 Docusaurus 构建的个人技术博客，集成暗黑模式、本地搜索与评论系统。",
    preview: "/img/docusaurus-social-card.jpg",
    website: "/project/blog-design",
    source: "https://github.com/MuscleProgrammerXiao/blog",
    tags: ["React", "Docusaurus", "TailwindCSS"],
  },
];
