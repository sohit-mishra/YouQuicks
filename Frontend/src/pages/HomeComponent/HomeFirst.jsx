import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Image from '@/assets/first.svg';

export default function HomeFirst() {
  const navigate = useNavigate();

  const handleSignup = () => {
    navigate('/user/signup');
  }

  const handlePremium = () => {
    navigate('/premiumservices');
  }

  return (
    <section className="py-16 px-4 mt-10 bg-white">
      <div className="mx-auto px-4 max-w-screen-xl">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-10">
          
          {/* Left Column with Text */}
          <motion.div
            className="text-center lg:text-left lg:w-1/2"
            initial={{ opacity: 0, x: -100 }}  // Initial state
            animate={{ opacity: 1, x: 0 }}     // Final state
            transition={{ duration: 1 }}       // Transition duration
          >
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-4">
              Grow your Channel with YouQuicks!
            </h1>
            <p className="text-gray-700 mb-6">
              Youquicks is a free YouTube subscribers growth platform designed to kick-start your channel through engagement from real people! Start your growth journey now.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={handleSignup}
                aria-label="Start Free YouTube Growth"
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition duration-300"
              >
                Get Free YouTube Growth Now!
              </button>
              <button
                onClick={handlePremium}
                aria-label="Buy YouTube Subscribers"
                className="bg-gray-200 text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-300 transition duration-300"
              >
                Buy YouTube Subscribers
              </button>
            </div>
          </motion.div>

          {/* Right Column with Image */}
          <motion.div
            className="lg:w-1/2 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }} // Initial state
            animate={{ opacity: 1, scale: 1 }}    // Final state
            transition={{ duration: 1.2 }}        // Transition duration
          >
            <img src={Image} alt="YouQuicks Banner" className="max-w-[500px] w-full h-auto" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
