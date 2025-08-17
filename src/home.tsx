import { useEffect, useState } from "react";

import Hero from "./components/Hero";
import Chatbot from "./Chatbot";      // <- está en src/Chatbot.tsx

import Carrusel from "./components/carrusel";
type View = "home" | "chatbot";

function getViewFromHash(): View {
  const h = window.location.hash.replace("#", "");
  return h === "chatbot" ? "chatbot" : "home";
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
        
      </div>
      <Carrusel /> 

    </div>
  );
}
