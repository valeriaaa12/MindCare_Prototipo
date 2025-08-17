import React, { useEffect, useRef, useState } from "react";
import "./styles/chat.css";

type Msg = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
};

export default function ChatBot() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content:
        "¡Hola! Soy Mindy, tu asistente emocional virtual 🌈. Estoy aquí para escucharte y acompañarte. ¿Cómo te sientes hoy?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  const sendMessage = async () => {
  const text = input.trim();
  if (!text || loading) return;

  const userMsg: Msg = { id: crypto.randomUUID(), role: "user", content: text };
  setMessages(prev => [...prev, userMsg]);
  setInput("");
  setLoading(true);

  try {
    const payload = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));

  const res = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ messages: payload }),
});

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json(); // { reply: string }
    const assistantText = data.reply ?? "Lo siento, no tengo respuesta ahora.";
    setMessages(prev => [...prev, { id: crypto.randomUUID(), role: "assistant", content: assistantText }]);
  } catch (e) {
    setMessages(prev => [...prev, {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "Lo siento, hubo un problema al responder 🤕."
    }]);
  } finally {
    setLoading(false);
  }
};


  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };


   return (
    <main className="chatpage-bg d-flex align-items-center py-4">
      <div className="container">
        <div className="chat-card shadow mx-auto">
          <div className="chat-body">
            {messages.map((m) => (
              <div key={m.id} className={`msg-row ${m.role}`}>
                {m.role === "assistant" && <div className="avatar">🤖</div>}
                <div className={`bubble ${m.role}`}>{m.content}</div>
                {m.role === "user" && <div className="avatar">🧑</div>}
              </div>
            ))}
            {loading && (
              <div className="msg-row assistant">
                <div className="avatar">🤖</div>
                <div className="bubble assistant typing">Mindy está escribiendo…</div>
              </div>
            )}
          </div>

          <div className="chat-input">
             <input
                className="form-control"
                placeholder="Escribe tu mensaje…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                disabled={loading}
              />
              <button className="btn  send-btn " style={{ background: "var(--mc-purple)", color: "#fff" }} onClick={sendMessage} disabled={loading || !input.trim()}>
                <i className="bi bi-send"></i>
              </button>
          </div>
        </div>
      </div>
    </main>
  );

}
