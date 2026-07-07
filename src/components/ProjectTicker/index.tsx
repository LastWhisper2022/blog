import React from "react";
import Link from "@docusaurus/Link";
import { projects } from "@site/src/data/projects";

const ProjectTicker = () => {
  const allProjects = [...projects, ...projects, ...projects];

  return (
    <section className="project-ticker tw-w-full tw-overflow-hidden">
      <div className="tw-container tw-mx-auto tw-px-4">
        <div className="project-ticker__header">
          <span>SELECTED WORKS</span>
          <i aria-hidden="true" />
        </div>
      </div>

      <div className="project-ticker__viewport">
        <div className="project-ticker__edge project-ticker__edge--left" />
        <div className="project-ticker__edge project-ticker__edge--right" />

        <div className="project-ticker__track">
          {allProjects.map((project, index) => (
            <Link
              key={`${project.id}-${index}`}
              to={project.website}
              className="project-card"
            >
              <div className="project-card__media">
                <div 
                  className="project-card__image"
                  style={{ backgroundImage: `url(${project.preview})` }}
                ></div>
              </div>
              
              <div className="project-card__body">
                <h3>{project.title}</h3>
                
                <div className="project-card__tags">
                  {project.tags.slice(0, 3).map(tag => (
                    <span key={tag}>
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
