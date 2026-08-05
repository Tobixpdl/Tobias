import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { BrandMark } from "../BrandMark/BrandMark";

gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);

const desktopPath =
  "M 82 40 C 190 180 875 570 655 830 S 145 1140 255 1510 S 860 1770 770 2130 S 150 2440 250 2820 S 850 3160 755 3490 S 240 3830 470 4180 S 790 4390 870 4560";

const mobilePath =
  "M 92 42 C 180 190 900 650 805 910 S 130 1240 190 1580 S 870 1900 820 2240 S 125 2550 180 2920 S 890 3240 820 3570 S 145 3920 260 4210 S 770 4450 850 4570";

export function ScrollJourney() {
  const root = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const orb = useRef<HTMLDivElement>(null);
  const core = useRef<HTMLDivElement>(null);
  const mobile = useMediaQuery("(max-width: 700px)");
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (!root.current || !path.current || !orb.current || !core.current || reducedMotion) return;
    const startSection = document.getElementById("inicio");
    const endSection = document.getElementById("contacto");
    if (!startSection || !endSection) return;
    const pathElement = path.current;
    const orbElement = orb.current;
    const coreElement = core.current;

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: startSection,
          endTrigger: endSection,
          start: "top top",
          end: "bottom bottom",
          invalidateOnRefresh: true,
          scrub: 1.05,
        },
      });

      timeline
        .fromTo(
          pathElement,
          { strokeDasharray: 1, strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 1 },
          0,
        )
        .to(
          orbElement,
          {
            duration: 1,
            motionPath: {
              align: pathElement,
              alignOrigin: [0.5, 0.5],
              autoRotate: false,
              path: pathElement,
            },
          },
          0,
        )
        .to(coreElement, { rotate: 45, scale: 1.35, duration: 0.12 }, 0.08)
        .to(coreElement, { rotate: 105, scale: 0.78, duration: 0.13 }, 0.22)
        .to(coreElement, { rotate: 180, scale: 1.15, duration: 0.14 }, 0.38)
        .to(coreElement, { rotate: 250, scale: 0.7, duration: 0.12 }, 0.56)
        .to(coreElement, { rotate: 325, scale: 1.28, duration: 0.14 }, 0.7)
        .to(coreElement, { rotate: 405, scale: 0.9, duration: 0.15 }, 0.85);
    }, root);

    return () => context.revert();
  }, [mobile, reducedMotion]);

  return (
    <div ref={root} className={`scroll-journey${reducedMotion ? " scroll-journey--static" : ""}`} aria-hidden="true">
      <svg className="scroll-journey__svg" viewBox="0 0 1000 4640" preserveAspectRatio="none">
        <defs>
          <linearGradient id="journey-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ff6b35" />
            <stop offset="0.48" stopColor="#2ec4b6" />
            <stop offset="1" stopColor="#ff8a5f" />
          </linearGradient>
        </defs>
        <path className="scroll-journey__ghost" d={mobile ? mobilePath : desktopPath} pathLength="1" />
        <path ref={path} className="scroll-journey__path" d={mobile ? mobilePath : desktopPath} pathLength="1" />
      </svg>
      {!reducedMotion && (
        <div ref={orb} className="journey-orb">
          <div ref={core} className="journey-orb__core"><BrandMark journey /></div>
        </div>
      )}
    </div>
  );
}
