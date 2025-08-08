import { FaCheckCircle } from "react-icons/fa";
import Subscriber from '@/assets/subscribergirl.png';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function HomeSeventh() {
  const navigate = useNavigate();

  const handleSignup = () => {
    navigate('/user/signup');
  };

  return (
    <section className="py-16 mt-30 overflow-hidden">
      <div className="mx-auto px-6 max-w-screen-xl bg-[#0abb87] rounded-sm">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 pt-10">

          <motion.div
            className="lg:w-1/2 text-center lg:text-left"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">What are you waiting for?</h2>
            <p className="text-white text-lg mb-6">
              Join the 500,000+ members already using YouQuick to gain free YouTube subscribers and video likes today!
            </p>
            <ul className="text-left space-y-3 mb-6 text-white">
              <li className="flex items-center gap-3"><FaCheckCircle className="text-white" /> Get Free YouTube Subscribers</li>
              <li className="flex items-center gap-3"><FaCheckCircle className="text-white" /> Get Free YouTube Watch</li>
              <li className="flex items-center gap-3"><FaCheckCircle className="text-white" /> Get Free YouTube Likes</li>
              <li className="flex items-center gap-3"><FaCheckCircle className="text-white" /> Get Free YouTube Comments</li>
            </ul>
            

            <button
              onClick={handleSignup}
              aria-label="Start gaining free YouTube subscribers and likes"
              className="bg-red-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-black transition duration-300"
            >
              I Want Free Subscribers & Likes Now!
            </button>
            </motion.div>

     
          <motion.div
            className="lg:w-1/2 flex justify-center"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={Subscriber}
              alt="Subscriber Illustration"
              className="max-w-full h-auto rounded-lg"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
