import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FileConverter from "@/components/FileConverter";
import FormatAdvisor from "@/components/FormatAdvisor";
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
      "AI-powered format recommendations",
      "Browser-based processing — files never leave your device",
      "No file uploads to servers",
      "Free with no sign-up required",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "12400",
    },
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Convert Files Online for Free",
    description: "Convert video, audio, or image files instantly using Clowd Converter. No upload, no sign-up required.",
    step: [
      { "@type": "HowToStep", name: "Choose media type", text: "Select whether you want to convert a video, audio, or image file." },
      { "@type": "HowToStep", name: "Upload your file", text: "Drag and drop your file or click to browse. Files up to 500MB are supported." },
      { "@type": "HowToStep", name: "Select output format", text: "Choose your desired output format from the available options." },
      { "@type": "HowToStep", name: "Convert and download", text: "Click Convert and download your converted file. Everything is processed in your browser." },
    ],
    tool: { "@type": "HowToTool", name: "Clowd Converter (web browser)" },
    totalTime: "PT1M",
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Clowd Marketing",
    url: "https://clowdconverter.com",
    logo: "https://clowdconverter.com/favicon.png",
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Clowd Converter", item: "https://clowdconverter.com" },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Clowd Converter — Free Video, Audio & Image Converter</title>
        <meta name="description" content="Convert videos, audio, and images instantly for free. No sign-up, no uploads — files are processed in your browser. Fast, secure, and private." />
        <link rel="canonical" href="https://clowdconverter.com" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(orgJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>
      <Header />
      <main className="max-w-5xl mx-auto">
        <HeroSection />
        <FileConverter />
        <div className="px-4">
          <FormatAdvisor />
        </div>
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
