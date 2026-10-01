import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { BrandMark } from "../BrandMark/BrandMark";
gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);

export function ScrollJourney() {
  const orb = useRef<HTMLDivElement>(null);
  const core = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useLayoutEffect(() => {
    if (reduced || !orb.current || !core.current) return;
    const origin = document.querySelector<HTMLElement>(
      '[data-journey-dock="origin"]',
    );
    const destination = document.querySelector<HTMLElement>(
      '[data-journey-dock="destination"]',
    );
    if (!origin || !destination) return;
    const image = origin.querySelector("img");
    const endImage = destination.querySelector("img");
    const sprite = orb.current;
    const face = core.current;
    const position = { x: 0, y: 0 };
    let timeline: gsap.core.Timeline | undefined;
    let frame = 0;
    let previousWidth = window.innerWidth;
    let disposed = false;
    const build = () => {
      const progress = timeline?.scrollTrigger?.progress ?? 0;
      timeline?.scrollTrigger?.kill();
      timeline?.kill();
      const start = origin.getBoundingClientRect();
      const finish = destination.getBoundingClientRect();
      const small = window.innerWidth < 700;
      const size = start.width;
      const travelScale = small ? 0.66 : window.innerWidth < 1120 ? 0.55 : 1;
      const startX = start.left + start.width / 2;
      const startY = start.top + start.height / 2;
      const endX = finish.left + finish.width / 2;
      const endY = finish.top + window.scrollY + finish.height / 2;
      const margin =
        (document.documentElement.clientWidth -
          document.querySelector<HTMLElement>(".shell")!.clientWidth) /
        2;
      const rail = margin / 2;
      const headerBottom = origin
        .closest("header")!
        .getBoundingClientRect().bottom;
      const maxScroll = ScrollTrigger.maxScroll(window);
      const stops = [
        "servicios",
        "trabajos",
        "planes",
        "preguntas",
        "contacto",
      ].map((id) => {
        const rect = document.getElementById(id)!.getBoundingClientRect();
        return { x: rail, y: rect.top + window.scrollY + 100 };
      });
      gsap.set(sprite, {
        width: size,
        height: size,
        xPercent: -50,
        yPercent: -50,
        opacity: 0,
        scale: 1,
      });
      timeline = gsap.timeline({
        scrollTrigger: {
          start: 0,
          end: () => ScrollTrigger.maxScroll(window),
          scrub: 0.35,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const traveling = self.progress > 0.0001 && self.progress < 0.9999;
            gsap.set(sprite, { opacity: traveling ? 1 : 0 });
            gsap.set(image, { opacity: self.progress > 0.0001 ? 0 : 1 });
            gsap.set(endImage, { opacity: self.progress < 0.9999 ? 0 : 1 });
          },
        },
      });
      timeline
        .to(
          position,
          {
            motionPath: {
              path: [
                { x: startX, y: startY },
                { x: rail, y: startY + 170 },
                ...stops,
                { x: rail, y: endY - 100 },
                { x: endX, y: endY },
              ],
              curviness: 0.4,
              autoRotate: false,
            },
            duration: 1,
            ease: "none",
            onUpdate: () => {
              const naturalY = position.y - window.scrollY;
              const blend = gsap.utils.clamp(
                0,
                1,
                Math.min(window.scrollY, maxScroll - window.scrollY) / 180,
              );
              const visibleY = gsap.utils.clamp(
                headerBottom + 24,
                window.innerHeight - 110,
                naturalY,
              );
              gsap.set(sprite, {
                x: position.x,
                y: naturalY + (visibleY - naturalY) * blend,
              });
            },
          },
          0,
        )
        .to(
          sprite,
          { scale: travelScale, duration: 0.04, ease: "power2.out" },
          0,
        )
        .to(sprite, { scale: 1, duration: 0.03, ease: "power2.inOut" }, 0.97)
        .to(
          face,
          { rotation: -7, scaleX: 0.96, scaleY: 1.04, duration: 0.12 },
          0.03,
        )
        .to(face, { rotation: 5, scaleX: 1, scaleY: 1, duration: 0.18 }, 0.25)
        .to(face, { rotation: -4, duration: 0.2 }, 0.53)
        .to(face, { rotation: 0, duration: 0.15 }, 0.85);
      gsap.set(image, { opacity: progress > 0.0001 ? 0 : 1 });
      gsap.set(endImage, { opacity: progress < 0.9999 ? 0 : 1 });
      timeline.progress(progress);
      ScrollTrigger.refresh();
    };
    const schedule = () => {
      if (disposed) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(build);
    };
    const resize = () => {
      if (window.innerWidth !== previousWidth) {
        previousWidth = window.innerWidth;
        schedule();
      }
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(document.querySelector("main")!);
    observer.observe(destination);
    window.addEventListener("resize", resize);
    window.addEventListener("layout:changed", schedule);
    document.fonts.ready.then(schedule);
    build();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("layout:changed", schedule);
      timeline?.scrollTrigger?.kill();
      timeline?.kill();
      gsap.set([image, endImage], { clearProps: "opacity" });
    };
  }, [reduced]);
  if (reduced) return null;
  return (
    <div className="scroll-journey" aria-hidden="true">
      <div ref={orb} className="journey-orb">
        <div ref={core} className="journey-orb__core">
          <BrandMark journey />
        </div>
      </div>
    </div>
  );
}
