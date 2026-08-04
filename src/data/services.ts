import {
  BookOpen,
  CalendarCheck,
  LayoutTemplate,
  MessageCircleMore,
  Settings2,
  ShoppingBag,
} from "lucide-react";

export const services = [
  {
    id: "landing",
    number: "01",
    title: "Landing informativa",
    description: "Presentá el negocio, sus servicios, ubicación, horarios, fotografías, redes y medios de contacto.",
    icon: LayoutTemplate,
  },
  {
    id: "catalog",
    number: "02",
    title: "Catálogo o menú",
    description: "Mostrá productos organizados por categorías, con imágenes, descripciones y precios.",
    icon: BookOpen,
  },
  {
    id: "orders",
    number: "03",
    title: "Pedidos por WhatsApp",
    description: "Tus clientes arman el pedido, seleccionan variantes y envían todo listo por WhatsApp.",
    icon: MessageCircleMore,
  },
  {
    id: "managed",
    number: "04",
    title: "Catálogo autoadministrable",
    description: "Modificá precios, productos, imágenes y disponibilidad desde un panel sencillo.",
    icon: Settings2,
  },
  {
    id: "bookings",
    number: "05",
    title: "Reservas y presupuestos",
    description: "Recibí solicitudes con fecha, servicio, datos del cliente y observaciones.",
    icon: CalendarCheck,
  },
  {
    id: "store",
    number: "06",
    title: "Tienda online",
    description: "Vendé productos y recibí pagos directamente desde la página.",
    icon: ShoppingBag,
  },
];
