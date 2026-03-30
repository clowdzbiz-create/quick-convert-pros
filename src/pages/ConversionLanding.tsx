import { useParams } from "react-router-dom";
import { getConversionBySlug, CONVERSION_ROUTES } from "@/lib/conversion-routes";
import Header from "@/components/Header";
import FileConverter from "@/components/FileConverter";
import Footer from "@/components/Footer";
import AdSlot from "@/components/AdSlot";
import { Helmet } from "react-helmet-async";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const ConversionLanding = () => {
  const { slug } = useParams<{ slug: string }>();
  const route = slug ? getConversionBySlug(slug) : undefined;

  if (!route) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Conversion not found.</p>
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `Clowd Converter — ${route.h1}`,
    url: `https://clowdconverter.com/${route.slug}`,
    description: route.metaDescription,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      `Convert ${route.from} to ${route.to}`,
      "Browser-based conversion",
      "No file upload to servers",
      "Free with no sign-up",
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: route.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Clowd Converter", item: "https://clowdconverter.com" },
      { "@type": "ListItem", position: 2, name: route.h1, item: `https://clowdconverter.com/${route.slug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{route.title}</title>
        <meta name="description" content={route.metaDescription} />
        <link rel="canonical" href={`https://clowdconverter.com/${route.slug}`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>
      <Header />
      <main className="max-w-5xl mx-auto">
        <section className="text-center pt-8 pb-4 px-4 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3 tracking-tight">
            {route.h1}
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            {route.description}
          </p>
        </section>

        <FileConverter
          defaultMediaType={route.mediaType}
          defaultFormat={route.to}
        />

        <AdSlot height="100px" label="Ad Space — Leaderboard" />

        {/* How it works */}
        <section className="max-w-3xl mx-auto px-4 py-10">
          <h2 className="text-xl font-bold text-foreground mb-5">
            How to {route.h1}
          </h2>
          <div className="space-y-3">
            {route.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">{i + 1}</span>
                </div>
                <p className="text-foreground">{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        {route.faq.length > 0 && (
          <section className="max-w-3xl mx-auto px-4 py-6">
            <h2 className="text-xl font-bold text-foreground mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {route.faq.map((f, i) => (
                <div key={i} className="converter-card p-5">
                  <h3 className="font-semibold text-foreground mb-2">{f.q}</h3>
                  <p className="text-sm text-muted-foreground">{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <AdSlot height="90px" label="Ad Space — Banner" />

        {/* Related conversions */}
        <section className="max-w-3xl mx-auto px-4 py-8">
          <h3 className="text-lg font-bold text-foreground mb-4">Other Conversions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CONVERSION_ROUTES.filter((r) => r.slug !== route.slug)
              .slice(0, 6)
              .map((r) => (
                <Link
                  key={r.slug}
                  to={`/${r.slug}`}
                  className="flex items-center gap-2 text-sm text-primary font-medium hover:underline py-1"
                >
                  <ArrowRight className="w-4 h-4 shrink-0" />
                  {r.h1}
                </Link>
              ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ConversionLanding;
