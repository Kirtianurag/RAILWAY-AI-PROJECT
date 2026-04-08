import { useNavigate } from "react-router-dom";

const trains = [
  {
    trainNo: "22436",
    name: "Vande Bharat Express",
    desc: "India's fastest semi-high-speed train with premium comfort and modern interiors.",
    image:
      "https://imgeng.jagran.com/images/2025/10/16/article/image/Vande-Bharat-(1)-1760008740384-1760615822245_v.webp",
    rating: "4.8",
    fare: 1500,
    from: "Delhi",
    to: "Varanasi",
    time: "8h 00m",
  },
  {
    trainNo: "12951",
    name: "Rajdhani Express",
    desc: "High-speed overnight train connecting major cities with meals included.",
    image: "https://static.toiimg.com/photo/62913774.cms",
    rating: "4.6",
    fare: 2100,
    from: "Delhi",
    to: "Mumbai",
    time: "15h 30m",
  },
  {
    trainNo: "12001",
    name: "Shatabdi Express",
    desc: "Daytime intercity travel with speed, comfort and reliability.",
    image:
      "https://i0.wp.com/www.himachaltaxi.com/wp-content/uploads/2013/03/Shatabdi-Express-Chandigarh.jpg",
    rating: "4.5",
    fare: 1200,
    from: "Delhi",
    to: "Bhopal",
    time: "7h 45m",
  },
  {
    trainNo: "12259",
    name: "Duronto Express",
    desc: "Non-stop long-distance trains for faster overnight journeys.",
    image:
      "https://media.assettype.com/freepressjournal/2022-11/5801b6b8-1464-4915-bd69-5cc89ba66886/800px_Duronto_exp_coaches.jpg",
    rating: "4.4",
    fare: 1900,
    from: "Sealdah",
    to: "Mumbai",
    time: "17h 00m",
  },
  {
    trainNo: "22119",
    name: "Tejas Express",
    desc: "Luxury chair car train with infotainment & airline-style services.",
    image:
      "https://images.indianexpress.com/2017/05/nh21tejastrain759.jpg",
    rating: "4.7",
    fare: 1700,
    from: "Mumbai",
    to: "Goa",
    time: "10h 30m",
  },
  {
    trainNo: "12565",
    name: "Humsafar Express",
    desc: "Affordable AC-3 tier travel with modern amenities.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/b/b1/The_Humsafar_Train_with_added_features_being_inspected_by_the_Union_Minister_for_Railways%2C_Shri_Suresh_Prabhakar_Prabhu%2C_at_Safdarjung_Railway_Station%2C_New_Delhi_on_June_14%2C_2017.jpg",
    rating: "4.3",
    fare: 1100,
    from: "Patna",
    to: "Delhi",
    time: "14h 20m",
  },
];

const AIRecommendedTrains = () => {
  const navigate = useNavigate();

  const handleBooking = (train) => {
    navigate("/book-ticket", {
      state: {
        autoSelect: true,
        train: {
          trainNo: train.trainNo,
          name: train.name,
          from: train.from,
          to: train.to,
          departure: train.departure,
          arrival: train.arrival,
          duration: train.duration,
          days: train.days,
          fare: train.fare,
          classes: ["1A", "2A", "3A", "SL"],
          availability: {
            "1A": "AVL 2",
            "2A": "RAC 3",
            "3A": "WL 4",
            "SL": "AVL 6",
          }
        }
      }
    });
  };

  return (
    <div className="mt-20">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
        🤖 AI Recommended Trains
      </h2>

      <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
        {trains.map((train) => (
          <div
            key={train.trainNo}  
            className="min-w-[300px] max-w-[300px] h-[500px] rounded-2xl overflow-hidden bg-white/10 backdrop-blur-lg shadow-xl "
          >
            <img
              src={train.image}
              alt={train.name}
              className="w-full h-48 object-cover"
            />

            <div className="p-5 flex flex-col h-[calc(100%-12rem)]">

              <h3 className="text-xl font-bold">{train.name}</h3>
              <p className="text-gray-400 text-sm mt-2">{train.desc}</p>

              <div className="mt-4 space-y-1 text-sm text-gray-300">
                <p>⭐ Rating: <span className="text-cyan-400">{train.rating}</span></p>
                <p>💰 Fare: <span className="text-green-400">₹{train.fare}</span></p>
                <p>📍 Route: {train.from} → {train.to}</p>
                <p>🕒 Departure: {train.departure}</p>
                <p>⏱ Duration: {train.duration}</p>
                <p>📅 Runs: {train.days}</p>
              </div>

              <button
                onClick={() => handleBooking(train)}
                className="mt-auto w-full bg-cyan-500 hover:bg-cyan-600 py-2 rounded-lg font-semibold "

              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIRecommendedTrains;
