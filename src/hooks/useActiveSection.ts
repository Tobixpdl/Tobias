import { useEffect, useState } from "react";
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? "inicio");
  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    let frame = 0;
    const update = () => {
      frame = 0;
      const header = document
        .querySelector("header")!
        .getBoundingClientRect().bottom;
      const current = sections
        .filter((section) => section.getBoundingClientRect().top <= header + 48)
        .at(-1);
      setActive(current?.id ?? ids[0]);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("layout:changed", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("layout:changed", schedule);
    };
  }, [ids]);
  return active;
}
