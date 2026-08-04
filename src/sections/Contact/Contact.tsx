import { AtSign, Mail, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "../../components/ContactForm/ContactForm";
import { siteConfig } from "../../config/site";
import { whatsappUrl } from "../../utils/whatsapp";

export function Contact() {
  return (
    <section className="contact section" id="contacto" aria-labelledby="contact-title">
      <div className="contact__backdrop" aria-hidden="true"><span /><span /><span /></div>
      <div className="shell contact__inner">
        <div className="contact__heading" data-reveal="clip">
          <p className="eyebrow">Hablemos de tu proyecto</p>
          <h2 id="contact-title">Contame qué necesita <em>tu negocio.</em></h2>
          <p>La cotización es sin cargo. Escribime y vemos qué tipo de página se adapta mejor a lo que ofrecés.</p>
        </div>
        <div className="contact__signal" data-parallax="-8" aria-hidden="true"><i /><span /></div>

        <div className="contact__layout">
          <aside className="contact__details" data-reveal="left">
            <p>Podés completar el formulario o escribirme directamente.</p>
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" /><span>WhatsApp<strong>{siteConfig.phoneDisplay}</strong></span></a>
            <a href={`tel:+${siteConfig.whatsappNumber}`}><Phone aria-hidden="true" /><span>Teléfono<strong>{siteConfig.phoneDisplay}</strong></span></a>
            <a href={`mailto:${siteConfig.email}`}><Mail aria-hidden="true" /><span>Email<strong>{siteConfig.email}</strong></span></a>
            <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer"><AtSign aria-hidden="true" /><span>Instagram<strong>{siteConfig.instagramDisplay}</strong></span></a>
          </aside>
          <div data-reveal="right"><ContactForm /></div>
        </div>
      </div>
    </section>
  );
}
