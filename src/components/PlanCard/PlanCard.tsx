import { ArrowUpRight, Check } from "lucide-react";
import { type Plan } from "../../data/plans";
import { siteConfig } from "../../config/site";
import { formatPrice } from "../../utils/currency";
import { whatsappUrl } from "../../utils/whatsapp";

type PlanCardProps = { plan: Plan; compact?: boolean; focusDisabled?: boolean };

export function PlanCard({ plan, compact, focusDisabled }: PlanCardProps) {
  const message = siteConfig.messages[plan.id];

  return (
    <article className={`plan-card${plan.featured ? " plan-card--featured" : ""}${compact ? " plan-card--compact" : ""}`} data-tilt-card>
      <div className="plan-card__top">
        <span className="plan-card__label">{plan.label}</span>
        {plan.featured && <span className="plan-card__signal" aria-label="Plan destacado"><i /></span>}
      </div>
      <h3>{plan.name}</h3>
      <div className="plan-card__price">
        {plan.pricePrefix && <span>{plan.pricePrefix}</span>}
        <strong data-counter-value={plan.price}>{formatPrice(plan.price)}</strong>
      </div>
      <ul className="plan-card__features">
        {plan.features.map((feature) => (
          <li key={feature}><Check aria-hidden="true" />{feature}</li>
        ))}
      </ul>
      <a className={`button ${plan.featured ? "button--primary" : "button--outline"}`} href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer" tabIndex={focusDisabled ? -1 : undefined}>
        <span>{plan.cta}</span><ArrowUpRight aria-hidden="true" />
      </a>
    </article>
  );
}
