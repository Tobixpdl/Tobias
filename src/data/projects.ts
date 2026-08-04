export type Project = {
  id: string;
  name: string;
  category: string;
  description: string;
  desktopImage: string;
  mobileImage: string;
  url: string;
  features: string[];
  theme: "orange" | "cream" | "rose" | "blue" | "teal" | "gold";
};

const temporaryUrl = "https://tobixpdl.github.io/Burger-House/";

export const projects: Project[] = [
  {
    id: "burger-house",
    name: "Burger House",
    category: "Gastronomía",
    description: "Menú digital con carrito y pedidos por WhatsApp.",
    desktopImage: "/projects/burger-house-desktop.png",
    mobileImage: "/projects/burger-house-mobile.png",
    url: temporaryUrl,
    features: ["Menú", "Carrito", "WhatsApp"],
    theme: "orange",
  },
  {
    id: "cafe-norte",
    name: "Café Norte",
    category: "Cafetería",
    description: "Carta clara, horarios y pedidos listos para enviar.",
    desktopImage: "/projects/cafe-norte-desktop.png",
    mobileImage: "/projects/cafe-norte-mobile.png",
    url: temporaryUrl,
    features: ["Carta", "Ubicación", "Pedidos"],
    theme: "cream",
  },
  {
    id: "dulce-atelier",
    name: "Dulce Atelier",
    category: "Pastelería",
    description: "Catálogo visual para encargos y productos de temporada.",
    desktopImage: "/projects/dulce-atelier-desktop.png",
    mobileImage: "/projects/dulce-atelier-mobile.png",
    url: temporaryUrl,
    features: ["Catálogo", "Encargos", "Galería"],
    theme: "rose",
  },
  {
    id: "estudio-profesional",
    name: "Estudio Profesional",
    category: "Servicios",
    description: "Presentación de especialidades y consultas ordenadas.",
    desktopImage: "/projects/estudio-profesional-desktop.png",
    mobileImage: "/projects/estudio-profesional-mobile.png",
    url: temporaryUrl,
    features: ["Servicios", "Turnos", "Contacto"],
    theme: "blue",
  },
  {
    id: "servicio-tecnico",
    name: "Servicio Técnico",
    category: "Oficios",
    description: "Servicios, zonas de cobertura y pedidos de presupuesto.",
    desktopImage: "/projects/servicio-tecnico-desktop.png",
    mobileImage: "/projects/servicio-tecnico-mobile.png",
    url: temporaryUrl,
    features: ["Servicios", "Cobertura", "Presupuestos"],
    theme: "teal",
  },
  {
    id: "comercio-local",
    name: "Comercio Local",
    category: "Comercio",
    description: "Productos destacados, novedades y contacto directo.",
    desktopImage: "/projects/comercio-local-desktop.png",
    mobileImage: "/projects/comercio-local-mobile.png",
    url: temporaryUrl,
    features: ["Productos", "Novedades", "WhatsApp"],
    theme: "gold",
  },
];
