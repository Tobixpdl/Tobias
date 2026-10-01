import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { refreshAfterAssets } from "../../utils/animation";
import { BrandMark } from "../BrandMark/BrandMark";
gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);
export function ScrollJourney() {
  const orb = useRef<HTMLDivElement>(null),
    core = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useLayoutEffect(() => {
    if (reduced || !orb.current || !core.current) return;
    const origin = document.querySelector<HTMLImageElement>(
      '[data-journey-dock="origin"] img',
    )!;
    const destination = document.querySelector<HTMLImageElement>(
      '[data-journey-dock="destination"] img',
    )!;
    const sprite = orb.current,
      face = core.current;
    let timeline: gsap.core.Timeline | undefined,
      trigger: ScrollTrigger | undefined;
    let frame = 0,
      disposed = false;
    const build = () => {
      if (disposed) return;
      trigger?.kill();
      timeline?.kill();
      const start = origin.getBoundingClientRect(),
        finish = destination.getBoundingClientRect();
      const headerBottom = origin
        .closest("header")!
        .getBoundingClientRect().bottom;
      const max = ScrollTrigger.maxScroll(window);
      if (!max) return;
      const size = start.width,
        scale = window.innerWidth < 1120 ? 0.64 : 1;
      const shell = document.querySelector(".shell")!.getBoundingClientRect();
      const rail = Math.max((size * scale) / 2 + 2, shell.left / 2);
      const initial = {
        x: start.left + start.width / 2,
        y: start.top + start.height / 2,
      };
      // Seed the proxy and DOM before MotionPath can render or reveal them.
      const position = { ...initial };
      const entry = Math.min(max * 0.15, headerBottom + size * 3);
      const restY = headerBottom + size * 1.5;
      const end = {
        x: finish.left + finish.width / 2,
        y: finish.top + scrollY + finish.height / 2,
      };
      const exit = Math.max(entry, max - (innerHeight - headerBottom) * 0.55);
      const paint = () => {
        const progress = timeline!.progress();
        const traveling = progress > 0 && progress < 1;
        // Position and visibility share one frame; Lenis supplies the smoothing.
        gsap.set(sprite, {
          x: position.x,
          y: position.y - scrollY,
          opacity: traveling ? 1 : 0,
        });
        gsap.set(origin, { opacity: progress > 0 ? 0 : 1 });
        gsap.set(destination, { opacity: progress < 1 ? 0 : 1 });
      };
      gsap.set(sprite, {
        width: size,
        height: size,
        xPercent: -50,
        yPercent: -50,
        x: initial.x,
        y: initial.y,
        scale: 1,
        opacity: 0,
        transformOrigin: "50% 50%",
      });
      gsap.set(face, { rotation: 0 });
      timeline = gsap.timeline({ paused: true });
      timeline
        .to(
          position,
          {
            motionPath: {
              path: [
                initial,
                { x: initial.x, y: headerBottom + size },
                { x: rail, y: entry + restY },
              ],
              fromCurrent: false,
              curviness: 0.5,
            },
            duration: entry / max,
            ease: "none",
          },
          0,
        )
        .to(
          position,
          {
            x: rail,
            y: exit + restY,
            duration: (exit - entry) / max,
            ease: "none",
          },
          entry / max,
        )
        .to(
          position,
          {
            motionPath: {
              path: [{ x: rail, y: exit + restY }, { x: rail, y: end.y }, end],
              fromCurrent: false,
              curviness: 0.35,
            },
            duration: (max - exit) / max,
            ease: "none",
          },
          exit / max,
        )
        .to(sprite, { scale, duration: entry / max, ease: "none" }, 0)
        .to(
          sprite,
          { scale: 1, duration: (max - exit) / max, ease: "none" },
          exit / max,
        )
        .to(face, { rotation: -5, duration: entry / max, ease: "none" }, 0)
        .to(
          face,
          { rotation: 0, duration: (max - exit) / max, ease: "none" },
          exit / max,
        );
      trigger = ScrollTrigger.create({
        start: 0,
        end: () => ScrollTrigger.maxScroll(window),
        onUpdate: (self) => {
          timeline!.progress(self.progress);
          paint();
        },
      });
      timeline.progress(gsap.utils.clamp(0, 1, scrollY / max));
      paint();
    };
    const schedule = () => {
      if (disposed) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(build);
    };
    // Wait for child layout effects, fonts, images and pin measurements.
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(build);
    });
    const observer = new ResizeObserver(schedule);
    observer.observe(document.querySelector("main")!);
    observer.observe(origin.closest("header")!);
    observer.observe(destination);
    window.addEventListener("resize", schedule);
    window.addEventListener("layout:changed", schedule);
    ScrollTrigger.addEventListener("refresh", schedule);
    const stopAssets = refreshAfterAssets(schedule);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      stopAssets();
      window.removeEventListener("resize", schedule);
      window.removeEventListener("layout:changed", schedule);
      ScrollTrigger.removeEventListener("refresh", schedule);
      trigger?.kill();
      timeline?.kill();
      gsap.set([origin, destination], { clearProps: "opacity" });
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
