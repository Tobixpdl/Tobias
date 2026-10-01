import { type RefObject, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "./useReducedMotion";
gsap.registerPlugin(ScrollTrigger);

export function useGsapContext(root: RefObject<HTMLElement | null>) {
  const reduced = useReducedMotion();
  useLayoutEffect(() => {
    if (!root.current || reduced) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out", duration: 0.65 } })
        .from("[data-hero-eyebrow]", { opacity: 0, x: -12 })
        .from("[data-hero-line]", { y: 24, opacity: 0, stagger: 0.09 }, 0.12)
        .from(
          "[data-hero-copy], [data-hero-actions], [data-hero-meta]",
          { opacity: 0, y: 12, stagger: 0.08 },
          0.4,
        )
        .from("[data-hero-visual]", { opacity: 0, x: 24 }, 0.2);
      gsap.utils
        .toArray<HTMLElement>(".section-title, [data-reveal]")
        .forEach((el) => {
          gsap.from(el, {
            opacity: 0,
            y: 18,
            duration: 0.55,
            clearProps: "transform,opacity",
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          });
        });
      gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((el) => {
        // Each row has its own trigger: tall mobile lists must never stay invisible.
        [...el.children].forEach((child) =>
          gsap.from(child, {
            opacity: 0,
            x: 14,
            duration: 0.4,
            clearProps: "transform,opacity",
            scrollTrigger: { trigger: child, start: "top 95%", once: true },
          }),
        );
      });
      gsap.fromTo(
        ".hero__work",
        { y: 0 },
        {
          y: -35,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        },
      );
      gsap.fromTo(
        ".hero__signature",
        { rotation: -2 },
        {
          rotation: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        },
      );
      gsap.from(".process__steps", {
        opacity: 0.7,
        y: 20,
        ease: "none",
        scrollTrigger: {
          trigger: "#proceso",
          start: "top 85%",
          end: "top 45%",
          scrub: true,
        },
      });
      gsap.from(".footer__cta", {
        x: -20,
        opacity: 0.5,
        ease: "none",
        scrollTrigger: {
          trigger: ".footer",
          start: "top 90%",
          end: "top 55%",
          scrub: true,
        },
      });
    }, root);
    return () => ctx.revert();
  }, [reduced, root]);
  return reduced;
}
