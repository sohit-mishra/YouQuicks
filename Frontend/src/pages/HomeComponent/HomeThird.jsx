import { FaCoins } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io5";
import { IoSettings } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

export default function HomeThird() {
  const navigate = useNavigate();

  const handleSignup = () => {
    navigate('/user/signup');
  }

  return (
    <section className="py-10 mt-30">
      <div className="mx-auto px-4 max-w-screen-xl text-center">
        <h2 className="text-4xl font-semibold mb-10">How does it Works.</h2>

        <div className="flex flex-col md:flex-row justify-center items-center gap-20 mt-20">
          <motion.div
            className="flex flex-col items-center text-center max-w-xs"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <FaCoins color="red" size={40} aria-hidden="true" className="m-2" />
            <h3 className="text-xl font-bold mb-2">Earn Coins</h3>
            <p className="py-2">Earn coins by watching videos and engaging with them.</p>
          </motion.div>

          <motion.div
            className="flex flex-col items-center text-center max-w-xs"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <IoLogoYoutube color="red" size={40} aria-hidden="true" className="m-2" />
            <h3 className="text-xl font-bold mb-2">Spend Your Coins</h3>
            <p className="py-2">Spend your coins to receive free views, likes, subscribers and comments.</p>
          </motion.div>

          <motion.div
            className="flex flex-col items-center text-center max-w-xs"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <IoSettings color="red" size={40} aria-hidden="true" className="m-2" />
            <h3 className="text-xl font-bold mb-2">Get Results</h3>
            <p className="py-2">Sit back while you receive subscribers, views, likes and comments!</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20"
        >
        <Button
          onClick={handleSignup}
          className="w-[180px] m-auto bg-red-500 text-white flex items-center justify-center gap-1 py-7 px-40 rounded-[50px] hover:bg-red-600 transition-all duration-300"
        >
          Register your Free Account Now
        </Button>
        </motion.div>
      </div>
    </section>
  );
}
