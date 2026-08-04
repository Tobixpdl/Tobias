import { ArrowUpRight } from "lucide-react";
import { type FormEvent, useState } from "react";
import { siteConfig } from "../../config/site";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const message = `Hola, quiero solicitar una cotización sin cargo.

Nombre: ${data.get("name")}
Negocio: ${data.get("business")}
Rubro: ${data.get("category")}
Localidad: ${data.get("location")}
Teléfono: ${data.get("phone")}
Servicio: ${data.get("service")}
Presupuesto aproximado: ${data.get("budget")}
Mensaje: ${data.get("message")}`;

    window.open(`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    setSent(true);
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate={false}>
      <div className="form-grid">
        <label>Nombre<input name="name" autoComplete="name" required placeholder="Tu nombre" /></label>
        <label>Nombre del negocio<input name="business" autoComplete="organization" required placeholder="Nombre o proyecto" /></label>
        <label>Rubro<input name="category" required placeholder="Ej. ferretería" /></label>
        <label>Localidad<input name="location" autoComplete="address-level2" required placeholder="Tu localidad" /></label>
        <label>Teléfono<input name="phone" type="tel" autoComplete="tel" required placeholder="Tu número" /></label>
        <label>Qué necesitás
          <select name="service" required defaultValue="">
            <option value="" disabled>Elegí una opción</option>
            <option>Landing informativa</option>
            <option>Catálogo</option>
            <option>Pedidos por WhatsApp</option>
            <option>Catálogo autoadministrable</option>
            <option>Reservas</option>
            <option>Tienda online</option>
            <option>No estoy seguro</option>
          </select>
        </label>
        <label className="form-field--wide">Presupuesto aproximado
          <select name="budget" required defaultValue="">
            <option value="" disabled>Elegí una opción</option>
            <option>Hasta $60.000</option>
            <option>Entre $60.000 y $100.000</option>
            <option>Entre $100.000 y $180.000</option>
            <option>Más de $180.000</option>
            <option>Necesito orientación</option>
          </select>
        </label>
        <label className="form-field--wide">Mensaje<textarea name="message" rows={4} required placeholder="Contame brevemente qué querés mostrar, recibir o vender." /></label>
      </div>
      <div className="contact-form__footer">
        <p>Al enviar, se abre WhatsApp con estos datos. Nada se publica automáticamente.</p>
        <button className="button button--primary" type="submit">Preparar consulta <ArrowUpRight aria-hidden="true" /></button>
      </div>
      {sent && <p className="form-status" role="status">La consulta quedó preparada en WhatsApp.</p>}
    </form>
  );
}
