import React from "react";
import Link from "@docusaurus/Link";
import { projects } from "@site/src/data/projects";

const ProjectTicker = () => {
  // 为了实现无缝滚动，我们需要复制一份数据列表
  const allProjects = [...projects, ...projects, ...projects];

  return (
    <section className="tw-w-full tw-py-8 tw-overflow-hidden">
      {/* 移除了标题和副标题区域 */}

      <div className="tw-relative tw-w-full tw-flex tw-overflow-hidden tw-py-4">
        {/* 渐变遮罩 - 仅在 PC 端显示，优化颜色以匹配深色/浅色模式 */}
        <div className="tw-hidden md:tw-block tw-absolute tw-top-0 tw-left-0 tw-w-32 tw-h-full tw-bg-gradient-to-r tw-from-white dark:tw-from-[#000000] tw-to-transparent tw-z-10"></div>
        <div className="tw-hidden md:tw-block tw-absolute tw-top-0 tw-right-0 tw-w-32 tw-h-full tw-bg-gradient-to-l tw-from-white dark:tw-from-[#000000] tw-to-transparent tw-z-10"></div>

        <div className="tw-flex tw-gap-6 tw-whitespace-nowrap hover:tw-pause-animation animate-scroll">
          {allProjects.map((project, index) => (
            <Link
              key={`${project.id}-${index}`}
              to={project.website}
              className="tw-group tw-relative tw-flex-shrink-0 tw-w-[22rem] tw-h-32 tw-rounded-lg tw-overflow-hidden tw-border tw-border-gray-200 dark:tw-border-white/10 tw-bg-white dark:tw-bg-black/40 tw-backdrop-blur-md tw-shadow-sm hover:tw-shadow-[0_0_15px_rgba(59,130,246,0.5)] dark:hover:tw-border-blue-500/50 hover:tw-border-blue-400 tw-transition-all tw-duration-300 no-underline hover:no-underline tw-flex"
            >
              {/* 左侧图片区域 - 40% 宽度 */}
              <div className="tw-w-[40%] tw-h-full tw-relative tw-overflow-hidden">
                <div 
                  className="tw-absolute tw-inset-0 tw-bg-cover tw-bg-center tw-transition-transform tw-duration-500 group-hover:tw-scale-110"
                  style={{ backgroundImage: `url(${project.preview})` }}
                ></div>
                {/* 图片遮罩，增加质感 */}
                <div className="tw-absolute tw-inset-0 tw-bg-black/10 dark:tw-bg-black/20 group-hover:tw-bg-transparent tw-transition-colors"></div>
              </div>
              
              {/* 右侧内容区域 - 60% 宽度 */}
              <div className="tw-w-[60%] tw-p-4 tw-flex tw-flex-col tw-justify-between tw-bg-white/50 dark:tw-bg-transparent">
                <div>
                  <h3 className="tw-text-base tw-font-bold tw-text-gray-800 dark:tw-text-white group-hover:tw-text-blue-600 dark:group-hover:tw-text-blue-400 tw-transition-colors tw-mb-1 tw-truncate" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                    {project.title}
                  </h3>
                  <p className="tw-text-xs tw-text-gray-500 dark:tw-text-gray-400 tw-line-clamp-2 tw-whitespace-normal tw-leading-relaxed">
                    {project.description}
                  </p>
                </div>
                
                {/* 底部标签栏 */}
                <div className="tw-flex tw-items-center tw-gap-2">
                  {project.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="tw-text-[10px] tw-px-1.5 tw-py-0.5 tw-rounded tw-bg-gray-100 dark:tw-bg-white/10 tw-text-gray-600 dark:tw-text-gray-300 tw-font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectTicker;
