import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { ProofStrip } from "@/components/sections/ProofStrip";
import { Work } from "@/components/sections/Work";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { About } from "@/components/sections/About";
import { TechStrip } from "@/components/sections/TechStrip";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <ProofStrip />
        <Work />
        <Services />
        <Process />
        <About />
        <TechStrip />
        <FinalCTA />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
