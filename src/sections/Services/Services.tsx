import { ArrowDownRight } from "lucide-react";
import { SectionTitle } from "../../components/SectionTitle/SectionTitle";
import { services } from "../../data/services";

const steps = [
  ["01", "Conversamos", "Me contás qué necesitás y te envío una propuesta."],
  ["02", "Definimos", "Ordenamos contenido, funciones y prioridades."],
  ["03", "Creo la web", "Diseño y desarrollo una primera versión."],
  ["04", "Publicamos", "Revisamos, ajustamos y dejamos todo online."],
] as const;

export function Services() {
  return (
    <section className="services section section--light" id="servicios" aria-labelledby="services-title">
      <div className="shell services__combined">
        <div className="services__heading" id="services-title">
          <SectionTitle
            eyebrow="Qué hago"
            title="Webs para mostrar, vender y gestionar."
            description="Desde una página clara hasta catálogos, pedidos, stock y pagos: armamos solo lo que tu negocio necesita."
          />
          <span className="services__scope"><i />Diseño, desarrollo y publicación</span>
        </div>

        <div className="services__list" data-stagger>
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article className="service-row" key={service.id}>
                <span className="service-row__number">{service.number}</span>
                <div className="service-row__icon"><Icon aria-hidden="true" /></div>
                <div><h3>{service.title}</h3><p>{service.description}</p></div>
                <ArrowDownRight className="service-row__arrow" aria-hidden="true" />
              </article>
            );
          })}
        </div>

        <div className="services__process" id="proceso" aria-labelledby="process-title">
          <div className="services__process-intro">
            <span className="eyebrow">Cómo funciona</span>
            <h3 id="process-title">De la idea a la web, en cuatro pasos.</h3>
            <p>Un proceso corto, claro y sin vueltas.</p>
          </div>
          <ol className="process__steps" data-stagger>
            {steps.map(([number, title, description]) => (
              <li key={number}>
                <span>{number}</span>
                <div><strong>{title}</strong><p>{description}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
