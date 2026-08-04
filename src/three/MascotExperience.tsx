import { lazy, Suspense, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { MascotFallback } from "./MascotFallback";

const MascotScene = lazy(() => import("./MascotScene"));
gsap.registerPlugin(ScrollTrigger);

function isLowPowerDevice() {
  const nav = navigator as Navigator & { deviceMemory?: number };
  return (nav.deviceMemory !== undefined && nav.deviceMemory <= 2) || navigator.hardwareConcurrency <= 4;
}

export function MascotExperience() {
  const journey = useRef<HTMLDivElement>(null);
  const [pose, setPose] = useState(0);
  const [fallback, setFallback] = useState(true);
  const [desktop, setDesktop] = useState(() => window.matchMedia("(min-width: 801px)").matches);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const media = window.matchMedia("(min-width: 801px)");
    const update = () => {
      setDesktop(media.matches);
      setFallback(reducedMotion || !media.matches || isLowPowerDevice());
    };
    update();
    const onChange = () => update();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [reducedMotion]);

  useLayoutEffect(() => {
    if (!journey.current || reducedMotion || !desktop) return;
    const context = gsap.context(() => {
      gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: "#inicio",
          endTrigger: "#contacto",
          start: "top top",
          end: "bottom bottom",
          scrub: 1.15,
        },
      })
        .to(journey.current, { xPercent: -92, yPercent: 14, scale: 0.78, rotation: -3, duration: 1.1 })
        .to(journey.current, { xPercent: -10, yPercent: 23, scale: 0.72, rotation: 2, duration: 1.2 })
        .to(journey.current, { xPercent: -88, yPercent: 18, scale: 0.7, rotation: -2, duration: 1.1 })
        .to(journey.current, { xPercent: -28, yPercent: 30, scale: 0.66, rotation: 1, duration: 1.25 });

      [
        ["#inicio", 0],
        ["#servicios", 1],
        ["#planes", 2],
        ["#trabajos", 3],
        ["#contacto", 4],
      ].forEach(([selector, nextPose]) => {
        ScrollTrigger.create({
          trigger: selector as string,
          start: "top center",
          end: "bottom center",
          onEnter: () => setPose(nextPose as number),
          onEnterBack: () => setPose(nextPose as number),
        });
      });
    });
    return () => context.revert();
  }, [desktop, reducedMotion]);

  return (
    <div ref={journey} className="mascot-journey" aria-label="Guía visual del recorrido" role="img">
      <div className="mascot-journey__halo" />
      <div className="mascot-journey__badge"><span />Sitio en construcción</div>
      {fallback ? (
        <MascotFallback />
      ) : (
        <Suspense fallback={<MascotFallback />}>
          <MascotScene pose={pose} reducedMotion={reducedMotion} />
        </Suspense>
      )}
    </div>
  );
}
