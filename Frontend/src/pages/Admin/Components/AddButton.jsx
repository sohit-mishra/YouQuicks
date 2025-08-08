import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function AddButton({ title, link }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (link) {
      navigate(link);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="hidden sm:flex w-full px-4 pt-0 pb-5 justify-between items-center bg-gray-100 text-gray-800"
    >
      <div className="flex flex-col">
        <h2 className="text-4xl font-semibold">{title}</h2>
      </div>

      <div className="flex flex-col items-end gap-4 pb-3 font-semibold">
        {link ? <Button onClick={handleClick}>Add {title}</Button> : ""}
        <div className="text-md flex font-semibold">
          <div>Dashboard /&nbsp;</div>
          <div>{title}</div>
        </div>
      </div>
    </motion.div>
  );
}
