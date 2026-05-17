import React, { useState, useEffect, useRef } from "react";

const ChatbotWindow = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Welcome to RailConnect! Try asking: trains from Delhi to Mumbai, or status of PNR 1234567890.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setInput(transcript);
      recognition.stop();
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      const botMessage = {
        sender: "bot",
        text: data.reply || data.error || "I'm sorry, I couldn't process that.",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Connection error. Is the backend running?" },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 w-96 bg-[#172031]/95 border border-slate-800/95 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden backdrop-blur-xl transition-all duration-300">
      
      {/* HEADER */}
      <div className="bg-[#1e293b]/95 border-b border-slate-800/80 text-cyan-400 p-4 font-black text-xs tracking-wider uppercase flex justify-between items-center select-none">
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
          RailConnect Assistant
        </span>
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 transition text-sm cursor-pointer select-none"
        >
          ✕
        </button>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs max-h-80 min-h-[260px] no-scrollbar">
        {messages.map((msg, index) => {
          const isUser = msg.sender === "user";
          return (
            <div
              key={index}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl font-semibold leading-relaxed shadow-sm ${
                  isUser
                    ? "bg-cyan-500 text-white rounded-tr-none"
                    : "bg-[#0e1220] text-slate-100 border border-slate-850 rounded-tl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#0e1220] text-slate-400 border border-slate-850 rounded-2xl rounded-tl-none p-3 italic animate-pulse">
              AI Assistant is thinking...
            </div>
          </div>
        )}
        <div ref={chatEndRef}></div>
      </div>

      {/* INPUT AREA */}
      <div className="p-3 border-t border-slate-800/80 bg-[#0e1220]/50 flex items-center gap-2">
        <input
          type="text"
          className="flex-1 bg-[#0e1220] border border-slate-800 focus:border-cyan-500/80 transition text-white px-3 py-2 rounded-xl text-xs font-semibold placeholder-slate-500 outline-none"
          placeholder="Ask RailConnect Assistant..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        {/* Vector SVG Mic */}
        <button
          onClick={startListening}
          className="bg-[#172031] border border-slate-800 hover:border-slate-700 p-2.5 rounded-xl transition flex items-center justify-center cursor-pointer"
          title="Voice Search"
        >
          <svg className="w-4 h-4 text-slate-400 hover:text-slate-200 transition" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
          </svg>
        </button>

        {/* Send Button */}
        <button
          onClick={sendMessage}
          className="bg-cyan-500 hover:bg-cyan-600 transition text-white font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider shadow cursor-pointer"
        >
          Send
        </button>
      </div>

    </div>
  );
};

export default ChatbotWindow;
