import { motion } from 'framer-motion';
import Phone from '@/assets/phone.png';
import Food from '@/assets/food.png';
import Laptop from "@/assets/laptop.png";

export default function HomeSecond() {
  return (
    <>
      <section className="py-10 mt-30">
        <div className="mx-auto px-4 max-w-screen-xl text-center">
          <h2 className="text-4xl font-semibold mb-10">Customer Testimonials</h2>

          <div className="flex flex-col md:flex-row justify-center items-center gap-10 mt-20">
            <motion.div
              className="px-0 py-0 my-5 mx-auto text-center shadow-lg rounded-tl-lg rounded-tr-lg max-w-xs overflow-hidden h-[450px] border-t-4 border-gray-200"
              style={{ margin: "40px auto 60px", boxShadow: "0px 0px 18px 4px #bfbaba" }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
            >
              <img src={Phone} alt="Phone Image" className="mx-auto mb-4" />
              <div className="mt-10 px-2">
                <h4 className="text-xl font-semibold mb-2 text-[#0abb87]">Fantastic Product</h4>
                <p className="text-gray-700 mb-2">Where have you been for the past few years?</p>
                <h5 className="font-semibold">@bobbyNYchannel</h5>
              </div>
            </motion.div>

            <motion.div
              className="px-0 py-0 my-5 mx-auto text-center shadow-lg rounded-tl-lg rounded-tr-lg max-w-xs overflow-hidden h-[450px]"
              style={{ margin: "40px auto 60px", boxShadow: "0px 0px 18px 4px #bfbaba" }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img src={Food} alt="Food Image" className="mx-auto mb-4" />
              <div className="mt-10 px-2">
                <h4 className="text-xl font-semibold mb-2 text-[#0abb87]">What a great SERVICE!</h4>
                <p className="text-gray-700 mb-2">Thank you so much guys for such a great service! Youquick is THE BEST APP EVER!</p>
                <h5 className="font-semibold">@diana1987</h5>
              </div>
            </motion.div>

            <motion.div
              className="px-0 py-0 my-5 mx-auto text-center shadow-lg rounded-tl-lg rounded-tr-lg max-w-xs overflow-hidden h-[450px]"
              style={{ margin: "40px auto 60px", boxShadow: "0px 0px 18px 4px #bfbaba" }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <img src={Laptop} alt="Laptop Image" className="mx-auto mb-4" />
              <div className="mt-10 px-2">
                <h4 className="text-xl font-semibold mb-2 text-[#0abb87]">It's helping me enhance my channel…</h4>
                <p className="text-gray-700 mb-2">This was the boost we needed to get our page into the spotlight quickly!</p>
                <h5 className="font-semibold">@janetteDemoAcc</h5>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
