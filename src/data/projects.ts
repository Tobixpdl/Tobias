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

const projectAsset = (filename: string) =>
  `${import.meta.env.BASE_URL}projects/${filename}`;

export const projects: Project[] = [
  {
    id: "burger-house",
    name: "Burger House",
    category: "Gastronomía",
    description: "Menú digital con carrito y pedidos por WhatsApp.",
    desktopImage: projectAsset("burger-house-desktop.webp"),
    mobileImage: projectAsset("burger-house-mobile.webp"),
    url: "https://tobixpdl.github.io/Burger-House/",
    features: ["Menú", "Carrito", "WhatsApp"],
    theme: "orange",
  },
  {
    id: "cafe-norte",
    name: "Café Norte",
    category: "Cafetería",
    description: "Carta clara, horarios y pedidos listos para enviar.",
    desktopImage: projectAsset("cafe-norte-desktop.webp"),
    mobileImage: projectAsset("cafe-norte-mobile.webp"),
    url: "https://tobixpdl.github.io/Cafe-Norte/",
    features: ["Carta con buscador", "Personalización", "Pedidos por WhatsApp"],
    theme: "cream",
  },
  {
    id: "dulce-atelier",
    name: "Dulce Atelier",
    category: "Pastelería",
    description: "Catálogo visual para encargos y productos de temporada.",
    desktopImage: projectAsset("dulce-atelier-desktop.webp"),
    mobileImage: projectAsset("dulce-atelier-mobile.webp"),
    url: "https://tobixpdl.github.io/Dulce-Atelier/",
    features: [
      "Catálogo filtrable",
      "Tortas personalizadas",
      "Pedidos por WhatsApp",
    ],
    theme: "rose",
  },
];
