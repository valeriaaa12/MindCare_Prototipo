import { useEffect, useState } from "react";
import Cita from "./cita";
import Hero from "./components/Hero";
import Chatbot from "./Chatbot";      
import UpgradePlans from "./plans";
import Carrusel from "./components/carrusel";
import Recursos from "./recursos";
type View = "home" | "chatbot" | "cita" | "planes" | "recursos";
function getViewFromHash(): View {
  const h = window.location.hash.replace("#", "");
  if (h === "chatbot") return "chatbot";
  if (h === "cita") return "cita";
  if (h === "planes") return "planes";
  if (h === "recursos") return "recursos";
  return "home";
}

export default function App() {
  const [view, setView] = useState<View>(getViewFromHash());

  useEffect(() => {
    const onHashChange = () => setView(getViewFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <div className="app-shell bg-soft">
 
      <div className="app-main">
        {view === "home" && <Hero />}
        {view === "chatbot" && <Chatbot />}
        {view === "cita" && <Cita />}
        {view === "planes" && <UpgradePlans />}
        {view === "recursos" && <Recursos />}
      </div>
      <Carrusel /> 

    </div>
  );
}
