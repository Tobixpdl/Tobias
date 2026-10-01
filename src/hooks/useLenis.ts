import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { refreshAfterAssets } from "../utils/animation";
import { useReducedMotion } from "./useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export function useLenis() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    document.documentElement.classList.toggle(
      "is-reduced-motion",
      reducedMotion,
    );

    if (reducedMotion) {
      ScrollTrigger.refresh();
      return () =>
        document.documentElement.classList.remove("is-reduced-motion");
    }

    const lenis = new Lenis({
      anchors: true,
      autoRaf: false,
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.05,
      wheelMultiplier: 0.88,
    });

    const updateScrollTrigger = () => ScrollTrigger.update();
    const refreshScrollTrigger = () => ScrollTrigger.refresh();
    const raf = (time: number) => lenis.raf(time * 1000);
    const navigatePortfolio = (event: Event) =>
      lenis.scrollTo((event as CustomEvent<number>).detail, { duration: 0.65 });
    window.addEventListener("portfolio:navigate", navigatePortfolio);

    lenis.on("scroll", updateScrollTrigger);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    window.addEventListener("layout:changed", refreshScrollTrigger);

    const stopAssetRefresh = refreshAfterAssets(() => ScrollTrigger.refresh());

    return () => {
      stopAssetRefresh();
      lenis.off("scroll", updateScrollTrigger);
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      window.removeEventListener("layout:changed", refreshScrollTrigger);
      lenis.destroy();
      window.removeEventListener("portfolio:navigate", navigatePortfolio);
      document.documentElement.classList.remove("is-reduced-motion");
    };
  }, [reducedMotion]);

  return reducedMotion;
}
