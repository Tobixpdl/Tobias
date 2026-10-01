import { Menu, MessageCircle, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { BrandMark } from "../BrandMark/BrandMark";
import { siteConfig } from "../../config/site";
import { useActiveSection } from "../../hooks/useActiveSection";
import { whatsappUrl } from "../../utils/whatsapp";

const navigation = [
  ["Inicio", "inicio"],
  ["Servicios", "servicios"],
  ["Trabajos", "trabajos"],
  ["Planes", "planes"],
  ["Contacto", "contacto"],
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);
  const ids = useMemo(() => navigation.map(([, id]) => id), []);
  const active = useActiveSection(ids);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const desktop = window.matchMedia("(min-width: 901px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    firstLink.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
      if (event.key === "Tab") {
        const nodes = [
          menuButton.current!,
          ...document.querySelectorAll<HTMLAnchorElement>("#main-navigation a"),
        ];
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.body.classList.add("menu-open");
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("menu-open");
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [open]);

  return (
    <header
      className={`site-header${scrolled ? " site-header--scrolled" : ""}`}
    >
      <div className="site-header__inner shell">
        <a
          className="brand"
          href="#inicio"
          aria-label={`${siteConfig.brandName}, ir al inicio`}
          onClick={() => setOpen(false)}
        >
          <BrandMark dock="origin" />
          <span className="brand__name">{siteConfig.brandName}</span>
        </a>

        <button
          ref={menuButton}
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="main-navigation"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>

        <nav
          id="main-navigation"
          data-lenis-prevent
          className={`main-nav${open ? " main-nav--open" : ""}`}
          aria-label="Navegación principal"
        >
          <div className="main-nav__links">
            {navigation.map(([label, id], index) => (
              <a
                key={id}
                ref={index === 0 ? firstLink : undefined}
                className={active === id ? "is-active" : ""}
                aria-current={active === id ? "location" : undefined}
                href={`#${id}`}
                onClick={() => setOpen(false)}
              >
                {label}
              </a>
            ))}
          </div>
          <a
            className="button button--small button--primary main-nav__cta"
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle aria-hidden="true" />
            Contactame
          </a>
        </nav>
      </div>
    </header>
  );
}
