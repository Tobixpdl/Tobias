import { ArrowDown } from "lucide-react";
import { SectionTitle } from "../../components/SectionTitle/SectionTitle";

const steps = [
  ["01", "Me contás sobre tu negocio."],
  ["02", "Recibís una cotización sin cargo."],
  ["03", "Definimos contenido y funcionalidades."],
  ["04", "Diseño y desarrollo la página."],
  ["05", "Revisás una versión previa."],
  ["06", "Realizo los ajustes acordados."],
  ["07", "Publicamos la página."],
] as const;

export function Process() {
  return (
    <section className="process section section--light" id="proceso" aria-labelledby="process-title">
      <div className="shell process__layout">
        <div className="process__sticky" id="process-title">
          <SectionTitle eyebrow="Cómo funciona" title="De la idea a la página publicada." description="Un proceso simple, con cada decisión clara antes de avanzar." />
          <span className="process__hint"><ArrowDown aria-hidden="true" />Seguimos paso a paso</span>
        </div>
        <ol className="process__steps" data-stagger>
          {steps.map(([number, text], index) => (
            <li key={number}>
              <span>{number}</span>
              <p>{text}</p>
              {index < steps.length - 1 && <i data-line />}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
