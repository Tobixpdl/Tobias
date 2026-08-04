import { siteConfig } from "../config/site";

export type Plan = {
  id: keyof typeof siteConfig.messages;
  name: string;
  label: string;
  price: number;
  pricePrefix?: string;
  features: string[];
  cta: string;
  featured?: boolean;
};

export const mainPlans: Plan[] = [
  {
    id: "presence",
    name: "Presencia",
    label: "Para empezar",
    price: siteConfig.prices.presence,
    features: [
      "Página de una sola sección",
      "Diseño responsive",
      "Información del negocio",
      "Productos o servicios destacados",
      "Fotografías, ubicación y horarios",
      "Redes sociales y WhatsApp",
      "Publicación en Cloudflare Pages",
      "Una ronda de cambios",
      "Sin mensualidad obligatoria",
    ],
    cta: "Consultar por este plan",
  },
  {
    id: "catalog",
    name: "Catálogo",
    label: "Para mostrar productos",
    price: siteConfig.prices.catalog,
    pricePrefix: "Desde",
    features: [
      "Todo el Plan Presencia",
      "Catálogo o menú completo",
      "Hasta 20 productos iniciales",
      "Categorías y buscador",
      "Fotografías y descripciones",
      "Precios y productos destacados",
      "Consulta por producto en WhatsApp",
    ],
    cta: "Consultar por catálogo",
  },
  {
    id: "orders",
    name: "Pedidos",
    label: "Más elegido",
    price: siteConfig.prices.orders,
    pricePrefix: "Desde",
    features: [
      "Todo el Plan Catálogo",
      "Carrito y cantidades",
      "Variantes, tamaños y adicionales",
      "Observaciones",
      "Retiro o envío",
      "Datos del cliente",
      "Cálculo del total",
      "Pedido completo por WhatsApp",
    ],
    cta: "Consultar por pedidos",
    featured: true,
  },
];

export const additionalPlans: Plan[] = [
  {
    id: "managedCatalog",
    name: "Catálogo autoadministrable",
    label: "Para actualizarlo vos",
    price: siteConfig.prices.managedCatalog,
    pricePrefix: "Desde",
    features: ["Agregar y eliminar productos", "Modificar precios e imágenes", "Actualizar disponibilidad", "Administrar categorías", "Panel sencillo"],
    cta: "Consultar por este plan",
  },
  {
    id: "bookings",
    name: "Reservas o presupuestos",
    label: "Para organizar consultas",
    price: siteConfig.prices.bookings,
    pricePrefix: "Desde",
    features: ["Formulario personalizado", "Selección de fecha", "Datos del cliente", "Servicio solicitado", "Observaciones", "Envío por WhatsApp o correo"],
    cta: "Consultar por reservas",
  },
  {
    id: "store",
    name: "Tienda online",
    label: "Para vender y cobrar",
    price: siteConfig.prices.store,
    pricePrefix: "Desde",
    features: ["Catálogo y carrito", "Pago online", "Órdenes y confirmación", "Gestión de productos", "Integración con Mercado Pago u otra plataforma"],
    cta: "Consultar por tienda online",
  },
];
