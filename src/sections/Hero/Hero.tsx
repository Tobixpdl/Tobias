import { ArrowDown, ArrowUpRight } from "lucide-react";
import { siteConfig } from "../../config/site";
import { formatPrice } from "../../utils/currency";
import { whatsappUrl } from "../../utils/whatsapp";
import { projects } from "../../data/projects";

export function Hero() {
  const featured = projects[2];
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <div className="shell hero__grid">
        <div className="hero__content">
          <p className="hero__eyebrow" data-hero-eyebrow>
            Diseño & desarrollo web / Tobias Ponce de Leon
          </p>
          <h1 id="hero-title">
            <span className="hero-title__line">
              <span data-hero-line>Tu negocio.</span>
            </span>
            <span className="hero-title__line">
              <span data-hero-line>Una web</span>
            </span>
            <span className="hero-title__line">
              <span data-hero-line>
                <em>bien hecha.</em>
              </span>
            </span>
          </h1>
          <p className="hero__lead" data-hero-copy>
            Soy Tobias. Desarrollo sitios para comercios, profesionales y
            emprendimientos: claros para tus clientes, útiles para tu negocio.
          </p>
          <div className="hero__actions" data-hero-actions>
            <a
              className="button button--primary"
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
            >
              Contame tu idea <ArrowUpRight aria-hidden="true" />
            </a>
            <a className="button button--ghost" href="#trabajos">
              Explorá mis trabajos <ArrowDown aria-hidden="true" />
            </a>
          </div>
          <p className="hero__price" data-hero-meta>
            <strong>Desde {formatPrice(siteConfig.startingPrice)}</strong>
            <span>Pago único · Cotización sin cargo</span>
          </p>
        </div>
        <figure className="hero__work" data-hero-visual>
          <div className="hero__work-label">
            <span>Una idea llevada a la web</span>
            <span>01 — 03</span>
          </div>
          <a
            href="#trabajos"
            aria-label="Explorar Dulce Atelier y los demás proyectos"
          >
            <img
              src={featured.desktopImage}
              width="1440"
              height="900"
              alt="Dulce Atelier: diseño de pastelería con tipografía editorial y fotografía de una torta artesanal"
              fetchPriority="high"
            />
            <span className="hero__work-arrow">
              <ArrowUpRight aria-hidden="true" />
            </span>
          </a>
          <figcaption>
            <strong>Dulce Atelier</strong>
            <span>Pastelería / Catálogo & encargos</span>
          </figcaption>
          <p className="hero__signature">
            Cada negocio tiene su forma.
            <br />
            Su web también.
          </p>
        </figure>
      </div>
      <div className="shell hero__foot">
        <span>Diseñado para conectar con tus clientes.</span>
        <a href="#servicios">
          Del primer mensaje a tu web online <ArrowDown aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
