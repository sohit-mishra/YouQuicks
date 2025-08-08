import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function HomeFourth() {
  const navigate = useNavigate();

  const handleSignup = () => {
    navigate('/user/signup');
  }

  return (
    <section className="py-10 mt-30">
      <div className="mx-auto px-4 max-w-screen-xl text-center">
        <h2 className="text-4xl font-semibold mb-10">Benefits of Using Youquicks Daily</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 max-w-screen-xl mx-auto mt-10">
          
          {/* Card 1 */}
          <motion.div
            className="px-5 py-8 my-5 mx-auto text-center shadow-[0_0_18px_1px_#bfbaba]"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-xl font-semibold mb-2 h-15">Truly Free To Use!</h3>
            <p className="text-gray-700">Experience a premium quality service for free with options to upgrade for a fee.</p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            className="px-5 py-8 my-5 mx-auto text-center shadow-[0_0_18px_1px_#bfbaba]"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold mb-2 h-15">Gives You Free Views, Likes, Subscribers & Comments</h3>
            <p className="text-gray-700">Our network allows you to quickly and easily gain free subscribers, views, likes, and comments. Everything you need!</p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            className="px-5 py-8 my-5 mx-auto text-center shadow-[0_0_18px_1px_#bfbaba]"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold mb-2 h-15">Automated YouTube Growth</h3>
            <p className="text-gray-700">Enter your videos into our network and input the quantity of each service you want to receive. Then, walk away and let our network automatically deliver everything to you.</p>
          </motion.div>

          {/* Card 4 */}
          <motion.div
            className="px-5 py-8 my-5 mx-auto text-center shadow-[0_0_18px_1px_#bfbaba]"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h3 className="text-xl font-semibold mb-2 h-15">Improves Organic Growth</h3>
            <p className="text-gray-700">Gaining subscribers, views, likes and comments help increase your search rankings, which help increase your organic growth and engagement.</p>
          </motion.div>

          {/* Card 5 */}
          <motion.div
            className="px-5 py-8 my-5 mx-auto text-center shadow-[0_0_18px_1px_#bfbaba]"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h3 className="text-xl font-semibold mb-2 h-15">Saves You Time</h3>
            <p className="text-gray-700">Focus on your content and passion while our network delivers engagement to your channel and videos.</p>
          </motion.div>

          {/* Card 6 */}
          <motion.div
            className="px-5 py-8 my-5 mx-auto text-center shadow-[0_0_18px_1px_#bfbaba]"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <h3 className="text-xl font-semibold mb-2 h-15">Super Easy To Use</h3>
            <p className="text-gray-700">Our interface is user friendly and self explanatory. Login, import your videos, select the quantities of subscribers, views, likes, and comments to receive and you’re done!</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-12"
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
