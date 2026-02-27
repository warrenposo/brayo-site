import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MarketSection from "@/components/MarketSection";
import WhySection from "@/components/WhySection";
import TestimonialsSection from "@/components/TestimonialsSection";
import LearnMoreSection from "@/components/LearnMoreSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <MarketSection />
      <WhySection />
      <TestimonialsSection />
      <LearnMoreSection />
      <Footer />
    </div>
  );
};

export default Index;
