import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import Promotion from "@/components/Promotion";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <Promotion />
    </div>
  );
}
