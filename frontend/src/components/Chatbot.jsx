import { useState } from "react";
import ChatbotButton from "./ChatbotButton";
import ChatbotWindow from "./ChatbotWindow";

const Chatbot = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && <ChatbotWindow onClose={() => setOpen(false)} />}
      <ChatbotButton onClick={() => setOpen(!open)} />
    </>
  );
};

export default Chatbot;
