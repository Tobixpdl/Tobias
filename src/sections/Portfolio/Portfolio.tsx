import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import {
  type PointerEvent,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import { ProjectModal } from "../../components/ProjectModal/ProjectModal";
import { SectionTitle } from "../../components/SectionTitle/SectionTitle";
import { projects, type Project } from "../../data/projects";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export function Portfolio() {
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<Project | null>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const drag = useRef({ x: 0, y: 0, moved: false, down: false });
  const reduced = useReducedMotion();
  const select = (index: number) =>
    setActive((index + projects.length) % projects.length);
  useLayoutEffect(() => {
    if (!viewport.current || !track.current) return;
    const move = (animate: boolean) => {
      gsap.killTweensOf(track.current);
      gsap.to(track.current, {
        x: -active * viewport.current!.clientWidth,
        duration: animate && !reduced ? 0.55 : 0,
        ease: "power3.out",
      });
    };
    move(true);
    const observer = new ResizeObserver(() => move(false));
    observer.observe(viewport.current);
    return () => {
      observer.disconnect();
      gsap.killTweensOf(track.current);
    };
  }, [active, reduced]);
  const close = useCallback(() => {
    setSelected(null);
    requestAnimationFrame(() => opener.current?.focus());
  }, []);
  function pointerUp(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current.down) return;
    drag.current.down = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    const dx = event.clientX - drag.current.x;
    const dy = event.clientY - drag.current.y;
    drag.current.moved = Math.abs(dx) > 12 || Math.abs(dy) > 12;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy))
      select(active + (dx < 0 ? 1 : -1));
    else
      gsap.to(track.current, {
        x: -active * viewport.current!.clientWidth,
        duration: reduced ? 0 : 0.3,
        ease: "power2.out",
      });
  }
  return (
    <section
      id="trabajos"
      className="portfolio section"
      aria-labelledby="portfolio-title"
    >
      <div className="shell">
        <div className="portfolio__header">
          <div id="portfolio-title">
            <SectionTitle
              eyebrow="Trabajos seleccionados / 03"
              title="Tres negocios. Tres formas de contar."
              description="Sitios que podés recorrer, probar y abrir. Diseño y funciones pensados para cada rubro."
              light
            />
          </div>
          <div className="carousel-controls">
            <button
              type="button"
              aria-label="Proyecto anterior"
              onClick={() => select(active - 1)}
            >
              <ArrowLeft />
            </button>
            <span aria-live="polite">
              {String(active + 1).padStart(2, "0")} / 03
            </span>
            <button
              type="button"
              aria-label="Proyecto siguiente"
              onClick={() => select(active + 1)}
            >
              <ArrowRight />
            </button>
          </div>
        </div>
        <div className="work-tabs" aria-label="Elegir proyecto">
          {projects.map((p, i) => (
            <button
              key={p.id}
              type="button"
              aria-current={active === i ? "true" : undefined}
              onClick={() => select(i)}
            >
              <span>0{i + 1}</span>
              {p.name}
              <ArrowUpRight aria-hidden="true" />
            </button>
          ))}
        </div>
        <div
          ref={viewport}
          className="work-viewport"
          role="region"
          aria-label="Proyectos"
          aria-roledescription="carrusel"
          tabIndex={0}
          onPointerDown={(e) => {
            if (e.pointerType === "mouse" && e.button !== 0) return;
            drag.current = {
              x: e.clientX,
              y: e.clientY,
              moved: false,
              down: true,
            };
          }}
          onPointerMove={(e) => {
            if (!drag.current.down || !track.current || !viewport.current)
              return;
            const dx = e.clientX - drag.current.x,
              dy = e.clientY - drag.current.y;
            if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy)) {
              drag.current.moved = true;
              e.currentTarget.setPointerCapture(e.pointerId);
              gsap.killTweensOf(track.current);
              gsap.set(track.current, {
                x: -active * viewport.current.clientWidth + dx * 0.8,
              });
            }
          }}
          onPointerUp={pointerUp}
          onPointerCancel={(e) => {
            drag.current.down = false;
            drag.current.moved = true;
            if (e.currentTarget.hasPointerCapture(e.pointerId))
              e.currentTarget.releasePointerCapture(e.pointerId);
            gsap.to(track.current, {
              x: -active * viewport.current!.clientWidth,
              duration: 0.2,
            });
          }}
          onClickCapture={(e) => {
            if (drag.current.moved) {
              e.stopPropagation();
              drag.current.moved = false;
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
              e.preventDefault();
              select(active + (e.key === "ArrowRight" ? 1 : -1));
            }
          }}
        >
          <div ref={track} className="work-track">
            {projects.map((p, i) => (
              <article
                key={p.id}
                className={`work-slide work-slide--${p.theme}`}
                aria-hidden={i !== active}
                inert={i !== active}
              >
                <div className="work-preview">
                  <button
                    type="button"
                    className="work-image-button"
                    aria-label={`Ver detalles del proyecto ${p.name}`}
                    onClick={(e) => {
                      opener.current = e.currentTarget;
                      setSelected(p);
                    }}
                  >
                    <span className="work-browser">
                      <span />
                      <span />
                      <span />
                      <small>{new URL(p.url).pathname}</small>
                    </span>
                    <img
                      src={p.desktopImage}
                      alt={`Sitio de ${p.name} en computadora`}
                      width="1440"
                      height="900"
                      loading="lazy"
                      draggable={false}
                    />
                    <span className="work-image-hint">
                      Ver el proyecto <ArrowUpRight aria-hidden="true" />
                    </span>
                  </button>
                  <img
                    className="work-phone"
                    src={p.mobileImage}
                    alt={`Sitio de ${p.name} en teléfono`}
                    width="390"
                    height="780"
                    loading="lazy"
                    draggable={false}
                  />
                </div>
                <div className="work-info">
                  <span className="eyebrow">
                    0{i + 1} / {p.category}
                  </span>
                  <h3>{p.name}</h3>
                  <p>{p.description}</p>
                  <ul>
                    {p.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  <a
                    className="work-live"
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Abrir sitio <ArrowUpRight aria-hidden="true" />
                  </a>
                  <button
                    className="work-details"
                    type="button"
                    onClick={(e) => {
                      opener.current = e.currentTarget;
                      setSelected(p);
                    }}
                  >
                    Ver detalles
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
        <p className="work-caption">
          Diseño & desarrollo por Tobias Ponce de Leon{" "}
          <span>Deslizá o usá las flechas para explorar →</span>
        </p>
      </div>
      {selected && <ProjectModal project={selected} onClose={close} />}
    </section>
  );
}
