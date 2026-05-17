const ChatbotButton = ({ open, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-radial-[at_50%_75%] from-sky-200 via-blue-400 to-indigo-900 to-90% shadow-2xl hover:scale-110 active:scale-95 transition z-50 flex items-center justify-center cursor-pointer border border-cyan-500/25"
      title={open ? "Close Assistant" : "Open RailConnect Assistant"}
    >
      <img
        src="https://freesvg.org/img/1538298822.png"
        alt="Chatbot"
        className="w-full h-full rounded-full"
      />
    </button>
  );
};

export default ChatbotButton;
