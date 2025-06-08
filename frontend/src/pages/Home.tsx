import React, { useState, useEffect, useRef } from "react";
import "./Home.css";

interface Message {
  sender: "user" | "ai";
  text: string;
}

// ✅ Generate valid MongoDB ObjectId
function generateObjectId() {
  const timestamp = Math.floor(Date.now() / 1000).toString(16);
  const random = Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
  return (timestamp + random).slice(0, 24);
}

let sessionId = localStorage.getItem("sessionId");
if (!sessionId || sessionId.length !== 24 || !/^[0-9a-f]{24}$/.test(sessionId)) {
  sessionId = generateObjectId();
  localStorage.setItem("sessionId", sessionId);
  console.log("New sessionId:", sessionId);
}

const Home: React.FC = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chatBoxRef = useRef<HTMLDivElement>(null);

  // ✅ Auto-scroll to bottom when messages change
  useEffect(() => {
  if (chatBoxRef.current) {
    chatBoxRef.current.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: "smooth", // ⬅️ adds eased scrolling
    });
  }
}, [messages, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage: Message = { sender: "user", text: query };
    setMessages((prev) => [...prev, userMessage]);
    setQuery("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: userMessage.text,
          sessionId,
        }),
      });

      if (!res.ok) throw new Error("Failed to fetch response from server.");
      const data = await res.json();
      const aiText = (data.result || "No response.").replace(/\\n/g, "\n");
      setMessages((prev) => [...prev, { sender: "ai", text: aiText }]);
    } catch (err: any) {
      setError(err.message || "Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fancy-container">
      <div className="fancy-card chat-container">
        <h1>💬 Healthcare AI Assistant</h1>
        <div className="chat-box" ref={chatBoxRef}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${msg.sender === "user" ? "user" : "ai"}`}
            >
              {msg.text.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          ))}
          {loading && <p className="ai">⏳ Thinking...</p>}
        </div>

        <form onSubmit={handleSubmit} className="fancy-form">
          <textarea
            className="fancy-textarea"
            placeholder="Ask a health question..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
          />
          <button className="fancy-button" disabled={loading}>
            Send
          </button>
        </form>

        {error && <div className="fancy-error">⚠️ {error}</div>}
      </div>
    </div>
  );
};

export default Home;
