import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import Promotion from "@/components/Promotion";
import HowSection from "@/components/HowSection";
import TrustedSection from "@/components/TrustedSection";
import OutputSection from "@/components/OutputSection";
import Image from "next/image";
import Footer from "@/components/atom/Footer";

export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <Promotion />
      <HowSection />
      <TrustedSection />
      <OutputSection />
      <Footer />
    </div>
  );
}
