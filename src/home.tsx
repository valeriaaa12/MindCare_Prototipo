import { useEffect, useState } from "react";
import Cita from "./cita";
import Hero from "./components/Hero";
import Chatbot from "./Chatbot";      // <- está en src/Chatbot.tsx

import Carrusel from "./components/carrusel";
type View = "home" | "chatbot" | "cita";

function getViewFromHash(): View {
  const h = window.location.hash.replace("#", "");
  if (h === "chatbot") return "chatbot";
  if (h === "cita") return "cita";
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
      </div>
      <Carrusel /> 

    </div>
  );
}
