import { ArrowUpRight, Check, X } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { type Project } from "../../data/projects";

type ProjectModalProps = {
  project: Project;
  onClose: () => void;
};

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    const background = document.querySelector<HTMLElement>(".site-wrap");
    const previousInert = background?.inert ?? false;
    if (background) background.inert = true;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        const items = [
          ...root.current!.querySelectorAll<HTMLElement>(
            ".project-modal__panel button, .project-modal__panel a[href]",
          ),
        ];
        const first = items[0],
          last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);

    const context = gsap.context(() => {
      if (reduced) return;
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".project-modal__backdrop", { opacity: 0, duration: 0.3 })
        .from(
          ".project-modal__panel",
          { y: 42, scale: 0.94, opacity: 0, duration: 0.68 },
          0.05,
        )
        .from(
          ".project-modal__visual > *, .project-modal__content > *",
          { y: 22, opacity: 0, duration: 0.5, stagger: 0.055 },
          0.28,
        );
    }, root);

    return () => {
      document.body.style.overflow = previousOverflow;
      if (background) background.inert = previousInert;
      window.removeEventListener("keydown", onKeyDown);
      context.revert();
    };
  }, [onClose, reduced]);

  return createPortal(
    <div
      ref={root}
      className="project-modal"
      data-lenis-prevent
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      <button
        className="project-modal__backdrop"
        tabIndex={-1}
        type="button"
        aria-label="Cerrar ficha del proyecto"
        onClick={onClose}
      />
      <div
        className={`project-modal__panel project-modal__panel--${project.theme}`}
        data-lenis-prevent
      >
        <button
          ref={closeButton}
          className="project-modal__close"
          type="button"
          aria-label="Cerrar detalle"
          onClick={onClose}
        >
          <X aria-hidden="true" />
        </button>
        <div className="project-modal__visual">
          <span className="project-modal__glow" />
          <img
            className="project-modal__desktop"
            src={project.desktopImage}
            alt={`Vista de escritorio de ${project.name}`}
            width="960"
            height="600"
          />
          <img
            className="project-modal__mobile"
            src={project.mobileImage}
            alt={`Vista móvil de ${project.name}`}
            width="320"
            height="640"
          />
        </div>
        <div className="project-modal__content">
          <span className="project-modal__category">{project.category}</span>
          <h3 id="project-modal-title">{project.name}</h3>
          <p>{project.description}</p>
          <ul aria-label="Funcionalidades del proyecto">
            {project.features.map((feature) => (
              <li key={feature}>
                <Check aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
          <a
            className="button button--primary"
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visitar proyecto <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>,
    document.body,
  );
}
