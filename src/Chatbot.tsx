import React, { useEffect, useRef, useState } from "react";
import "./../styles/chat.css";

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
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }), // [{role:'user'|'assistant', content:string}]
        });


      if (!res.ok) throw new Error("Error en /api/chat");

      // Streaming opcional (si devuelves texto normal, usa res.json())
      const reader = res.body?.getReader();
      let assistantText = "";
      if (reader) {
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          assistantText += decoder.decode(value);
          // pinta el mensaje en vivo
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.role === "assistant" && last.id.startsWith("stream-")) {
              return [...prev.slice(0, -1), { ...last, content: assistantText }];
            }
            return [...prev, { id: "stream-" + crypto.randomUUID(), role: "assistant", content: assistantText }];
          });
        }
      } else {
        // fallback sin streaming
        const data = await res.json();
        assistantText = data.reply ?? "";
        setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", content: assistantText }]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: "Lo siento, hubo un problema al responder 🤕." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <section className="py-4">
      <div className="container">
        <div className="chat-card shadow">
          {/* header opcional dentro de la tarjeta */}
          <div className="chat-body">
            {messages.map((m) => (
              <div key={m.id} className={`msg-row ${m.role}`}>
                <div className="avatar">{m.role === "assistant" ? "🤖" : "🧑"}</div>
                <div className={`bubble ${m.role}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="msg-row assistant">
                <div className="avatar">🤖</div>
                <div className="bubble assistant typing">Mindy está escribiendo…</div>
              </div>
            )}
            <div ref={scrollRef} />
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
            <button className="btn btn-primary send-btn" onClick={sendMessage} disabled={loading || !input.trim()}>
              <i className="bi bi-send"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
