import React from "react";
import Link from "@docusaurus/Link";
import { projects } from "@site/src/data/projects";

const ProjectTicker = () => {
  // 为了实现无缝滚动，我们需要复制一份数据列表
  const allProjects = [...projects, ...projects, ...projects];

  return (
    <section className="tw-w-full tw-py-8 tw-overflow-hidden">
      {/* 移除了标题和副标题区域 */}

      <div className="tw-relative tw-w-full tw-flex tw-overflow-hidden">
        {/* 渐变遮罩，让两端有淡出效果 - 仅在 PC 端显示 */}
        <div className="tw-hidden md:tw-block tw-absolute tw-top-0 tw-left-0 tw-w-20 tw-h-full tw-bg-gradient-to-r tw-from-gray-50 dark:tw-from-[#1b1b1d] tw-to-transparent tw-z-10"></div>
        <div className="tw-hidden md:tw-block tw-absolute tw-top-0 tw-right-0 tw-w-20 tw-h-full tw-bg-gradient-to-l tw-from-gray-50 dark:tw-from-[#1b1b1d] tw-to-transparent tw-z-10"></div>

        <div className="tw-flex tw-gap-8 tw-whitespace-nowrap hover:tw-pause-animation animate-scroll">
          {allProjects.map((project, index) => (
            <Link
              key={`${project.id}-${index}`}
              to={project.website}
              className="tw-group tw-relative tw-flex-shrink-0 tw-w-72 tw-h-40 tw-rounded-xl tw-overflow-hidden tw-border tw-border-white/20 tw-bg-white/10 tw-backdrop-blur-sm tw-shadow-sm hover:tw-shadow-md tw-transition-all tw-duration-300 hover:-tw-translate-y-1 no-underline hover:no-underline"
            >
              {/* 背景图 */}
              <div 
                className="tw-absolute tw-inset-0 tw-bg-cover tw-bg-center tw-opacity-30 group-hover:tw-opacity-40 tw-transition-opacity tw-duration-500"
                style={{ backgroundImage: `url(${project.preview})` }}
              ></div>
              
              {/* 内容层 */}
              <div className="tw-relative tw-h-full tw-p-6 tw-flex tw-flex-col tw-justify-center">
                <h3 className="tw-text-lg tw-font-bold tw-text-white group-hover:tw-text-blue-400 tw-transition-colors tw-mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  {project.title}
                </h3>
                <p className="tw-text-sm tw-text-gray-300 tw-line-clamp-2 tw-whitespace-normal">
                  {project.description}
                </p>
                
                {/* 标签 */}
                <div className="tw-mt-3 tw-flex tw-gap-2 tw-flex-wrap">
                  {project.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="tw-text-xs tw-px-2 tw-py-1 tw-rounded-full tw-bg-white/10 tw-border tw-border-white/20 tw-text-gray-300">
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
