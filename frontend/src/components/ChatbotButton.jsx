import { useState } from "react";
import ChatbotWindow from "./ChatbotWindow";

const ChatbotButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* FLOATING BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-radial-[at_50%_75%] from-sky-200 via-blue-400 to-indigo-900 to-90% shadow-lg hover:scale-110 transition z-50"
      >
        <img
          src="https://freesvg.org/img/1538298822.png"
          alt="Chatbot"
          className="w-full h-full rounded-full"
        />
      </button>

      {open && <ChatbotWindow onClose={() => setOpen(false)} />}
    </>
  );
};

export default ChatbotButton;
