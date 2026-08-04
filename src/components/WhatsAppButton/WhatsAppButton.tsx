import { MessageCircle } from "lucide-react";
import { whatsappUrl } from "../../utils/whatsapp";

export function WhatsAppButton() {
  return (
    <a
      className="whatsapp-float"
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Solicitar cotización por WhatsApp"
    >
      <span className="whatsapp-float__tooltip" role="tooltip">Cotización sin cargo</span>
      <MessageCircle aria-hidden="true" />
    </a>
  );
}
