import { Pause, Sparkles } from "lucide-react";
import { setMotionPreference, useReducedMotion } from "../../hooks/useReducedMotion";

export function MotionPreferenceToggle() {
  const reducedMotion = useReducedMotion();

  return (
    <button
      className="motion-preference-toggle"
      type="button"
      aria-pressed={!reducedMotion}
      aria-label={reducedMotion ? "Activar animaciones del sitio" : "Reducir animaciones del sitio"}
      onClick={() => setMotionPreference(reducedMotion ? "full" : "reduce")}
    >
      {reducedMotion ? <Sparkles aria-hidden="true" /> : <Pause aria-hidden="true" />}
      <span>{reducedMotion ? "Activar animaciones" : "Reducir movimiento"}</span>
    </button>
  );
}
