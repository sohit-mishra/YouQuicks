import Client1 from '@/assets/clients1.png';
import Client2 from '@/assets/clients2.png';
import Client3 from '@/assets/client3.png';
import Client4 from '@/assets/client4.png';
import { FaRegStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const testimonials = [
  {
    img: Client1,
    title: 'Thank you so much Youquicks',
    text: 'Thank you so much Youquicks, I wish I could give you 10 stars. I love you all, and the fantastic work you do.',
    name: '@Brian C.',
  },
  {
    img: Client2,
    title: "Don't doubt a second!",
    text: "Youquicks, thank you so much for your help, you made my channel grow three times as big as it was when I started your free activation's. I went from just under 100 Subs to over 300 in a few weeks time!",
    name: '@Lia-Paris',
  },
  {
    img: Client3,
    title: 'First-Class Service!',
    text: 'I purchased YouTube Views, Likes and Subscribers for my channel and they delivered everything plus some bonus ones free of charge! I will be using Youquicks over and over!',
    name: '@Kylie-SuperStar',
  },
  {
    img: Client4,
    title: 'Best Support Ever!',
    text: 'Quick responses, reliable service, and my subscribers actually increased. Definitely recommending Youquicks to all new YouTubers.',
    name: '@Mike J.',
  },
];

export default function HomeSixth() {
  return (
    <section className="py-10 mt-30">
      <div className="mx-auto px-4 max-w-screen-xl text-center">
        <h2 className="text-4xl font-semibold mb-4">Trusted by 500,000+ Clients</h2>
        <p className="mb-12 text-gray-600">See what our customers are saying about Youquicks</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              className="relative p-6 border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 bg-white text-left flex flex-col justify-between h-full"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
            >
              <img src={item.img} alt={`Client ${index + 1}`} className="opacity-60 mb-4 rounded-md" />

              <h4 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h4>

              <div className="flex text-yellow-400 mb-3">
                {Array(5).fill().map((_, i) => (
                  <FaRegStar key={i} size={18} />
                ))}
              </div>

              <p className="text-gray-600 mb-4">{item.text}</p>

              <span className="text-[#0abb87] font-medium">{item.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
