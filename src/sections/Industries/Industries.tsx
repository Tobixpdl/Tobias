import { BriefcaseBusiness, Coffee, Hammer, ShoppingBag, Store, Wrench } from "lucide-react";

const industries = [
  [Coffee, "Gastronomía"],
  [Store, "Comercios"],
  [BriefcaseBusiness, "Profesionales"],
  [Hammer, "Oficios"],
  [Wrench, "Servicios"],
  [ShoppingBag, "Emprendimientos"],
] as const;

export function Industries() {
  return (
    <section className="industries" aria-label="Rubros con los que trabajo">
      <div className="industries__track">
        {[...industries, ...industries].map(([Icon, label], index) => (
          <span key={`${label}-${index}`} aria-hidden={index >= industries.length}>
            <Icon aria-hidden="true" />{label}<i />
          </span>
        ))}
      </div>
    </section>
  );
}
