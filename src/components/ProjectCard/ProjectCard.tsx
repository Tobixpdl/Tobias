import { ArrowUpRight, MoveUpRight } from "lucide-react";
import { type Project } from "../../data/projects";

type ProjectCardProps = {
  project: Project;
  index: number;
  state: "active" | "near" | "far";
  onSelect: () => void;
};

export function ProjectCard({ project, index, state, onSelect }: ProjectCardProps) {
  const isActive = state === "active";

  return (
    <article
      className={`project-card project-card--${project.theme} is-${state}`}
      data-project-index={index}
      aria-hidden={!isActive || undefined}
    >
      <button
        className="project-card__trigger"
        type="button"
        tabIndex={isActive ? 0 : -1}
        aria-label={isActive ? `Ver detalles del proyecto ${project.name}` : undefined}
        onClick={onSelect}
      >
        <span className="project-card__number" aria-hidden="true">{String((index % 6) + 1).padStart(2, "0")}</span>
        <span className="project-card__wordmark" aria-hidden="true">{project.name}</span>

        <span className="project-card__identity">
          <small>{project.category}</small>
          <strong>{project.name}</strong>
        </span>

        <span className="project-card__visual" aria-hidden="true">
          <span className="device device--desktop">
            <img src={project.desktopImage} alt="" width="960" height="600" loading={isActive ? "eager" : "lazy"} draggable="false" />
          </span>
          <span className="device device--mobile">
            <img src={project.mobileImage} alt="" width="320" height="640" loading="lazy" draggable="false" />
          </span>
        </span>

        <span className="project-card__floating-features" aria-hidden="true">
          {project.features.map((feature, featureIndex) => (
            <i className={`project-card__feature project-card__feature--${featureIndex + 1}`} key={feature}>{feature}</i>
          ))}
        </span>

        <span className="project-card__summary">
          <span>{project.description}</span>
          <b>Explorar proyecto <ArrowUpRight aria-hidden="true" /></b>
        </span>

        <span className="project-card__open" aria-hidden="true"><MoveUpRight /></span>
      </button>
    </article>
  );
}
