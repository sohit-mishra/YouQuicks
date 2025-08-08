import React from 'react';
import { motion } from 'framer-motion';

export default function TopHeader({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="hidden sm:flex w-full px-4 pt-0 pb-10 justify-end items-center bg-gray-100 text-gray-800"
    >
      <div className="text-md flex font-semibold">
        <div>Dashboard /&nbsp;</div>
        <div>{children}</div>
      </div>
    </motion.div>
  );
}
