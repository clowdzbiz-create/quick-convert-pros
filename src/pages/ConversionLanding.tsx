import { useParams } from "react-router-dom";
import { getConversionBySlug, CONVERSION_ROUTES } from "@/lib/conversion-routes";
import Header from "@/components/Header";
import FileConverter from "@/components/FileConverter";
import Footer from "@/components/Footer";
import AdSlot from "@/components/AdSlot";
import { Helmet } from "react-helmet-async";
import { ArrowRight } from "lucide-react";
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
    name: `${route.h1} Online Free — Clowd Converter`,
    url: `https://clowdconverter.com/${route.slug}`,
    description: route.metaDescription,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: [
      `Convert ${route.from} to ${route.to}`,
      "Browser-based conversion — no upload",
      "Free with no sign-up",
      "Works on mobile and desktop",
    ],
  };

  const faqJsonLd = route.faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: route.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  } : null;

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to ${route.h1} Online Free`,
    description: route.metaDescription,
    totalTime: "PT1M",
    step: route.steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step,
      text: step,
    })),
    tool: { "@type": "HowToTool", name: "Clowd Converter (web browser)" },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Clowd Converter", item: "https://clowdconverter.com" },
      { "@type": "ListItem", position: 2, name: route.h1, item: `https://clowdconverter.com/${route.slug}` },
    ],
  };

  // Get related conversions (same media type first, then others)
  const related = CONVERSION_ROUTES
    .filter((r) => r.slug !== route.slug)
    .sort((a, b) => {
      if (a.mediaType === route.mediaType && b.mediaType !== route.mediaType) return -1;
      if (a.mediaType !== route.mediaType && b.mediaType === route.mediaType) return 1;
      return 0;
    })
    .slice(0, 12);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{route.title}</title>
        <meta name="description" content={route.metaDescription} />
        <link rel="canonical" href={`https://clowdconverter.com/${route.slug}`} />
        <meta property="og:title" content={route.title} />
        <meta property="og:description" content={route.metaDescription} />
        <meta property="og:url" content={`https://clowdconverter.com/${route.slug}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        {faqJsonLd && <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>}
        <script type="application/ld+json">{JSON.stringify(howToJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>
      <Header />
      <main className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="max-w-3xl mx-auto px-4 pt-4 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-1">›</span>
          <span className="text-foreground">{route.h1}</span>
        </nav>

        <section className="text-center pt-6 pb-4 px-4 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3 tracking-tight">
            {route.h1} Online Free
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            {route.description}
          </p>
        </section>

        <FileConverter defaultMediaType={route.mediaType} defaultFormat={route.to} />

        <AdSlot height="100px" label="Ad Space — Leaderboard" />

        {/* How it works */}
        <section className="max-w-3xl mx-auto px-4 py-10">
          <h2 className="text-xl font-bold text-foreground mb-5">
            How to {route.h1} — Step by Step
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

        {/* About this conversion - extra SEO content */}
        <section className="max-w-3xl mx-auto px-4 py-6">
          <h2 className="text-xl font-bold text-foreground mb-3">
            About {route.from} to {route.to} Conversion
          </h2>
          <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
            <p>
              Converting {route.from} to {route.to} is one of the most common file conversion tasks. With Clowd Converter, you can {route.h1.toLowerCase()} instantly without installing any software or creating an account.
            </p>
            <p>
              Our {route.mediaType} converter uses {route.mediaType === "image" ? "the HTML5 Canvas API" : "FFmpeg WebAssembly"} to process your files directly in your browser. This means your {route.from} files never leave your device — ensuring complete privacy and security.
            </p>
            <p>
              Whether you're on a phone, tablet, or computer, Clowd Converter works on any device with a modern web browser. No downloads, no plugins, no hassle.
            </p>
          </div>
        </section>

        {/* FAQ */}
        {route.faq.length > 0 && (
          <section className="max-w-3xl mx-auto px-4 py-6">
            <h2 className="text-xl font-bold text-foreground mb-5">
              {route.h1} — Frequently Asked Questions
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
          <h2 className="text-lg font-bold text-foreground mb-4">Related Free Converters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {related.map((r) => (
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

        {/* Blog link for SEO */}
        <section className="max-w-3xl mx-auto px-4 pb-8">
          <p className="text-sm text-muted-foreground">
            Learn more about file formats in our{" "}
            <Link to="/blog" className="text-primary hover:underline font-medium">blog and guides</Link>.
            Try our{" "}
            <Link to="/" className="text-primary hover:underline font-medium">free online file converter</Link>{" "}
            for all your conversion needs.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ConversionLanding;
