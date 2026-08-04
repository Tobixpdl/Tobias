import { Plus } from "lucide-react";
import { SectionTitle } from "../../components/SectionTitle/SectionTitle";

const faqs = [
  ["¿La cotización tiene costo?", "No. La cotización inicial es sin cargo."],
  ["¿Tengo que pagar todos los meses?", "No para una página estática. El precio se abona una vez. Solo se cobran cambios posteriores, nuevas funcionalidades o costos externos que requiera el proyecto."],
  ["¿Puedo usar mi propio dominio?", "Sí. El dominio se puede conectar a la página y se compra directamente al proveedor."],
  ["¿La página funciona en celulares?", "Sí. Todos los proyectos se diseñan para computadora, tablet y celular."],
  ["¿Puedo cambiar productos y precios?", "Sí. Se puede contratar un catálogo autoadministrable para modificar productos, precios, imágenes y disponibilidad."],
  ["¿Puedo recibir pedidos por WhatsApp?", "Sí. Se puede agregar un carrito que arme el pedido completo y lo envíe por WhatsApp."],
  ["¿Puedo vender y cobrar desde la web?", "Sí. También se pueden desarrollar tiendas online con medios de pago."],
  ["¿Cuánto tarda el desarrollo?", "Depende del contenido y las funcionalidades. La fecha se informa junto con la cotización."],
] as const;

export function FAQ() {
  return (
    <section className="faq section" id="preguntas" aria-labelledby="faq-title">
      <div className="shell faq__layout">
        <div className="faq__intro" id="faq-title">
          <SectionTitle eyebrow="Preguntas frecuentes" title="Lo importante, antes de empezar." description="Si tu consulta no aparece acá, escribime y la vemos sin compromiso." light />
        </div>
        <div className="faq__list" data-reveal>
          {faqs.map(([question, answer], index) => (
            <details key={question} open={index === 0} onToggle={() => window.dispatchEvent(new Event("layout:changed"))}>
              <summary><span>{String(index + 1).padStart(2, "0")}</span>{question}<Plus aria-hidden="true" /></summary>
              <div><p>{answer}</p></div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
