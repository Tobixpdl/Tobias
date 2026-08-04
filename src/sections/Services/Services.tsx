import { ArrowDownRight } from "lucide-react";
import { SectionTitle } from "../../components/SectionTitle/SectionTitle";
import { services } from "../../data/services";

export function Services() {
  return (
    <section className="services section section--light" id="servicios" aria-labelledby="services-title">
      <div className="shell services__layout">
        <div className="services__intro">
          <div id="services-title">
            <SectionTitle
              eyebrow="Qué hago"
              title="Tu negocio, explicado de forma clara."
              description="Diseño páginas donde tus clientes pueden conocer el negocio, ver productos o servicios, encontrar horarios y ubicación, contactarte, hacer pedidos o comprar."
            />
          </div>
          <div className="interface-panel" data-reveal aria-hidden="true">
            <div className="interface-panel__bar"><i /><i /><i /><span>tunegocio.com.ar</span></div>
            <div className="interface-panel__body">
              <div className="interface-panel__nav"><b /><span /><span /></div>
              <div className="interface-panel__hero"><span /><span /><button tabIndex={-1}>Contactar</button></div>
              <div className="interface-panel__tiles"><i /><i /><i /></div>
            </div>
            <div className="interface-panel__status"><span />Listo para celular</div>
          </div>
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
      </div>
    </section>
  );
}
