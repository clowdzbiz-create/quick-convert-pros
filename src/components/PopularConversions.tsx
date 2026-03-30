import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { CONVERSION_ROUTES } from "@/lib/conversion-routes";

const PopularConversions = () => {
  const video = CONVERSION_ROUTES.filter(r => r.mediaType === "video");
  const audio = CONVERSION_ROUTES.filter(r => r.mediaType === "audio");
  const image = CONVERSION_ROUTES.filter(r => r.mediaType === "image");

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-foreground mb-6 text-center">All Free Conversions</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-base font-bold text-foreground mb-3">Video Conversions</h3>
          <div className="space-y-1">
            {video.map((r) => (
              <Link
                key={r.slug}
                to={`/${r.slug}`}
                className="flex items-center gap-2 text-sm text-primary font-medium underline decoration-primary/30 hover:decoration-primary py-1"
              >
                <ArrowRight className="w-3 h-3 shrink-0" />
                {r.from} to {r.to}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-base font-bold text-foreground mb-3">Audio Conversions</h3>
          <div className="space-y-1">
            {audio.map((r) => (
              <Link
                key={r.slug}
                to={`/${r.slug}`}
                className="flex items-center gap-2 text-sm text-primary font-medium underline decoration-primary/30 hover:decoration-primary py-1"
              >
                <ArrowRight className="w-3 h-3 shrink-0" />
                {r.from} to {r.to}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-base font-bold text-foreground mb-3">Image Conversions</h3>
          <div className="space-y-1">
            {image.map((r) => (
              <Link
                key={r.slug}
                to={`/${r.slug}`}
                className="flex items-center gap-2 text-sm text-primary font-medium hover:underline py-1"
              >
                <ArrowRight className="w-3 h-3 shrink-0" />
                {r.from} to {r.to}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularConversions;
