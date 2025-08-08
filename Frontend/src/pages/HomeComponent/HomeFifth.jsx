import { FaUserCheck, FaMousePointer } from "react-icons/fa";
import { IoRocketSharp } from "react-icons/io5";
import { VscTriangleRight } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function HomeFifth() {
  const navigate = useNavigate();

  const handleSignup = () => {
    navigate('/user/signup');
  };

  return (
    <section className="py-10 mt-30">
      <div className="mx-auto px-4 max-w-screen-xl text-center">
        <h2 className="text-4xl font-semibold mb-10">
          Receive free YouTube subscribers, or try our premium subscribers, views and likes for even quicker growth!
        </h2>

        <div className="flex flex-col md:flex-row justify-center items-center gap-20 mt-20">
         
          <motion.div
            className="flex flex-col items-center text-center max-w-xs"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <FaUserCheck color="red" size={40} aria-hidden="true" className="m-2" />
            <h3 className="text-xl font-bold mb-2">Signup & Login</h3>
            <p className="py-2">Signing up & logging in takes 30 seconds!</p>
          </motion.div>

         
          <motion.div
            className="flex flex-col items-center text-center max-w-xs"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <FaMousePointer color="red" size={40} aria-hidden="true" className="m-2" />
            <h3 className="text-xl font-bold mb-2 ">Activate a Plan</h3>
            <p className="py-2">Activate our extremely popular & effective free plan, or try a paid plan.</p>
          </motion.div>

         
          <motion.div
            className="flex flex-col items-center text-center max-w-xs"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <IoRocketSharp color="red" size={40} aria-hidden="true" className="m-2" />
            <h3 className="text-xl font-bold mb-2">Watch Your Channel Grow</h3>
            <p className="py-2">Watch your channel’s subscribers and video likes increase!</p>
          </motion.div>
        </div>

       
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12"
        >
          <Button
            onClick={handleSignup}
            className="w-[180px] m-auto bg-red-500 text-white flex items-center justify-center gap-1 py-7 px-40 rounded-[50px] hover:bg-red-600 transition-all duration-300"
          >
            <VscTriangleRight color="white" size={20} />
            Let me in now!
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
