import React, { useState, useEffect, useRef } from "react";

const ChatbotWindow = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Welcome! Try: Mumbai to Delhi or train number like 12951",
    },
  ]);
  const [input, setInput] = useState("");

  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // =========================
  // TRAIN DATA
  // =========================
  const trains = []; 


  // =========================
  // AUTO SCROLL
  // =========================
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

// =========================
// SPEECH RECOGNITION
// =========================
useEffect(() => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech recognition not supported. Use Google Chrome.");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = "en-IN";
  recognition.continuous = true;        // 👈 IMPORTANT CHANGE
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    console.log("🎤 Listening...");
  };

  recognition.onresult = (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript;
    console.log("Voice detected:", transcript);

    setInput(transcript);

    recognition.stop();   // 👈 stop after getting result
  };

  recognition.onerror = (event) => {
    console.log("Speech error:", event.error);

    if (event.error === "no-speech") {
      console.log("No speech detected. Try speaking louder.");
    }
  };

  recognition.onend = () => {
    console.log("🎤 Stopped");
  };

  recognitionRef.current = recognition;
}, []);

const startListening = () => {
  if (recognitionRef.current) {
    recognitionRef.current.start();
  }
};



  // const startListening = () => {
  //   if (recognitionRef.current) {
  //     recognitionRef.current.start();
  //   }
  // };


  // =========================
  // SEND MESSAGE
  // =========================
  const [isTyping, setIsTyping] = useState(false);

  // =========================
  // SEND MESSAGE
  // =========================
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
        { sender: "bot", text: "❌ Connection error. Is the backend running?" },
      ]);
    } finally {
      setIsTyping(false);
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-6 w-96 bg-white rounded-xl shadow-2xl flex flex-col">
      {/* HEADER */}
      <div className="bg-blue-600 text-white p-3 font-bold rounded-t-xl flex justify-between">
        🚆 RailConnect Assistant
        <button onClick={() => setIsOpen(false)}>❌</button>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm max-h-96">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg ${
              msg.sender === "user"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-200 text-black"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {isTyping && (
          <div className="p-2 rounded-lg bg-gray-100 text-gray-500 italic animate-pulse">
            AI is thinking...
          </div>
        )}
        <div ref={chatEndRef}></div>
      </div>

      {/* INPUT AREA */}
      <div className="flex p-2 border-t">
        <input
          type="text"
          className="flex-1 border rounded px-2 py-1"
          placeholder="Search train..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
  onClick={startListening}
  className="mx-2 bg-gray-300 p-2 rounded flex items-center justify-center"
>
  <img
    src="https://i.fbcd.co/products/original/a7f5a253d2b3ff0e994ecbac333f8a406bf598d27f812e18e69070fc1d4ddf4e.jpg"
    alt="Mic"
    className="w-5 h-5 object-cover"
  />
</button>

        <button
          onClick={sendMessage}
          className="bg-green-600 text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatbotWindow;
