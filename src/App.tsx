import { useRef } from "react";
import { Header } from "./components/Header/Header";
import { ScrollJourney } from "./components/ScrollJourney/ScrollJourney";
import { WhatsAppButton } from "./components/WhatsAppButton/WhatsAppButton";
import { useGsapContext } from "./hooks/useGsapContext";
import { useLenis } from "./hooks/useLenis";
import { Benefits } from "./sections/Benefits/Benefits";
import { Contact } from "./sections/Contact/Contact";
import { FAQ } from "./sections/FAQ/FAQ";
import { Footer } from "./sections/Footer/Footer";
import { Hero } from "./sections/Hero/Hero";
import { Industries } from "./sections/Industries/Industries";
import { Plans } from "./sections/Plans/Plans";
import { Portfolio } from "./sections/Portfolio/Portfolio";
import { Process } from "./sections/Process/Process";
import { Services } from "./sections/Services/Services";

export default function App() {
  const root = useRef<HTMLDivElement>(null);
  useLenis();
  useGsapContext(root);

  return (
    <div ref={root} className="site-wrap">
      <Header />
      <main id="contenido">
        <ScrollJourney />
        <Hero />
        <Industries />
        <Services />
        <Plans />
        <Process />
        <Portfolio />
        <Benefits />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
