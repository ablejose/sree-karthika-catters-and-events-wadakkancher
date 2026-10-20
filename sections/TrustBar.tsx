import { Star } from "lucide-react";
import { copy, site, withoutDelivery } from "@/config/site";
import { tAll } from "@/lib/copy";

export default function TrustBar() {
  // Hide the whole trust/rating row when there is no real review count to show.
  if (!site.reviews) return null;

  const items = [
    `${site.rating.toFixed(1)}\u2605 on Google`,
    `${site.reviews} reviews`,
    ...withoutDelivery(tAll(copy.trustBar.items)),
  ];
  return (
    <section aria-label="Trust signals" className="border-b border-sand bg-espresso py-4">
      <div className="mx-auto flex max-w-shell flex-wrap items-center justify-center gap-x-8 gap-y-2 px-6">
        {items.map((text, i) => (
          <span key={i} className="flex items-center gap-2 font-sans text-sm text-ivory/85">
            {i === 0 && <Star size={14} className="fill-saffron text-saffron" />}
            {text}
          </span>
        ))}
      </div>
    </section>
  );
}
