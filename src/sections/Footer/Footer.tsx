import { ArrowUpRight, AtSign, Mail, MessageCircle } from "lucide-react";
import { BrandMark } from "../../components/BrandMark/BrandMark";
import { siteConfig } from "../../config/site";
import { whatsappUrl } from "../../utils/whatsapp";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="shell footer__top">
        <div className="footer__brand">
          <a className="brand" href="#inicio"><BrandMark dock="destination" /><span className="brand__name">{siteConfig.brandName}</span></a>
          <p>Sitios web para comercios, profesionales y emprendimientos.</p>
        </div>
        <div className="footer__cta">
          <p>¿Tenés una idea en mente?</p>
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">Pidamos una cotización <ArrowUpRight aria-hidden="true" /></a>
        </div>
      </div>
      <div className="shell footer__links">
        <nav aria-label="Enlaces del pie">
          <a href="#servicios">Servicios</a><a href="#planes">Planes</a><a href="#trabajos">Trabajos</a><a href="#preguntas">Preguntas</a><a href="#contacto">Contacto</a>
        </nav>
        <div className="footer__social">
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><MessageCircle aria-hidden="true" /></a>
          <a href={`mailto:${siteConfig.email}`} aria-label="Email"><Mail aria-hidden="true" /></a>
          <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><AtSign aria-hidden="true" /></a>
        </div>
      </div>
      <div className="shell footer__bottom">
        <p>© {year} {siteConfig.brandName}. Todos los derechos reservados.</p>
        <p>Diseño y desarrollo por {siteConfig.brandName}.</p>
      </div>
    </footer>
  );
}
