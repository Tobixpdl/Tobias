import { type RefObject, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "./useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const arsFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

function revealFrom(type: string, index: number) {
  if (type === "left") return { x: -58, rotate: -1.5 };
  if (type === "right") return { x: 58, rotate: 1.5 };
  if (type === "scale") return { scale: 0.86, rotate: index % 2 ? 1.5 : -1.5 };
  if (type === "clip") return { y: 42, clipPath: "inset(0 0 100% 0 round 18px)" };
  if (type === "split") return { x: index % 2 ? 34 : -34, filter: "blur(8px)" };
  return { y: 38, filter: "blur(7px)" };
}

export function useGsapContext(root: RefObject<HTMLElement | null>) {
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (!root.current || reducedMotion) return;

    const cleanups: Array<() => void> = [];
    const context = gsap.context(() => {
      ScrollTrigger.config({ ignoreMobileResize: true });

      const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      heroTimeline
        .from(".site-header__inner", { y: -18, opacity: 0, duration: 0.6 })
        .from("[data-hero-eyebrow]", { y: 18, opacity: 0, filter: "blur(8px)", duration: 0.65 })
        .from(
          "[data-hero-line]",
          { yPercent: 118, rotateX: -18, opacity: 0, transformOrigin: "left bottom", duration: 0.95, stagger: 0.11 },
          "-=0.38",
        )
        .from("[data-hero-copy]", { y: 24, opacity: 0, filter: "blur(7px)", duration: 0.7 }, "-=0.42")
        .from("[data-hero-actions] > *", { y: 20, opacity: 0, scale: 0.94, duration: 0.55, stagger: 0.09 }, "-=0.42")
        .from("[data-hero-meta]", { x: -18, opacity: 0, duration: 0.48, stagger: 0.08 }, "-=0.25")
        .from(
          "[data-hero-visual]",
          { clipPath: "inset(16% 15% 16% 15% round 48px)", scale: 0.9, opacity: 0, rotate: 2.4, duration: 1.15 },
          0.2,
        )
        .from(".hero-blueprint__canvas > span, .hero-blueprint__cards i", { scaleX: 0, transformOrigin: "left", duration: 0.45, stagger: 0.05 }, "-=0.65")
        .from(".stage-card", { y: 16, scale: 0.88, opacity: 0, duration: 0.55, stagger: 0.1 }, "-=0.5");

      gsap.to(".stage-grid", { rotate: 354, duration: 38, ease: "none", repeat: -1 });
      gsap.to(".stage-orbit--one", { rotate: 360, duration: 9, ease: "none", repeat: -1 });
      gsap.to(".stage-orbit--two", { scale: 1.7, opacity: 0.35, duration: 2.4, ease: "sine.inOut", repeat: -1, yoyo: true });
      gsap.to(".hero__aurora--orange", { scale: 1.18, xPercent: 7, duration: 5.5, ease: "sine.inOut", repeat: -1, yoyo: true });
      gsap.to(".hero__aurora--teal", { scale: 1.14, yPercent: -7, duration: 6.5, ease: "sine.inOut", repeat: -1, yoyo: true });

      const hero = root.current?.querySelector<HTMLElement>(".hero");
      const pointerLayers = gsap.utils.toArray<HTMLElement>("[data-pointer-depth]");
      if (hero && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        const layerSetters = pointerLayers.map((layer) => ({
          depth: Number(layer.dataset.pointerDepth ?? 0.4),
          x: gsap.quickTo(layer, "x", { duration: 0.8, ease: "power3.out" }),
          y: gsap.quickTo(layer, "y", { duration: 0.8, ease: "power3.out" }),
        }));
        const onPointerMove = (event: PointerEvent) => {
          const horizontal = event.clientX / window.innerWidth - 0.5;
          const vertical = event.clientY / window.innerHeight - 0.5;
          layerSetters.forEach((setter) => {
            setter.x(horizontal * 24 * setter.depth);
            setter.y(vertical * 18 * setter.depth);
          });
        };
        const onPointerLeave = () => layerSetters.forEach((setter) => {
          setter.x(0);
          setter.y(0);
        });
        hero.addEventListener("pointermove", onPointerMove);
        hero.addEventListener("pointerleave", onPointerLeave);
        cleanups.push(() => {
          hero.removeEventListener("pointermove", onPointerMove);
          hero.removeEventListener("pointerleave", onPointerLeave);
        });
      }

      gsap.utils.toArray<HTMLElement>(".section-title").forEach((title, index) => {
        const eyebrow = title.querySelector(".eyebrow");
        const heading = title.querySelector("h2");
        const description = title.querySelector(".section-title__description");
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: title, start: "top 84%", once: true },
        });
        timeline
          .from(eyebrow, { x: index % 2 ? 26 : -26, opacity: 0, duration: 0.52, ease: "power2.out" })
          .from(
            heading,
            { yPercent: 36, opacity: 0, filter: "blur(10px)", clipPath: "inset(0 0 100% 0)", duration: 0.85, ease: "power3.out" },
            "-=0.26",
          );
        if (description) {
          timeline.from(description, { y: 22, opacity: 0, duration: 0.62, ease: "power2.out" }, "-=0.42");
        }
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]:not(.section-title)").forEach((element, index) => {
        const type = element.dataset.reveal || "default";
        gsap.from(element, {
          ...revealFrom(type, index),
          opacity: 0,
          duration: type === "clip" ? 1 : 0.78,
          ease: "power3.out",
          clearProps: "transform,filter,clipPath,opacity",
          scrollTrigger: { trigger: element, start: "top 87%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((container) => {
        const isServices = container.classList.contains("services__list");
        const isProcess = container.classList.contains("process__steps");
        const isBenefits = container.classList.contains("benefits__grid");
        gsap.from(container.children, {
          x: isServices || isProcess ? 46 : 0,
          y: isServices || isProcess ? 0 : 54,
          rotate: isBenefits ? (index: number) => (index % 2 ? 1.5 : -1.5) : 0,
          rotateY: container.classList.contains("plans__grid") ? -8 : 0,
          opacity: 0,
          filter: "blur(7px)",
          duration: 0.78,
          stagger: isProcess ? 0.1 : 0.085,
          ease: "power3.out",
          clearProps: "transform,filter,opacity",
          scrollTrigger: { trigger: container, start: "top 82%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-line]").forEach((line) => {
        gsap.fromTo(
          line,
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: "top center",
            duration: 0.8,
            ease: "power2.inOut",
            scrollTrigger: { trigger: line, start: "top 84%", once: true },
          },
        );
      });

      const interfacePanel = root.current?.querySelector<HTMLElement>(".interface-panel");
      if (interfacePanel) {
        gsap.fromTo(
          interfacePanel,
          { yPercent: 8, rotate: -2.4 },
          { yPercent: -8, rotate: 1.3, ease: "none", scrollTrigger: { trigger: ".services", start: "top bottom", end: "bottom top", scrub: 1.1 } },
        );
      }

      const portfolioViewport = root.current?.querySelector<HTMLElement>(".portfolio__viewport");
      if (portfolioViewport) {
        gsap.from(portfolioViewport, {
          y: 65,
          scale: 0.94,
          opacity: 0,
          filter: "blur(11px)",
          duration: 1.05,
          ease: "power3.out",
          clearProps: "transform,filter,opacity",
          scrollTrigger: { trigger: portfolioViewport, start: "top 88%", once: true },
        });
        gsap.from(".portfolio__navigation > *, .carousel-controls > *", {
          y: 18,
          opacity: 0,
          duration: 0.58,
          stagger: 0.07,
          ease: "power2.out",
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: portfolioViewport, start: "top 82%", once: true },
        });
        gsap.to(".portfolio__ambient i:nth-child(1)", { rotate: 80, yPercent: -12, ease: "none", scrollTrigger: { trigger: ".portfolio", start: "top bottom", end: "bottom top", scrub: 1.2 } });
        gsap.to(".portfolio__ambient i:nth-child(3)", { rotate: -70, yPercent: 10, ease: "none", scrollTrigger: { trigger: ".portfolio", start: "top bottom", end: "bottom top", scrub: 1.5 } });
      }

      gsap.from(".faq details", {
        x: 42,
        opacity: 0,
        duration: 0.68,
        stagger: 0.075,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: ".faq__list", start: "top 82%", once: true },
      });

      gsap.from(".contact-form label, .contact-form__footer", {
        y: 22,
        opacity: 0,
        duration: 0.55,
        stagger: 0.055,
        ease: "power2.out",
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: ".contact-form", start: "top 80%", once: true },
      });

      gsap.to(".contact__backdrop span:nth-child(1)", { rotate: 55, yPercent: -8, ease: "none", scrollTrigger: { trigger: ".contact", start: "top bottom", end: "bottom top", scrub: 1.2 } });
      gsap.to(".contact__backdrop span:nth-child(2)", { rotate: -42, xPercent: -10, ease: "none", scrollTrigger: { trigger: ".contact", start: "top bottom", end: "bottom top", scrub: 1.5 } });

      gsap.from(".footer__top > *, .footer__links > *, .footer__bottom > *", {
        y: 28,
        opacity: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: ".footer", start: "top 88%", once: true },
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
        const amount = Number(element.dataset.parallax ?? 10);
        gsap.fromTo(
          element,
          { yPercent: amount * -0.5 },
          { yPercent: amount * 0.5, ease: "none", scrollTrigger: { trigger: element.parentElement, start: "top bottom", end: "bottom top", scrub: 1 } },
        );
      });

      gsap.utils.toArray<HTMLElement>(".section").forEach((section) => {
        gsap.fromTo(
          section,
          { "--section-sweep": "0%" },
          { "--section-sweep": "100%", ease: "none", scrollTrigger: { trigger: section, start: "top 90%", end: "top 35%", scrub: true } },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-counter-value]").forEach((element) => {
        const target = Number(element.dataset.counterValue);
        const counter = { value: 0 };
        ScrollTrigger.create({
          trigger: element,
          start: "top 92%",
          once: true,
          onEnter: () => {
            gsap.to(counter, {
              value: target,
              duration: 1.25,
              ease: "power2.out",
              snap: { value: 1000 },
              onUpdate: () => { element.textContent = arsFormatter.format(counter.value); },
            });
          },
        });
      });

      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        gsap.utils.toArray<HTMLElement>("[data-tilt-card]").forEach((card) => {
          const rotateX = gsap.quickTo(card, "rotationX", { duration: 0.55, ease: "power3.out" });
          const rotateY = gsap.quickTo(card, "rotationY", { duration: 0.55, ease: "power3.out" });
          const onMove = (event: PointerEvent) => {
            const bounds = card.getBoundingClientRect();
            const x = (event.clientX - bounds.left) / bounds.width;
            const y = (event.clientY - bounds.top) / bounds.height;
            card.style.setProperty("--spot-x", `${x * 100}%`);
            card.style.setProperty("--spot-y", `${y * 100}%`);
            rotateX((0.5 - y) * 3.5);
            rotateY((x - 0.5) * 4.5);
          };
          const onLeave = () => {
            rotateX(0);
            rotateY(0);
          };
          card.addEventListener("pointermove", onMove);
          card.addEventListener("pointerleave", onLeave);
          cleanups.push(() => {
            card.removeEventListener("pointermove", onMove);
            card.removeEventListener("pointerleave", onLeave);
          });
        });

        gsap.utils.toArray<HTMLElement>(".button").filter((button) => !button.closest(".plan-card")).forEach((button) => {
          const moveX = gsap.quickSetter(button, "--magnet-x") as (value: string) => void;
          const moveY = gsap.quickSetter(button, "--magnet-y") as (value: string) => void;
          const onMove = (event: PointerEvent) => {
            const bounds = button.getBoundingClientRect();
            moveX(`${(event.clientX - bounds.left - bounds.width / 2) * 0.12}px`);
            moveY(`${(event.clientY - bounds.top - bounds.height / 2) * 0.14}px`);
          };
          const onLeave = () => {
            moveX("0px");
            moveY("0px");
          };
          button.addEventListener("pointermove", onMove);
          button.addEventListener("pointerleave", onLeave);
          cleanups.push(() => {
            button.removeEventListener("pointermove", onMove);
            button.removeEventListener("pointerleave", onLeave);
          });
        });
      }
    }, root);

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      context.revert();
    };
  }, [reducedMotion, root]);

  return reducedMotion;
}
