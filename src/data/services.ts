import {
  BookOpen,
  Boxes,
  CalendarCheck,
  CreditCard,
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
    description: "Servicios, ubicación, horarios, imágenes y contacto.",
    icon: LayoutTemplate,
  },
  {
    id: "catalog",
    number: "02",
    title: "Catálogo o menú",
    description: "Productos por categoría, con imágenes, detalles y precios.",
    icon: BookOpen,
  },
  {
    id: "orders",
    number: "03",
    title: "Pedidos por WhatsApp",
    description: "El cliente arma y envía su pedido listo por WhatsApp.",
    icon: MessageCircleMore,
  },
  {
    id: "managed",
    number: "04",
    title: "Catálogo autoadministrable",
    description: "Actualizá precios, productos e imágenes desde un panel.",
    icon: Settings2,
  },
  {
    id: "bookings",
    number: "05",
    title: "Reservas y presupuestos",
    description: "Solicitudes con fecha, servicio y datos del cliente.",
    icon: CalendarCheck,
  },
  {
    id: "store",
    number: "06",
    title: "Tienda online",
    description: "Vendé productos y recibí pagos desde la página.",
    icon: ShoppingBag,
  },
  {
    id: "inventory",
    number: "07",
    title: "Inventario y pedidos",
    description: "Controlá stock, ventas y estados de cada pedido.",
    icon: Boxes,
  },
  {
    id: "integrations",
    number: "08",
    title: "Pagos e integraciones",
    description: "Conectá Mercado Pago y servicios externos.",
    icon: CreditCard,
  },
];
