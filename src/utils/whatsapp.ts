import { siteConfig } from "../config/site";

export function whatsappUrl(message: string = siteConfig.messages.general) {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
