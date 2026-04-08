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
  const trains = [
  { trainNo: "12951", name: "Mumbai Rajdhani Express", from: "Mumbai Central", to: "New Delhi", departure: "16:35", arrival: "08:35", zone: "Western Railway", days: "Mon, Wed, Fri" },
  { trainNo: "22221", name: "CSMT Rajdhani Express", from: "Mumbai CSMT", to: "New Delhi", departure: "16:35", arrival: "08:10", zone: "Central Railway", days: "Daily" },
  { trainNo: "12301", name: "Howrah Rajdhani Express", from: "Howrah", to: "New Delhi", departure: "16:50", arrival: "10:00", zone: "Eastern Railway", days: "Daily" },
  { trainNo: "12002", name: "Bhopal Shatabdi Express", from: "New Delhi", to: "Bhopal", departure: "06:00", arrival: "14:30", zone: "Northern Railway", days: "Daily" },
  { trainNo: "12009", name: "Mumbai Shatabdi Express", from: "Mumbai", to: "Ahmedabad", departure: "06:00", arrival: "12:10", zone: "Western Railway", days: "Daily" },
  { trainNo: "12220", name: "Hyderabad Duronto Express", from: "Hyderabad", to: "Mumbai", departure: "20:15", arrival: "08:30", zone: "South Central Railway", days: "Daily" },
  { trainNo: "12290", name: "Mumbai Duronto Express", from: "Mumbai Central", to: "Delhi", departure: "23:25", arrival: "16:00", zone: "Western Railway", days: "Daily" },
  { trainNo: "22436", name: "Vande Bharat Express", from: "New Delhi", to: "Varanasi", departure: "06:00", arrival: "14:00", zone: "Northern Railway", days: "Mon-Fri" },
  { trainNo: "22439", name: "Vande Bharat Express", from: "Delhi", to: "Katra", departure: "06:00", arrival: "14:00", zone: "Northern Railway", days: "Daily" },
  { trainNo: "12909", name: "Garib Rath Express", from: "Mumbai Central", to: "Hazrat Nizamuddin", departure: "16:55", arrival: "09:55", zone: "Western Railway", days: "Mon, Thu" },
  { trainNo: "12627", name: "Karnataka Express", from: "Bangalore", to: "New Delhi", departure: "19:20", arrival: "10:30", zone: "South Western Railway", days: "Daily" },
  { trainNo: "12801", name: "Purushottam Express", from: "Puri", to: "New Delhi", departure: "21:45", arrival: "07:10", zone: "East Coast Railway", days: "Daily" },
  { trainNo: "12137", name: "Punjab Mail", from: "Mumbai", to: "Firozpur", departure: "19:35", arrival: "05:00", zone: "Central Railway", days: "Daily" },
  { trainNo: "12295", name: "Sanghamitra Express", from: "Bangalore", to: "Patna", departure: "09:00", arrival: "19:00", zone: "South Western Railway", days: "Daily" },
  { trainNo: "12555", name: "Gorakhdham Express", from: "Gorakhpur", to: "Hisar", departure: "05:00", arrival: "21:00", zone: "North Eastern Railway", days: "Daily" },

  
  { trainNo: "12952", name: "New Delhi Rajdhani Express", from: "New Delhi", to: "Mumbai Central", departure: "16:25", arrival: "08:15", zone: "Western Railway", days: "Mon, Wed, Fri" },
  { trainNo: "22222", name: "CSMT Rajdhani Express", from: "New Delhi", to: "Mumbai CSMT", departure: "16:55", arrival: "08:35", zone: "Central Railway", days: "Daily" },
  { trainNo: "12954", name: "August Kranti Rajdhani Express", from: "Hazrat Nizamuddin", to: "Mumbai Central", departure: "16:50", arrival: "09:45", zone: "Western Railway", days: "Daily" },

  { trainNo: "13238", name: "Varanasi Patna MEMU Express", from: "Varanasi", to: "Patna", departure: "14:00", arrival: "19:00", zone: "East Central Railway", days: "Daily" },
  { trainNo: "13006", name: "Amritsar Howrah Mail", from: "Varanasi", to: "Patna", departure: "08:15", arrival: "12:30", zone: "Eastern Railway", days: "Daily" },
  { trainNo: "13134", name: "Varanasi Sealdah Express", from: "Varanasi", to: "Patna", departure: "22:30", arrival: "03:45", zone: "Eastern Railway", days: "Daily" }
];


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
  // SEARCH FUNCTION
  // =========================
  const searchTrain = (query) => {
    const lower = query.toLowerCase().trim();

    // Search by number
    if (/^\d+$/.test(lower)) {
      return trains.filter((t) => t.trainNo === lower);
    }

    // Search by route
    if (lower.includes("to")) {
      const parts = lower.split("to");
      const from = parts[0].trim();
      const to = parts[1].trim();

      return trains.filter(
        (t) =>
          t.from.toLowerCase().includes(from) &&
          t.to.toLowerCase().includes(to)
      );
    }

    // Search by name
    return trains.filter((t) =>
      t.name.toLowerCase().includes(lower)
    );
  };

  // =========================
  // SEND MESSAGE
  // =========================
  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };

    const results = searchTrain(input);

    let botMessage;

    if (results.length > 0) {
      botMessage = {
        sender: "bot",
        text: results.map((t) => (
          <div key={t.trainNo} className="mb-2 border p-2 rounded bg-gray-100">
            🚆 <b>{t.name} ({t.trainNo})</b><br />
            From: {t.from}<br />
            To: {t.to}<br />
            Departure: {t.departure}<br />
            Arrival: {t.arrival}<br />
            Zone: {t.zone}<br />
            Days: {t.days}
          </div>
        )),
      };
    } else {
      botMessage = {
        sender: "bot",
        text: "❌ No train found.",
      };
    }

    setMessages([...messages, userMessage, botMessage]);
    setInput("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-6 w-96 bg-white rounded-xl shadow-2xl flex flex-col">
      {/* HEADER */}
      <div className="bg-blue-600 text-white p-3 font-bold rounded-t-xl flex justify-between">
        🚆 Railway AI Assistant
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
