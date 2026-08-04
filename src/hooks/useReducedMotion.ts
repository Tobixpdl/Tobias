import { useLayoutEffect, useState } from "react";

const preferenceKey = "tobias-motion-preference";
const preferenceEvent = "motion-preference-change";

type MotionPreference = "full" | "reduce" | "system";
let runtimePreference: MotionPreference = "system";

function readPreference(): MotionPreference {
  if (typeof window === "undefined") return "system";
  try {
    const stored = window.localStorage.getItem(preferenceKey);
    return stored === "full" || stored === "reduce" ? stored : "system";
  } catch {
    return runtimePreference;
  }
}

function shouldReduceMotion() {
  if (typeof window === "undefined") return false;
  const preference = readPreference();
  if (preference === "full") return false;
  if (preference === "reduce") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function updateDocumentPreference(preference: MotionPreference) {
  document.documentElement.classList.toggle("motion-enabled", preference === "full");
  document.documentElement.classList.toggle("motion-forced-reduced", preference === "reduce");
}

export function setMotionPreference(preference: Exclude<MotionPreference, "system">) {
  runtimePreference = preference;
  try {
    window.localStorage.setItem(preferenceKey, preference);
  } catch {
    // The current page still updates even when storage is unavailable.
  }
  updateDocumentPreference(preference);
  window.dispatchEvent(new Event(preferenceEvent));
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(shouldReduceMotion);

  useLayoutEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      const preference = readPreference();
      updateDocumentPreference(preference);
      setReduced(shouldReduceMotion());
    };

    update();
    media.addEventListener("change", update);
    window.addEventListener(preferenceEvent, update);
    window.addEventListener("storage", update);
    return () => {
      media.removeEventListener("change", update);
      window.removeEventListener(preferenceEvent, update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return reduced;
}
