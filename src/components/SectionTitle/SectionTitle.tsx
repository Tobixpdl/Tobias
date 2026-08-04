type SectionTitleProps = {
  eyebrow: string;
  title: string;
  description?: string;
  light?: boolean;
  align?: "left" | "center";
};

export function SectionTitle({ eyebrow, title, description, light, align = "left" }: SectionTitleProps) {
  return (
    <header className={`section-title section-title--${align}${light ? " section-title--light" : ""}`} data-reveal>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {description && <p className="section-title__description">{description}</p>}
    </header>
  );
}
