import React from 'react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

export default function Affiliates() {
  return (
    <motion.section
      className="py-16 mt-5 mb-20 overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="mx-auto px-4 max-w-screen-xl text-center">
        <motion.h1
          className='text-[#0abb87] text-center text-3xl font-bold'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Affiliates
        </motion.h1>

        <motion.p
          className='text-left text-xl py-8'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Our program is free to join. It’s easy to sign-up and requires no technical knowledge. Affiliate programs
          are common throughout the Internet and offer website owners an additional way to profit from their
          websites.
        </motion.p>

        <motion.h3
          className='text-black text-left text-3xl font-bold'
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          How Does It Work?
        </motion.h3>

        <motion.p
          className='text-left text-xl py-8'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          When you join our affiliate program, you will be supplied with a unique URL link that you can place
          within your website or share via email or on your social media pages. When a user clicks on one of your
          unique links, they will be brought to our website and their activity will be tracked by our affiliate
          software. You will earn a commission when they make any purchases.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.4 }}
        >
          <Button className="w-full text-2xl bg-[#0abb87] text-white font-semibold px-6 py-7 hover:bg-red-500 transition duration-300">
            Coming Soon
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
}
