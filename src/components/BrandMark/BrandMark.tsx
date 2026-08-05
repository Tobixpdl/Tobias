type BrandMarkProps = {
  journey?: boolean;
};

export function BrandMark({ journey = false }: BrandMarkProps) {
  return (
    <span className={`brand-monogram${journey ? " brand-monogram--journey" : ""}`} aria-hidden="true">
      <span className="brand-monogram__letters"><b>T</b><b>P</b></span>
      <i />
    </span>
  );
}
