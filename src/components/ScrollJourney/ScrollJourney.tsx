import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { refreshAfterAssets } from "../../utils/animation";
import { BrandMark } from "../BrandMark/BrandMark";

gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);

// Rest pose: arms hang slightly away from the body (degrees, about each shoulder).
const ARM_REST = { left: -14, right: 14 } as const;
// Pivots expressed in the 0..100 viewBox of the limbs overlay.
const PIVOT_LEFT = "32 55";
const PIVOT_RIGHT = "68 55";
const POINTER_ORIGIN = "68 73";

type Chapter = {
  progress: number;
  poseRight: number;
  poseLeft: number;
  sweep: boolean;
};

export function ScrollJourney() {
  const orb = useRef<HTMLDivElement>(null),
    core = useRef<HTMLDivElement>(null),
    bob = useRef<HTMLDivElement>(null),
    armL = useRef<SVGGElement>(null),
    armR = useRef<SVGGElement>(null),
    pointer = useRef<SVGGElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (
      reduced ||
      !orb.current ||
      !core.current ||
      !bob.current ||
      !armL.current ||
      !armR.current ||
      !pointer.current
    )
      return;

    const bobEl = bob.current;
    const armLeft = armL.current;
    const armRight = armR.current;
    const pointerEl = pointer.current;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    // Gentle idle so the character never looks frozen while it rides along.
    const idle = gsap.to(bobEl, {
      y: -2,
      scaleY: 1.018,
      duration: 2.6,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    // Subtle lean that follows scroll velocity; mobile keeps it calmer.
    let lean = 0;
    let leanWritten = 0;
    let lastY = window.scrollY;
    const leanAmp = finePointer ? 3.2 : 1.6;
    const onTick = () => {
      const v = window.scrollY - lastY;
      lastY = window.scrollY;
      lean += (gsap.utils.clamp(-leanAmp, leanAmp, v * 0.018) - lean) * 0.12;
      const rounded = Math.abs(lean) < 0.05 ? 0 : lean;
      if (rounded !== leanWritten) {
        gsap.set(bobEl, { rotation: rounded });
        leanWritten = rounded;
      }
    };
    gsap.ticker.add(onTick);

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

      // Arms and pointer start tucked away; poses are driven by the timeline.
      gsap.set(armLeft, {
        svgOrigin: PIVOT_LEFT,
        rotation: ARM_REST.left,
        opacity: 0,
      });
      gsap.set(armRight, {
        svgOrigin: PIVOT_RIGHT,
        rotation: ARM_REST.right,
        opacity: 0,
      });
      gsap.set(pointerEl, { svgOrigin: POINTER_ORIGIN, scaleY: 0 });

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

      // Arms ride along once the character leaves the logo, and tuck away
      // before it docks back into the footer logo.
      timeline.to(
        [armLeft, armRight],
        {
          opacity: 1,
          duration: (entry / max) * 0.6,
          ease: "sine.out",
        },
        (entry / max) * 0.35,
      );
      timeline.to(
        [armLeft, armRight],
        {
          opacity: 0,
          duration: ((max - exit) / max) * 0.5,
          ease: "sine.in",
        },
        exit / max + ((max - exit) / max) * 0.12,
      );

      // Presenting moments: the character raises its pointer as key sections
      // pass by, then puts it away. Timings are scroll progress (0..1).
      const chapterProgress = (selector: string): number | null => {
        const el = document.querySelector(selector);
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        const center = rect.top + scrollY + rect.height / 2;
        return gsap.utils.clamp(
          entry / max + 0.045,
          exit / max - 0.045,
          (center - restY) / max,
        );
      };
      const chapters: Chapter[] = [];
      const addChapter = (
        selector: string,
        poseRight: number,
        poseLeft: number,
        sweep: boolean,
      ) => {
        const progress = chapterProgress(selector);
        if (progress == null) return;
        chapters.push({ progress, poseRight, poseLeft, sweep });
      };
      addChapter("#servicios", 225, 100, false);
      addChapter("#trabajos", 270, -30, finePointer);
      addChapter("#contacto", -45, -30, false);
      chapters.sort((a, b) => a.progress - b.progress);
      const MIN_GAP = 0.08;
      for (let i = 1; i < chapters.length; i += 1) {
        if (chapters[i].progress - chapters[i - 1].progress < MIN_GAP) {
          chapters[i].progress = Math.min(
            chapters[i - 1].progress + MIN_GAP,
            exit / max - 0.045,
          );
        }
      }
      const raise = 0.012;
      const hold = 0.04;
      const lower = 0.014;
      chapters.forEach((ch) => {
        const tRaise = ch.progress - raise - hold / 2;
        const tHold = ch.progress - hold / 2;
        const tLower = ch.progress + hold / 2;
        timeline!.to(
          armRight,
          { rotation: ch.poseRight, duration: raise, ease: "sine.inOut" },
          tRaise,
        );
        timeline!.to(
          armLeft,
          { rotation: ch.poseLeft, duration: raise, ease: "sine.inOut" },
          tRaise,
        );
        timeline!.to(
          pointerEl,
          { scaleY: 1, duration: raise, ease: "sine.out" },
          tRaise,
        );
        if (ch.sweep) {
          timeline!.to(
            armRight,
            {
              rotation: ch.poseRight - 22,
              duration: hold / 2,
              ease: "sine.inOut",
            },
            tHold,
          );
          timeline!.to(
            armRight,
            { rotation: ch.poseRight, duration: hold / 2, ease: "sine.inOut" },
            tHold + hold / 2,
          );
        }
        timeline!.to(
          armRight,
          { rotation: ARM_REST.right, duration: lower, ease: "sine.inOut" },
          tLower,
        );
        timeline!.to(
          armLeft,
          { rotation: ARM_REST.left, duration: lower, ease: "sine.inOut" },
          tLower,
        );
        timeline!.to(
          pointerEl,
          { scaleY: 0, duration: lower, ease: "sine.in" },
          tLower,
        );
      });

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
      gsap.ticker.remove(onTick);
      idle.kill();
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
          <div ref={bob} className="journey-bob">
            <BrandMark journey />
            <svg
              className="journey-limbs"
              viewBox="0 0 100 100"
              focusable="false"
            >
              <g ref={armL} className="journey-arm journey-arm--left">
                <rect
                  x="29.6"
                  y="54"
                  width="5"
                  height="15"
                  rx="2.5"
                  fill="#0b0b0c"
                />
                <circle cx="32.1" cy="70.6" r="3.2" fill="#0b0b0c" />
              </g>
              <g ref={armR} className="journey-arm journey-arm--right">
                <g ref={pointer} className="journey-pointer">
                  <line
                    x1="68"
                    y1="71"
                    x2="68"
                    y2="102"
                    stroke="#00d2ea"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <circle cx="68" cy="103.5" r="3.2" fill="#00d2ea" />
                </g>
                <rect
                  x="65.4"
                  y="54"
                  width="5"
                  height="17"
                  rx="2.5"
                  fill="#0b0b0c"
                />
                <circle cx="67.9" cy="72.6" r="3.4" fill="#0b0b0c" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
