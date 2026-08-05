import {
  BadgeDollarSign,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CalendarOff,
  Coffee,
  CreditCard,
  Gauge,
  Globe2,
  GraduationCap,
  Hammer,
  HeartPulse,
  Hotel,
  MessageCircle,
  MonitorSmartphone,
  PlugZap,
  Scissors,
  ShoppingBag,
  Store,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { type PointerEvent, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";

type SliderItem = readonly [LucideIcon, string];

const industries: SliderItem[] = [
  [Coffee, "Gastronomía"],
  [Store, "Comercios"],
  [BriefcaseBusiness, "Profesionales"],
  [Hammer, "Oficios"],
  [Wrench, "Servicios"],
  [ShoppingBag, "Emprendimientos"],
  [Building2, "Inmobiliarias"],
  [HeartPulse, "Salud y bienestar"],
  [GraduationCap, "Educación"],
  [Hotel, "Turismo y hotelería"],
  [Scissors, "Belleza y estética"],
  [CalendarDays, "Eventos"],
];

const perks: SliderItem[] = [
  [PlugZap, "Servicios externos"],
  [CreditCard, "Integrá Mercado Pago"],
  [BadgeDollarSign, "Abonás una única vez"],
  [CalendarOff, "Sin mensualidad obligatoria"],
  [MessageCircle, "Pedidos por WhatsApp"],
  [MonitorSmartphone, "Responsive en todo dispositivo"],
  [Gauge, "Carga rápida"],
  [Globe2, "Tu propio dominio"],
];

type MarqueeRowProps = {
  items: SliderItem[];
  direction: "left" | "right";
  label: string;
  variant: "industries" | "perks";
};

function SliderBadge({ item: [Icon, label], hidden = false }: { item: SliderItem; hidden?: boolean }) {
  return (
    <span className="industry-badge" aria-hidden={hidden || undefined}>
      <i className="industry-badge__icon"><Icon aria-hidden="true" /></i>
      <b>{label}</b>
      <i className="industry-badge__spark" />
    </span>
  );
}

function MarqueeRow({ items, direction, label, variant }: MarqueeRowProps) {
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
      const autoFactor = waiting ? 0 : hovered.current ? 0.14 : 1;
      const autoSpeed = (direction === "left" ? -0.48 : 0.44) * autoFactor * frame;

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
    pointer.current = { active: true, lastX: event.clientX, lastTime: performance.now(), velocity: 0, resumeAt: Number.POSITIVE_INFINITY };
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
    pointer.current.resumeAt = performance.now() + 1050;
    event.currentTarget.classList.remove("is-dragging");
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  const repeatedItems = [...items, ...items];

  return (
    <div className={`industries-slider__lane industries-slider__lane--${variant}`}>
      <div className="industries-slider__lane-label"><span>{variant === "industries" ? "01" : "02"}</span>{label}</div>
      <div
        className={`industries-slider__row industries-slider__row--${direction}`}
        aria-label={label}
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
              {repeatedItems.map((item, index) => (
                <SliderBadge key={`${item[1]}-${groupIndex}-${index}`} item={item} hidden={groupIndex > 0 || index >= items.length} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function IndustriesSlider() {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <div className="industries-slider industries-slider--reduced">
        <div className="industries-slider__lane">
          <div className="industries-slider__lane-label"><span>01</span>Rubros</div>
          <div className="industries-slider__static">{industries.map((item) => <SliderBadge key={item[1]} item={item} />)}</div>
        </div>
        <div className="industries-slider__lane industries-slider__lane--perks">
          <div className="industries-slider__lane-label"><span>02</span>Lo que incluye tu web</div>
          <div className="industries-slider__static">{perks.map((item) => <SliderBadge key={item[1]} item={item} />)}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="industries-slider">
      <MarqueeRow items={industries} direction="left" label="Rubros que pueden crecer con una web" variant="industries" />
      <MarqueeRow items={perks} direction="right" label="Lo que puede incluir tu web" variant="perks" />
    </div>
  );
}
