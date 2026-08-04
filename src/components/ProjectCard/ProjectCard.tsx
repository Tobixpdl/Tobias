import { ArrowUpRight } from "lucide-react";
import { type Project } from "../../data/projects";

type ProjectCardProps = { project: Project; index: number };

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <article className={`project-card project-card--${project.theme}`} data-project-index={index} data-tilt-card>
      <a className="project-card__link" href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`Ver proyecto ${project.name} en una nueva pestaña`}>
        <div className="project-card__visual" aria-hidden="true">
          <div className="device device--desktop">
            <span className="device__bar"><i /><i /><i /></span>
            <img src={project.desktopImage} alt="" width="960" height="600" loading="lazy" draggable="false" />
          </div>
          <div className="device device--mobile">
            <span className="device__notch" />
            <img src={project.mobileImage} alt="" width="320" height="640" loading="lazy" draggable="false" />
          </div>
        </div>
        <div className="project-card__content">
          <div>
            <span className="project-card__category">{project.category}</span>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
          </div>
          <div className="project-card__meta">
            <ul aria-label="Funcionalidades">
              {project.features.map((feature) => <li key={feature}>{feature}</li>)}
            </ul>
            <span className="project-card__button">Ver proyecto <ArrowUpRight aria-hidden="true" /></span>
          </div>
        </div>
      </a>
    </article>
  );
}
