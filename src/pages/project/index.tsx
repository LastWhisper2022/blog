import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import { projects, type Project } from "@site/src/data/projects";

// Bento Grid 风格的卡片组件
const ProjectCard: React.FC<{ project: Project; className?: string }> = ({ project, className }) => (
  <Link
    to={project.website}
    className={`tw-group tw-relative tw-block tw-overflow-hidden tw-rounded-2xl tw-bg-white dark:tw-bg-[#1b1b1d] tw-border tw-border-gray-200 dark:tw-border-gray-800 tw-transition-all tw-duration-300 hover:tw-shadow-xl hover:-tw-translate-y-1 no-underline hover:no-underline ${className}`}
  >
    {/* 顶部图片区域 */}
    <div className="tw-h-48 tw-overflow-hidden tw-relative">
       <div 
        className="tw-absolute tw-inset-0 tw-bg-cover tw-bg-center tw-transition-transform tw-duration-500 group-hover:tw-scale-105"
        style={{ backgroundImage: `url(${project.preview})` }}
      />
      <div className="tw-absolute tw-inset-0 tw-bg-gradient-to-t tw-from-black/60 tw-to-transparent tw-opacity-60" />
      
      {/* 悬浮标签 */}
      <div className="tw-absolute tw-bottom-3 tw-left-4 tw-flex tw-gap-2">
        {project.tags.map((tag) => (
          <span key={tag} className="tw-text-xs tw-font-medium tw-text-white/90 tw-bg-white/20 tw-backdrop-blur-sm tw-px-2 tw-py-0.5 tw-rounded-full">
            {tag}
          </span>
        ))}
      </div>
    </div>

    {/* 内容区域 */}
    <div className="tw-p-6">
      <div className="tw-flex tw-justify-between tw-items-start tw-mb-2">
        <h3 className="tw-text-xl tw-font-bold tw-text-gray-900 dark:tw-text-white group-hover:tw-text-ink-600 dark:group-hover:tw-text-ink-400 tw-transition-colors">
          {project.title}
        </h3>
        {/* 箭头图标 */}
        <svg 
          className="tw-w-5 tw-h-5 tw-text-gray-400 group-hover:tw-text-ink-500 tw-transform group-hover:tw-translate-x-1 group-hover:-tw-translate-y-1 tw-transition-all" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
        </svg>
      </div>
      
      <p className="tw-text-gray-600 dark:tw-text-gray-400 tw-text-sm tw-leading-relaxed tw-line-clamp-3">
        {project.description}
      </p>
    </div>
  </Link>
);

export default function Projects(): React.JSX.Element {
  return (
    <Layout title="精选作品集" description="探索我的创意与技术实践">
      <main className="tw-min-h-screen tw-bg-gray-50 dark:tw-bg-black">
        {/* 头部 Hero */}
        <section className="tw-py-20 tw-px-4">
          <div className="tw-container tw-mx-auto tw-max-w-6xl">
            <h1 className="tw-text-4xl md:tw-text-6xl tw-font-bold tw-mb-6 tw-bg-clip-text tw-text-transparent tw-bg-gradient-to-r tw-from-ink-600 tw-to-ink-800 dark:tw-from-ink-400 dark:tw-to-ink-300">
              作品集
            </h1>
            <p className="tw-text-xl tw-text-gray-600 dark:tw-text-gray-400 tw-max-w-2xl">
              这里展示了我的一些个人项目、实验性代码以及有趣的想法。
            </p>
          </div>
        </section>

        {/* Bento Grid 作品列表 */}
        <section className="tw-pb-24 tw-px-4">
          <div className="tw-container tw-mx-auto tw-max-w-6xl">
            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-6 md:tw-gap-8">
              {projects.map((project, index) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  // 让第一个项目在宽屏下占满两列，形成 Bento 风格
                  className={index === 0 ? "md:tw-col-span-2 lg:tw-col-span-2" : ""}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
