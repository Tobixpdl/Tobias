import {
  BriefcaseBusiness,
  Coffee,
  Hammer,
  ShoppingBag,
  Store,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { type PointerEvent, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";

type Industry = readonly [LucideIcon, string];

const industries: Industry[] = [
  [Coffee, "Gastronomía"],
  [Store, "Comercios"],
  [BriefcaseBusiness, "Profesionales"],
  [Hammer, "Oficios"],
  [Wrench, "Servicios"],
  [ShoppingBag, "Emprendimientos"],
];

type MarqueeRowProps = {
  items: Industry[];
  direction: "left" | "right";
  decorative?: boolean;
};

function IndustryBadge({ industry: [Icon, label], hidden = false }: { industry: Industry; hidden?: boolean }) {
  return (
    <span className="industry-badge" aria-hidden={hidden || undefined}>
      <i className="industry-badge__icon"><Icon aria-hidden="true" /></i>
      <b>{label}</b>
      <i className="industry-badge__spark" />
    </span>
  );
}

function MarqueeRow({ items, direction, decorative }: MarqueeRowProps) {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const group = useRef<HTMLDivElement>(null);
  const position = useRef(direction === "left" ? 0 : -1);
  const width = useRef(1);
  const hovered = useRef(false);
  const pointer = useRef({ active: false, lastX: 0, lastTime: 0, velocity: 0, resumeAt: 0 });

  useLayoutEffect(() => {
    if (!track.current || !group.current) return;

    const measure = () => {
      width.current = Math.max(1, group.current?.getBoundingClientRect().width ?? 1);
      if (direction === "right" && position.current === -1) position.current = -width.current;
    };
    const observer = new ResizeObserver(measure);
    observer.observe(group.current);
    measure();

    const tick = () => {
      if (!track.current || pointer.current.active) return;
      const frame = gsap.ticker.deltaRatio(60);
      const waiting = performance.now() < pointer.current.resumeAt;
      const autoFactor = waiting ? 0 : hovered.current ? 0.16 : 1;
      const autoSpeed = (direction === "left" ? -0.58 : 0.58) * autoFactor * frame;

      if (Math.abs(pointer.current.velocity) > 0.02) {
        position.current += pointer.current.velocity * frame;
        pointer.current.velocity *= Math.pow(0.92, frame);
      }
      position.current += autoSpeed;
      position.current = gsap.utils.wrap(-width.current, 0, position.current);
      gsap.set(track.current, { x: position.current, force3D: true });
    };

    gsap.ticker.add(tick);
    return () => {
      observer.disconnect();
      gsap.ticker.remove(tick);
    };
  }, [direction]);

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointer.current = {
      active: true,
      lastX: event.clientX,
      lastTime: performance.now(),
      velocity: 0,
      resumeAt: Number.POSITIVE_INFINITY,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.classList.add("is-dragging");
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!pointer.current.active || !track.current) return;
    const now = performance.now();
    const deltaX = event.clientX - pointer.current.lastX;
    const deltaTime = Math.max(8, now - pointer.current.lastTime);
    position.current = gsap.utils.wrap(-width.current, 0, position.current + deltaX);
    pointer.current.velocity = (deltaX / deltaTime) * 16.67;
    pointer.current.lastX = event.clientX;
    pointer.current.lastTime = now;
    gsap.set(track.current, { x: position.current, force3D: true });
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    pointer.current.active = false;
    pointer.current.resumeAt = performance.now() + 1100;
    event.currentTarget.classList.remove("is-dragging");
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  const repeatedItems = [...items, ...items];

  return (
    <div
      ref={viewport}
      className={`industries-slider__row industries-slider__row--${direction}`}
      aria-hidden={decorative || undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onMouseEnter={() => { hovered.current = true; }}
      onMouseLeave={() => { hovered.current = false; }}
    >
      <div ref={track} className="industries-slider__track">
        {[0, 1].map((groupIndex) => (
          <div ref={groupIndex === 0 ? group : undefined} className="industries-slider__group" key={groupIndex}>
            {repeatedItems.map((industry, index) => (
              <IndustryBadge
                key={`${industry[1]}-${groupIndex}-${index}`}
                industry={industry}
                hidden={decorative || groupIndex > 0 || index >= items.length}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function IndustriesSlider() {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <div className="industries-slider industries-slider--reduced" role="list">
        {industries.map((industry) => <IndustryBadge key={industry[1]} industry={industry} />)}
      </div>
    );
  }

  const reversed = [...industries.slice(3), ...industries.slice(0, 3)];

  return (
    <div className="industries-slider" aria-label="Rubros con los que trabajo">
      <MarqueeRow items={industries} direction="left" />
      <MarqueeRow items={reversed} direction="right" decorative />
    </div>
  );
}
