const Footer = () => {
  const socialLinks = [
    {
      name: "Facebook",
      img: "https://cdn-icons-png.flaticon.com/512/733/733547.png",
      link: "https://www.facebook.com/IRCTCofficial",
    },
    {
      name: "WhatsApp",
      img: "https://cdn-icons-png.flaticon.com/512/733/733585.png",
      link: "https://www.whatsapp.com",
    },
    {
      name: "YouTube",
      img: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png",
      link: "https://www.youtube.com/@IRCTCofficial",
    },
    {
      name: "Instagram",
      img: "https://cdn-icons-png.flaticon.com/512/733/733558.png",
      link: "https://www.instagram.com/irctcofficial/",
    },
    {
      name: "LinkedIn",
      img: "https://cdn-icons-png.flaticon.com/512/174/174857.png",
      link: "https://www.linkedin.com/company/irctcofficial/",
    },
    {
      name: "Telegram",
      img: "https://cdn-icons-png.flaticon.com/512/2111/2111646.png",
      link: "https://t.me/IRCTCofficial",
    },
    {
      name: "X",
      img: "https://cdn-icons-png.flaticon.com/512/5968/5968830.png",
      link: "https://twitter.com/IRCTCofficial",
    },
  ];

  return (
    <footer className="w-full bg-gradient-to-br from-[#1e1b4b] to-[#0f172a] text-white ">

      {/* TOP SOCIAL BAR */}
      <div className="flex flex-col md:flex-row items-center justify-between px-8 py-4 border-b border-white/20">
        <p className="text-sm text-gray-200">
          Get Connected with us on social networks
        </p>

        {/* SOCIAL ICONS */}
        <div className="flex gap-3 mt-3 md:mt-0">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              title={social.name}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-110 transition"
            >
              <img
                src={social.img}
                alt={social.name}
                className="w-5 h-5"
              />
            </a>
          ))}
        </div>
      </div>

      {/* MAIN FOOTER CONTENT */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 px-8 py-12 text-sm">

        <FooterColumn title="IRCTC Trains" items={[
          "General Information",
          "Important Information",
          "Agents",
          "Enquiries",
        ]} />

        <FooterColumn title="How To" items={[
          "IRCTC Official App",
          "Advertise with us",
          "Refund Rules",
          "Disability Facilities",
        ]} />

        <FooterColumn title="IRCTC eWallet" items={[
          "Co-branded Card Benefits",
          "iPAY Payment Gateway",
          "IRCTC Zone",
          "DMRC Booking",
        ]} />

        <FooterColumn title="For Agents" items={[
          "Mobile Zone",
          "Policies",
          "Ask Disha Chatbot",
          "About Us",
        ]} />

        <FooterColumn title="Help & Support" items={[
          "Contact Us",
          "FAQs",
          "Customer Care",
          "E-Pantry",
        ]} />
      </div>

      {/* PAYMENT + COPYRIGHT */}
      <div className="bg-black/30 px-8 py-4 flex flex-col md:flex-row items-center justify-between text-xs text-gray-300">
        <p>© 2025 Intelligent Railway Booking System. All Rights Reserved.</p>

        <div className="flex gap-4 mt-3 md:mt-0">
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" className="h-6" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/d/d1/RuPay.svg" className="h-6" />
        </div>
      </div>
    </footer>
  );
};

const FooterColumn = ({ title, items }) => (
  <div>
    <h3 className="font-bold mb-4">{title}</h3>
    <ul className="space-y-2 text-gray-300">
      {items.map((item) => (
        <li key={item} className="hover:text-cyan-400 cursor-pointer">
          {item}
        </li>
      ))}
    </ul>
  </div>
);

export default Footer;
