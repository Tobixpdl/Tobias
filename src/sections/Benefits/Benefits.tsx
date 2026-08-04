import { Clock3, Link2, MonitorSmartphone, Send, Share2, Zap } from "lucide-react";
import { SectionTitle } from "../../components/SectionTitle/SectionTitle";

const benefits = [
  [MonitorSmartphone, "Funciona en celular y computadora", "Cada pantalla se diseña para que la información siga siendo fácil de usar."],
  [Link2, "Tu información en un lugar propio", "Tus clientes no dependen de una red social para encontrar horarios o servicios."],
  [Send, "Pedidos mejor organizados", "El detalle llega listo por WhatsApp, con variantes y observaciones."],
  [Share2, "Un único enlace para compartir", "Usalo en redes, Google, tarjetas, cartelería o mensajes."],
  [Zap, "Carga rápida", "Una estructura liviana ayuda a que el contenido aparezca sin esperas innecesarias."],
  [Clock3, "Sin abono obligatorio", "Las páginas estáticas no tienen una mensualidad de mantenimiento impuesta."],
] as const;

export function Benefits() {
  return (
    <section className="benefits section section--light" id="beneficios" aria-labelledby="benefits-title">
      <div className="shell">
        <div id="benefits-title">
          <SectionTitle eyebrow="Una herramienta útil" title="Todo lo necesario para que te encuentren y te contacten." description="Beneficios concretos para el día a día del negocio." align="center" />
        </div>
        <div className="benefits__grid" data-stagger>
          {benefits.map(([Icon, title, text], index) => (
            <article key={title} className={`benefit benefit--${index + 1}`}>
              <Icon aria-hidden="true" />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
