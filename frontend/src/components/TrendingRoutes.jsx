const routes = [
  {
    route: "Delhi → Patna",
    tag: "High Demand",
    desc: "Fast-moving route with heavy daily bookings and limited seats.",
    imgLeft: "https://media.newindianexpress.com/newindianexpress/2024-10-07/qreitomb/new-delhi-railway-station085553.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true",
    imgRight: "https://tourism.bihar.gov.in/content/dam/bihar-tourism/images/category_a/patna/golghar/3300X2400.jpg/jcr:content/renditions/cq5dam.web.480.480.webp",
  },
  {
    route: "Mumbai → Goa",
    tag: "Cheapest Today",
    desc: "Scenic Konkan route, ideal for leisure & weekend trips.",
    imgLeft: "https://img.staticmb.com/mbcontent/images/crop/uploads/2023/5/CST-railway-station_0_1200.jpg.webp",
    imgRight: "https://assets.serenity.co.uk/58000-58999/58779/720x480.jpg",
  },
  {
    route: "Kolkata → Puri",
    tag: "Filling Fast",
    desc: "Popular spiritual route with peak seasonal demand.",
    imgLeft: "https://housing.com/news/wp-content/uploads/2023/04/Howrah-Bridge-Kolkata-Fact-guide-f.jpg",
    imgRight: "https://i0.wp.com/weekendyaari.in/wp-content/uploads/2025/05/Jagannath-Temple-Puri-%E2%80%93-Complete-Guide-.jpg?fit=720%2C480&ssl=1",
  },
];

const TrendingRoutes = () => {
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-8">🔥 Trending Routes</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {routes.map((item, index) => (
          <div
            key={index}
            className="relative h-[360px] rounded-2xl overflow-hidden shadow-xl bg-black"
          >
            {/* LEFT IMAGE */}
            <div
              className="absolute left-0 top-0 h-full w-1/2 bg-cover bg-center"
              style={{ backgroundImage: `url(${item.imgLeft})` }}
            />

            {/* RIGHT IMAGE */}
            <div
              className="absolute right-0 top-0 h-full w-1/2 bg-cover bg-center"
              style={{ backgroundImage: `url(${item.imgRight})` }}
            />

            {/* DARK OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            {/* CONTENT */}
            <div className="relative z-10 h-full flex flex-col justify-end p-6">
              <span className="mb-3 w-fit bg-cyan-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                {item.tag}
              </span>

              <h3 className="text-2xl font-bold text-white">
                {item.route}
              </h3>

              <p className="text-gray-300 text-sm mt-2 leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingRoutes;
