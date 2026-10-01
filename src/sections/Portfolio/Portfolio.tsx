import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import {
  type PointerEvent,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ProjectModal } from "../../components/ProjectModal/ProjectModal";
import { SectionTitle } from "../../components/SectionTitle/SectionTitle";
import { projects, type Project } from "../../data/projects";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export function Portfolio() {
  const pin = useRef<HTMLDivElement>(null);
  const scrollTrigger = useRef<ScrollTrigger | null>(null);
  const mode = useRef(false);
  const [pinned, setPinned] = useState(false);
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<Project | null>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const drag = useRef({ x: 0, y: 0, moved: false, down: false });
  const reduced = useReducedMotion();
  const select = (index: number) => {
    const next = (index + projects.length) % projects.length;
    if (mode.current && scrollTrigger.current && track.current) {
      const trigger = scrollTrigger.current;
      const slide = track.current.children[next] as HTMLElement;
      const distance =
        track.current.scrollWidth - viewport.current!.clientWidth;
      const ratio = Math.min(slide.offsetLeft, distance) / distance;
      window.dispatchEvent(
        new CustomEvent("portfolio:navigate", {
          detail: trigger.start + ratio * (trigger.end - trigger.start),
        }),
      );
    } else setActive(next);
  };
  useLayoutEffect(() => {
    if (reduced) return;
    const media = gsap.matchMedia();
    media.add("(min-width: 1000px) and (min-height: 780px)", () => {
      mode.current = true;
      setPinned(true);
      const distance = () =>
        Math.max(0, track.current!.scrollWidth - viewport.current!.clientWidth);
      const tween = gsap.to(track.current, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          id: "portfolio-horizontal",
          trigger: pin.current,
          pin: pin.current,
          start: "top 82px",
          end: () => `+=${distance()}`,
          scrub: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const slides = [...track.current!.children] as HTMLElement[];
            const offsets = slides.map((slide) =>
              Math.min(slide.offsetLeft, distance()),
            );
            const current = self.progress * distance();
            const index = offsets.reduce(
              (best, value, i) =>
                Math.abs(value - current) < Math.abs(offsets[best] - current)
                  ? i
                  : best,
              0,
            );
            setActive(index);
            slides.forEach((slide) => {
              const local = gsap.utils.clamp(
                -1,
                1,
                (current - slide.offsetLeft) / slide.clientWidth,
              );
              gsap.set(slide.querySelector(".work-phone"), { y: local * -22 });
              gsap.set(slide.querySelector(".work-number"), { x: local * 24 });
            });
            gsap.set(pin.current!.querySelector(".work-progress"), {
              scaleX: self.progress,
            });
          },
        },
      });
      scrollTrigger.current = tween.scrollTrigger!;
      const refresh = () => ScrollTrigger.refresh();
      const observer = new ResizeObserver(refresh);
      observer.observe(viewport.current!);
      const refreshFrame = requestAnimationFrame(refresh);
      return () => {
        cancelAnimationFrame(refreshFrame);
        observer.disconnect();
        tween.scrollTrigger?.kill();
        tween.kill();
        scrollTrigger.current = null;
        mode.current = false;
        setPinned(false);
        gsap.set(
          [
            track.current,
            ...track.current!.querySelectorAll(".work-phone,.work-number"),
          ],
          { clearProps: "transform" },
        );
      };
    });
    return () => media.revert();
  }, [reduced]);
  useLayoutEffect(() => {
    if (mode.current) return;
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
  }, [active, reduced, pinned]);
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
    // Suppress only the synthetic click following this drag, never the next tap.
    requestAnimationFrame(() => {
      drag.current.moved = false;
    });
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
      <div ref={pin} className={`portfolio-pin${pinned ? " is-pinned" : ""}`}>
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
          <div className="work-progress" aria-hidden="true" />
          <div
            ref={viewport}
            className="work-viewport"
            role="region"
            aria-label="Proyectos"
            aria-roledescription="carrusel"
            tabIndex={0}
            onPointerDown={(e) => {
              if (mode.current) return;
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
              if (mode.current) return;
              drag.current.down = false;
              drag.current.moved = true;
              requestAnimationFrame(() => {
                drag.current.moved = false;
              });
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
                  <span className="work-number" aria-hidden="true">
                    0{i + 1}
                  </span>
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
            <span>
              {pinned
                ? "Seguí bajando para recorrer los trabajos →"
                : "Deslizá o usá las flechas para explorar →"}
            </span>
          </p>
        </div>
      </div>
      {selected && <ProjectModal project={selected} onClose={close} />}
    </section>
  );
}
