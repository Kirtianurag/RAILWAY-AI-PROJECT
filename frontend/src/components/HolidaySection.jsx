const holidays = [
  {
    title: "Maharajas' Express",
    desc: "Experience royal luxury onboard India’s most prestigious train with world-class hospitality.",
    image:
      "https://www.themaharajatrain.com/wp-content/uploads/2024/09/Why-did-IRCTC-launch-the-Maharajas-Express.webp",
  },
  {
    title: "International Packages",
    desc: "Handpicked international tours including Thailand, Dubai, Europe & more.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  },
  {
    title: "Domestic Air Packages",
    desc: "Spiritual & leisure tours across India – Kashmir, Goa, Kerala & more.",
    image:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da",
  },
];

const HolidaySection = () => {
  return (
    <div className="mt-20">
      <h2 className="text-3xl font-bold mb-10 flex items-center gap-2">
        ✈️ Holiday Experiences
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

              <button className="mt-4 bg-cyan-500 hover:bg-cyan-600 text-black px-5 py-2 rounded-lg text-sm font-semibold">
                Explore →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HolidaySection;
