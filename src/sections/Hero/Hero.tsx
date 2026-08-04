import { ArrowDown, ArrowUpRight, CheckCircle2, MousePointer2, Sparkles } from "lucide-react";
import { siteConfig } from "../../config/site";
import { formatPrice } from "../../utils/currency";
import { whatsappUrl } from "../../utils/whatsapp";

export function Hero() {
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title" data-section-tone="dark">
      <div className="hero__aurora hero__aurora--orange" data-pointer-depth="0.45" aria-hidden="true" />
      <div className="hero__aurora hero__aurora--teal" data-pointer-depth="0.28" aria-hidden="true" />
      <div className="hero__grid shell">
        <div className="hero__content">
          <div className="hero__eyebrow" data-hero-eyebrow><span />Sitios web para comercios y profesionales</div>
          <h1 id="hero-title" aria-label="Una página profesional para hacer crecer tu negocio.">
            <span className="hero-title__line"><span data-hero-line>Una página profesional</span></span>
            <span className="hero-title__line"><span data-hero-line>para hacer <em>crecer</em></span></span>
            <span className="hero-title__line"><span data-hero-line><em>tu negocio.</em></span></span>
          </h1>
          <p className="hero__lead" data-hero-copy>Creo sitios rápidos, claros y adaptados a celulares para que tus clientes encuentren lo que ofrecés, te contacten, hagan pedidos o compren.</p>
          <div className="hero__actions" data-hero-actions>
            <a className="button button--primary" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">Pedí tu cotización gratis <ArrowUpRight aria-hidden="true" /></a>
            <a className="button button--ghost" href="#planes">Ver planes <ArrowDown aria-hidden="true" /></a>
          </div>
          <div className="hero__price" data-hero-meta>
            <CheckCircle2 aria-hidden="true" />
            <p><strong>Desde {formatPrice(siteConfig.startingPrice)}</strong><span>Pago único · Sin abono mensual obligatorio</span></p>
          </div>
          <p className="hero__note" data-hero-meta>Cotización sin cargo.</p>
        </div>

        <div className="hero__stage" data-hero-visual aria-hidden="true">
          <div className="hero-blueprint">
            <div className="hero-blueprint__bar"><i /><i /><i /><span>tu-negocio.com</span></div>
            <div className="hero-blueprint__canvas" data-pointer-depth="0.28">
              <span className="hero-blueprint__eyebrow" />
              <span className="hero-blueprint__title" />
              <span className="hero-blueprint__title hero-blueprint__title--short" />
              <span className="hero-blueprint__copy" />
              <span className="hero-blueprint__copy hero-blueprint__copy--short" />
              <span className="hero-blueprint__button" />
              <div className="hero-blueprint__cards"><i /><i /><i /></div>
            </div>
          </div>
          <div className="stage-card stage-card--top" data-pointer-depth="1"><span className="stage-card__dot" />Disponible para nuevos proyectos</div>
          <div className="stage-card stage-card--bottom" data-pointer-depth="0.8"><b>01</b><span>Diseño<br />responsive</span></div>
          <div className="stage-card stage-card--cursor" data-pointer-depth="1.3"><MousePointer2 /><span>Claro y simple</span></div>
          <div className="stage-grid" />
          <span className="stage-orbit stage-orbit--one"><Sparkles /></span>
          <span className="stage-orbit stage-orbit--two" />
        </div>
      </div>
      <div className="hero__scroll" aria-hidden="true"><span />Recorré el sitio</div>
    </section>
  );
}
