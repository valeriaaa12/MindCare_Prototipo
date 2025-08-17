import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import Hero from "./components/Hero";
import Chatbot from "./Chatbot";      // <- está en src/Chatbot.tsx
import Footer from "./components/Footer";

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
      <NavBar current={view} />
      <div className="app-main">
        {view === "home" && <Hero />}
        {view === "chatbot" && <Chatbot />}
      </div>
      <Footer />
    </div>
  );
}
