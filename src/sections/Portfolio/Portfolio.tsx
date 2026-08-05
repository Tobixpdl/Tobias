import { ArrowLeft, ArrowRight } from "lucide-react";
import { type PointerEvent, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ProjectCard } from "../../components/ProjectCard/ProjectCard";
import { ProjectModal } from "../../components/ProjectModal/ProjectModal";
import { SectionTitle } from "../../components/SectionTitle/SectionTitle";
import { projects, type Project } from "../../data/projects";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const loopedProjects = [...projects, ...projects, ...projects];
const projectCount = projects.length;
const normalizeIndex = (index: number) => ((index % projectCount) + projectCount) % projectCount;

export function Portfolio() {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const displayIndex = useRef(projectCount);
  const autoCall = useRef<gsap.core.Tween | null>(null);
  const drag = useRef({ active: false, startX: 0, trackX: 0, lastX: 0, lastTime: 0, velocity: 0, moved: false });
  const [activeRenderIndex, setActiveRenderIndex] = useState(projectCount);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const reducedMotion = useReducedMotion();

  const centerCard = useCallback((index: number, animate = true) => {
    if (!viewport.current || !track.current) return;
    const card = track.current.children[index] as HTMLElement | undefined;
    if (!card) return;

    displayIndex.current = index;
    setActiveRenderIndex(index);
    const targetX = viewport.current.clientWidth / 2 - (card.offsetLeft + card.offsetWidth / 2);
    gsap.killTweensOf(track.current);

    const normalizeLoop = () => {
      if (!track.current || !viewport.current || (index >= projectCount && index < projectCount * 2)) return;
      const resetIndex = projectCount + normalizeIndex(index);
      const resetCard = track.current.children[resetIndex] as HTMLElement | undefined;
      if (!resetCard) return;
      displayIndex.current = resetIndex;
      setActiveRenderIndex(resetIndex);
      gsap.set(track.current, { x: viewport.current.clientWidth / 2 - (resetCard.offsetLeft + resetCard.offsetWidth / 2) });
    };

    if (animate) {
      gsap.to(track.current, { x: targetX, duration: 1.05, ease: "power3.inOut", onComplete: normalizeLoop });
    } else {
      gsap.set(track.current, { x: targetX });
      normalizeLoop();
    }
  }, []);

  useLayoutEffect(() => {
    const frame = window.requestAnimationFrame(() => centerCard(projectCount, false));
    const observer = new ResizeObserver(() => centerCard(displayIndex.current, false));
    if (viewport.current) observer.observe(viewport.current);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      if (track.current) gsap.killTweensOf(track.current);
    };
  }, [centerCard]);

  useEffect(() => {
    autoCall.current?.kill();
    if (reducedMotion || selectedProject) return;
    autoCall.current = gsap.delayedCall(3.7, () => centerCard(displayIndex.current + 1));
    return () => { autoCall.current?.kill(); };
  }, [activeRenderIndex, centerCard, reducedMotion, selectedProject]);

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (!track.current) return;
    autoCall.current?.kill();
    gsap.killTweensOf(track.current);
    const currentX = Number(gsap.getProperty(track.current, "x")) || 0;
    drag.current = { active: true, startX: event.clientX, trackX: currentX, lastX: event.clientX, lastTime: performance.now(), velocity: 0, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.classList.add("is-dragging");
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current.active || !track.current) return;
    const now = performance.now();
    const delta = event.clientX - drag.current.startX;
    const frameDelta = event.clientX - drag.current.lastX;
    if (Math.abs(delta) > 7) drag.current.moved = true;
    drag.current.velocity = frameDelta / Math.max(8, now - drag.current.lastTime);
    drag.current.lastX = event.clientX;
    drag.current.lastTime = now;
    gsap.set(track.current, { x: drag.current.trackX + delta });
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current.active) return;
    drag.current.active = false;
    event.currentTarget.classList.remove("is-dragging");
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);

    const distance = event.clientX - drag.current.startX;
    const projected = distance + drag.current.velocity * 180;
    if (projected < -70) centerCard(displayIndex.current + 1);
    else if (projected > 70) centerCard(displayIndex.current - 1);
    else centerCard(displayIndex.current);
  }

  function selectCard(project: Project, renderIndex: number) {
    if (drag.current.moved) {
      drag.current.moved = false;
      return;
    }
    if (renderIndex !== displayIndex.current) {
      centerCard(renderIndex);
      return;
    }
    setSelectedProject(project);
  }

  const closeModal = useCallback(() => {
    setSelectedProject(null);
    window.requestAnimationFrame(() => viewport.current?.querySelector<HTMLElement>(".project-card.is-active .project-card__trigger")?.focus());
  }, []);

  const active = normalizeIndex(activeRenderIndex);

  return (
    <section className="portfolio section" id="trabajos" aria-labelledby="portfolio-title">
      <div className="portfolio__ambient" aria-hidden="true"><i /><i /><i /></div>
      <div className="shell portfolio__header">
        <div id="portfolio-title">
          <SectionTitle eyebrow="Mis trabajos" title="Proyectos en órbita." description="Arrastrá, explorá y tocá el proyecto principal para conocer todos sus detalles." light />
        </div>
        <div className="carousel-controls">
          <button type="button" onClick={() => centerCard(displayIndex.current - 1)} aria-label="Proyecto anterior"><ArrowLeft aria-hidden="true" /></button>
          <span><strong>{String(active + 1).padStart(2, "0")}</strong> / {String(projectCount).padStart(2, "0")}</span>
          <button type="button" onClick={() => centerCard(displayIndex.current + 1)} aria-label="Proyecto siguiente"><ArrowRight aria-hidden="true" /></button>
        </div>
      </div>

      <div
        ref={viewport}
        className="portfolio__viewport"
        role="region"
        aria-roledescription="carrusel"
        aria-label="Proyectos"
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") { event.preventDefault(); centerCard(displayIndex.current - 1); }
          if (event.key === "ArrowRight") { event.preventDefault(); centerCard(displayIndex.current + 1); }
        }}
      >
        <div ref={track} className="portfolio__track">
          {loopedProjects.map((project, renderIndex) => {
            const distance = Math.abs(renderIndex - activeRenderIndex);
            const state = distance === 0 ? "active" : distance === 1 ? "near" : "far";
            return (
              <ProjectCard
                key={`${project.id}-${renderIndex}`}
                project={project}
                index={renderIndex}
                state={state}
                onSelect={() => selectCard(project, renderIndex)}
              />
            );
          })}
        </div>
      </div>

      <div className="portfolio__navigation shell">
        <div className="carousel-dots" aria-label="Elegir proyecto">
          {projects.map((project, index) => (
            <button key={project.id} type="button" className={index === active ? "is-active" : ""} onClick={() => centerCard(projectCount + index)} aria-label={`Ir a ${project.name}`} aria-current={index === active ? "true" : undefined} />
          ))}
        </div>
        {!reducedMotion && <span className="portfolio__autoplay" key={active}><i /></span>}
        <p>Tocá el proyecto central para abrir su ficha</p>
      </div>

      {selectedProject && <ProjectModal project={selectedProject} onClose={closeModal} />}
    </section>
  );
}
