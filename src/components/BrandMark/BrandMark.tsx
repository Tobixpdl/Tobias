type BrandMarkProps = {
  journey?: boolean;
};

export function BrandMark({ journey = false }: BrandMarkProps) {
  return (
    <span className={`brand-monogram${journey ? " brand-monogram--journey" : ""}`} aria-hidden="true">
      <img src={`${import.meta.env.BASE_URL}brand-robot.png`} alt="" />
    </span>
  );
}
