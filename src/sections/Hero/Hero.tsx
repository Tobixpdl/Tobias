import { ArrowDown, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { siteConfig } from "../../config/site";
import { formatPrice } from "../../utils/currency";
import { whatsappUrl } from "../../utils/whatsapp";

export function Hero() {
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <div className="hero__grid shell">
        <div className="hero__content">
          <div className="hero__eyebrow" data-hero-reveal><span />Sitios web para comercios y profesionales</div>
          <h1 id="hero-title" data-hero-reveal>Una página profesional para hacer <em>crecer tu negocio.</em></h1>
          <p className="hero__lead" data-hero-reveal>Creo sitios rápidos, claros y adaptados a celulares para que tus clientes encuentren lo que ofrecés, te contacten, hagan pedidos o compren.</p>
          <div className="hero__actions" data-hero-reveal>
            <a className="button button--primary" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">Pedí tu cotización gratis <ArrowUpRight aria-hidden="true" /></a>
            <a className="button button--ghost" href="#planes">Ver planes <ArrowDown aria-hidden="true" /></a>
          </div>
          <div className="hero__price" data-hero-reveal>
            <CheckCircle2 aria-hidden="true" />
            <p><strong>Desde {formatPrice(siteConfig.startingPrice)}</strong><span>Pago único · Sin abono mensual obligatorio</span></p>
          </div>
          <p className="hero__note" data-hero-reveal>Cotización sin cargo.</p>
        </div>

        <div className="hero__stage" aria-hidden="true">
          <div className="stage-card stage-card--top"><span className="stage-card__dot" />Disponible para nuevos proyectos</div>
          <div className="stage-card stage-card--bottom"><b>01</b><span>Diseño<br />responsive</span></div>
          <div className="stage-grid" />
          <span className="stage-orbit stage-orbit--one" />
          <span className="stage-orbit stage-orbit--two" />
        </div>
      </div>
      <div className="hero__scroll" aria-hidden="true"><span />Recorré el sitio</div>
    </section>
  );
}
