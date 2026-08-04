import { ChevronDown, CircleDollarSign, ExternalLink, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { PlanCard } from "../../components/PlanCard/PlanCard";
import { SectionTitle } from "../../components/SectionTitle/SectionTitle";
import { additionalPlans, mainPlans } from "../../data/plans";

export function Plans() {
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => setExpanded((current) => !current);

  return (
    <section className="plans section" id="planes" aria-labelledby="plans-title">
      <div className="shell">
        <div id="plans-title">
          <SectionTitle eyebrow="Planes y precios" title="Elegí el punto de partida." description="Todos los planes se adaptan a la identidad y las necesidades del negocio." light />
        </div>
        <div className="plans__grid" data-stagger>
          {mainPlans.map((plan) => <PlanCard key={plan.id} plan={plan} />)}
        </div>

        <div className="more-plans" data-reveal>
          <button
            className="more-plans__toggle"
            type="button"
            aria-expanded={expanded}
            aria-controls="additional-plans"
            onClick={toggleExpanded}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                toggleExpanded();
              }
            }}
          >
            <span><i />{expanded ? "Ocultar soluciones" : "Ver más soluciones"}</span>
            <ChevronDown aria-hidden="true" />
          </button>
          <div id="additional-plans" className={`more-plans__content${expanded ? " is-open" : ""}`} aria-hidden={!expanded} inert={!expanded}>
            <div className="more-plans__inner">
              <div className="plans__grid plans__grid--additional">
                {additionalPlans.map((plan) => <PlanCard key={plan.id} plan={plan} compact focusDisabled={!expanded} />)}
              </div>
              <p className="plans__variable-note">Los valores pueden variar según la cantidad de contenido, productos e integraciones.</p>
            </div>
          </div>
        </div>

        <div className="payment-note" data-reveal>
          <div className="payment-note__icon"><CircleDollarSign aria-hidden="true" /></div>
          <div>
            <h3>Un precio claro para ponerla en marcha.</h3>
            <p>El precio de las páginas estáticas se abona una única vez. No se cobra una mensualidad obligatoria por mantenerlas publicadas. Solo se cobran modificaciones posteriores, nuevas funcionalidades o servicios adicionales solicitados por el cliente.</p>
          </div>
          <ul>
            <li><ShieldCheck aria-hidden="true" /><span><strong>Dominio opcional</strong>Se abona directo al proveedor, sin comisión adicional.</span></li>
            <li><ExternalLink aria-hidden="true" /><span><strong>Servicios externos</strong>Algunas integraciones pueden tener costos según el proveedor.</span></li>
          </ul>
        </div>
      </div>
    </section>
  );
}
