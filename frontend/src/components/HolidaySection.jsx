import { useState } from "react";

const holidays = [
  {
    title: "Maharajas' Express",
    desc: "Experience royal luxury onboard India’s most prestigious train with world-class hospitality.",
    image:
      "https://www.themaharajatrain.com/wp-content/uploads/2024/09/Why-did-IRCTC-launch-the-Maharajas-Express.webp",
    details: "Step aboard the Maharajas' Express, a 5-star hotel on wheels. Traverse India's most enchanting destinations including the Taj Mahal, Jaipur, Ranthambore, and Varanasi. Enjoy exquisite fine dining, premium spirits, and regal suites that transport you to an era of unbridled luxury and royal heritage."
  },
  {
    title: "International Packages",
    desc: "Handpicked international tours including Thailand, Dubai, Europe & more.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    details: "Explore the world with curated International Holiday Packages. From the serene beaches of Bali and Thailand to the modern marvels of Dubai and the historic charm of Europe. Packages include round-trip flights, luxury accommodation, guided sightseeing, and dedicated tour managers ensuring a hassle-free vacation."
  },
  {
    title: "Domestic Air Packages",
    desc: "Spiritual & leisure tours across India – Kashmir, Goa, Kerala & more.",
    image:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da",
    details: "Discover the breathtaking diversity of India. Experience the snow-capped peaks of Kashmir, the tranquil backwaters of Kerala, or the vibrant beaches of Goa. All-inclusive air packages covering round-trip flights, premium stays, authentic meals, and meticulously planned guided sightseeing for the ultimate getaway."
  },
];

const HolidaySection = () => {
  const [selectedHoliday, setSelectedHoliday] = useState(null);

  return (
    <div className="mt-20 relative">
      <h2 className="text-xl font-black mb-8 flex items-center gap-3 uppercase tracking-widest text-slate-350 select-none">
        <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253" />
        </svg>
        Holiday Experiences
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {holidays.map((item, index) => (
          <div
            key={index}
            className="relative h-[420px] rounded-2xl overflow-hidden group shadow-xl"
          >
            {/* Background Image */}
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
            />

            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

            {/* Content */}
            <div className="absolute bottom-0 p-6">
              <h3 className="text-2xl font-bold text-white">
                {item.title}
              </h3>
              <p className="text-gray-300 mt-2 text-sm leading-relaxed">
                {item.desc}
              </p>

              <button 
                onClick={() => setSelectedHoliday(item)}
                className="mt-4 bg-cyan-500 hover:bg-cyan-600 text-black px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                Explore →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedHoliday && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedHoliday(null)}
          ></div>
          
          <div className="relative w-full max-w-2xl h-[500px] rounded-2xl overflow-hidden shadow-2xl animate-fadeIn">
            {/* Modal Background */}
            <img 
              src={selectedHoliday.image} 
              alt={selectedHoliday.title} 
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Heavy overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30"></div>
            
            {/* Modal Content */}
            <div className="relative z-10 h-full flex flex-col justify-center p-8 md:p-12 text-white">
              <button 
                onClick={() => setSelectedHoliday(null)}
                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center text-xl backdrop-blur-md transition-colors"
              >
                ✕
              </button>
              
              <h2 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-4">{selectedHoliday.title}</h2>
              <div className="w-20 h-1 bg-cyan-500 mb-6"></div>
              
              <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-lg">
                {selectedHoliday.details}
              </p>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HolidaySection;
