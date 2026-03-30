import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FileConverter from "@/components/FileConverter";
import AdSlot from "@/components/AdSlot";
import FeaturesSection from "@/components/FeaturesSection";
import FAQSection from "@/components/FAQSection";
import PopularConversions from "@/components/PopularConversions";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
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
