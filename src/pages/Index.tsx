import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FileConverter from "@/components/FileConverter";
import AdSlot from "@/components/AdSlot";
import FeaturesSection from "@/components/FeaturesSection";
import FAQSection from "@/components/FAQSection";
import PopularConversions from "@/components/PopularConversions";
import Footer from "@/components/Footer";

const Index = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Clowd Converter",
    url: "https://clowdconverter.com",
    description: "Convert videos, audio, and images instantly for free. Browser-based, no upload needed. Fast, private, and secure.",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Video conversion (MP4, WebM, MOV, AVI, MKV, FLV)",
      "Audio conversion (MP3, WAV, OGG, AAC, FLAC, M4A)",
      "Image conversion (JPG, PNG, WebP, GIF, BMP)",
      "Browser-based processing",
      "No file uploads to servers",
      "Free with no sign-up required",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "12400",
    },
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Clowd Marketing",
    url: "https://clowdconverter.com",
    logo: "https://clowdconverter.com/logo.png",
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Clowd Converter — Free Video, Audio & Image Converter</title>
        <meta name="description" content="Convert videos, audio, and images instantly for free. No sign-up, no uploads — files are processed in your browser. Fast, secure, and private." />
        <link rel="canonical" href="https://clowdconverter.com" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(orgJsonLd)}</script>
      </Helmet>
      <Header />
      <main className="max-w-5xl mx-auto">
        <HeroSection />
        <FileConverter />
        <AdSlot height="100px" label="Ad Space — Leaderboard" />
        <FeaturesSection />
        <AdSlot height="90px" label="Ad Space — Banner" />
        <FAQSection />
        <PopularConversions />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
