type BrandMarkProps = { journey?: boolean; dock?: "origin" | "destination" };
export function BrandMark({ journey = false, dock }: BrandMarkProps) {
  return (
    <span
      data-journey-dock={dock}
      className={`brand-monogram${journey ? " brand-monogram--journey" : ""}`}
      aria-hidden="true"
    >
      <img
        src={`${import.meta.env.BASE_URL}brand-robot.png`}
        alt=""
        width="45"
        height="45"
      />
    </span>
  );
}
