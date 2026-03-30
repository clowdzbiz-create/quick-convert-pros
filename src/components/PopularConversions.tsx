import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { CONVERSION_ROUTES } from "@/lib/conversion-routes";

const PopularConversions = () => {
  return (
    <section className="w-full max-w-3xl mx-auto px-4 py-8">
      <h3 className="text-lg font-bold text-foreground mb-4">Popular Conversions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {CONVERSION_ROUTES.slice(0, 12).map((r) => (
          <Link
            key={r.slug}
            to={`/${r.slug}`}
            className="flex items-center gap-2 text-sm text-primary font-medium hover:underline text-left py-1"
          >
            <ArrowRight className="w-4 h-4 shrink-0" />
            {r.h1}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default PopularConversions;
