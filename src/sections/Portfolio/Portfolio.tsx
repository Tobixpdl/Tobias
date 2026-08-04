import { ArrowLeft, ArrowRight } from "lucide-react";
import { type MouseEvent, type PointerEvent, useRef, useState } from "react";
import { ProjectCard } from "../../components/ProjectCard/ProjectCard";
import { SectionTitle } from "../../components/SectionTitle/SectionTitle";
import { projects } from "../../data/projects";

export function Portfolio() {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });
  const [active, setActive] = useState(0);

  function goTo(index: number) {
    const next = Math.max(0, Math.min(projects.length - 1, index));
    const card = track.current?.children[next] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    setActive(next);
  }

  function updateActive() {
    const element = track.current;
    if (!element) return;
    const cards = Array.from(element.children) as HTMLElement[];
    const center = element.scrollLeft + element.clientWidth / 2;
    const next = cards.reduce((best, card, index) => {
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const bestCard = cards[best];
      const bestCenter = bestCard.offsetLeft + bestCard.clientWidth / 2;
      return Math.abs(cardCenter - center) < Math.abs(bestCenter - center) ? index : best;
    }, 0);
    setActive(next);
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    drag.current = { active: true, startX: event.clientX, scrollLeft: event.currentTarget.scrollLeft, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.classList.add("is-dragging");
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current.active) return;
    const distance = event.clientX - drag.current.startX;
    if (Math.abs(distance) > 6) drag.current.moved = true;
    event.currentTarget.scrollLeft = drag.current.scrollLeft - distance;
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    drag.current.active = false;
    event.currentTarget.classList.remove("is-dragging");
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    updateActive();
  }

  function preventClickAfterDrag(event: MouseEvent<HTMLDivElement>) {
    if (drag.current.moved) {
      event.preventDefault();
      event.stopPropagation();
      drag.current.moved = false;
    }
  }

  return (
    <section className="portfolio section" id="trabajos" aria-labelledby="portfolio-title">
      <div className="shell portfolio__header">
        <div id="portfolio-title">
          <SectionTitle eyebrow="Mis trabajos" title="Proyectos creados para negocios reales." description="Diseños adaptados al rubro, los objetivos y el tipo de cliente." light />
        </div>
        <div className="carousel-controls">
          <button type="button" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Proyecto anterior"><ArrowLeft aria-hidden="true" /></button>
          <span><strong>{String(active + 1).padStart(2, "0")}</strong> / {String(projects.length).padStart(2, "0")}</span>
          <button type="button" onClick={() => goTo(active + 1)} disabled={active === projects.length - 1} aria-label="Proyecto siguiente"><ArrowRight aria-hidden="true" /></button>
        </div>
      </div>
      <div
        ref={track}
        className="portfolio__track"
        role="region"
        aria-roledescription="carrusel"
        aria-label="Proyectos"
        tabIndex={0}
        onScroll={updateActive}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={preventClickAfterDrag}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") { event.preventDefault(); goTo(active - 1); }
          if (event.key === "ArrowRight") { event.preventDefault(); goTo(active + 1); }
        }}
      >
        {projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}
      </div>
      <div className="carousel-dots" aria-label="Elegir proyecto">
        {projects.map((project, index) => (
          <button key={project.id} type="button" className={index === active ? "is-active" : ""} onClick={() => goTo(index)} aria-label={`Ir a ${project.name}`} aria-current={index === active ? "true" : undefined} />
        ))}
      </div>
    </section>
  );
}
