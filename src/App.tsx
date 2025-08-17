import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import './styles/expert.css';
import Chatbot from "./Chatbot";    
import Footer from "./components/Footer";
import Cita from "./cita";
import Home from "./home";
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
      <NavBar current={view} />
      <div className="app-main">
        {view === "home" && <Home />}
        {view === "chatbot" && <Chatbot />}
        {view === "cita" && <Cita />}
      </div>
      <Footer />
    </div>
  );
}
