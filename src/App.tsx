import { useRef } from "react";
import { Header } from "./components/Header/Header";
import { WhatsAppButton } from "./components/WhatsAppButton/WhatsAppButton";
import { useGsapContext } from "./hooks/useGsapContext";
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
import { MascotExperience } from "./three/MascotExperience";

export default function App() {
  const root = useRef<HTMLDivElement>(null);
  useGsapContext(root);

  return (
    <div ref={root} className="site-wrap">
      <Header />
      <MascotExperience />
      <main id="contenido">
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
