import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FaqImage from '@/assets/faq.png';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function Faq() {
  const navigate = useNavigate();
  const handleSignup = () => {
    navigate('/user/signup');
  };

  return (
    <motion.section
      className="faq py-10 px-4 max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h1
        className="text-4xl font-bold text-center mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        FAQ
      </motion.h1>

      <motion.p
        className="text-center mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Do you have a question about Youquicks? See the list below for our most frequently asked questions. <br />
        If your question is not listed here, then please contact us.
      </motion.p>

      <div className="flex flex-col md:flex-row gap-10 items-center">
        <motion.div
          className="flex-1"
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I get started?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">Simply register, then login and visit the “Earn Coin” section to begin watching videos. Each video you watch, like, comment and subscribe on will earn you coins.</p>
                <p className="mb-2">Once you have coins to spend, import your videos in the “Drashboard” section and choose the quantity of subscribers, watch, likes and comments you want to receive on each video.</p>
                <p className="mb-2">Submit your orders and sit back while our network delivers everything!</p>
                <p>Continue earning coins for free so you can order more services to your videos, or visit “Buy Coins” to purchase them instead.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>How fast do you deliver the services?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">All services that our network delivers are completed by the community of registered YouQuicks users who complete actions to earn coins. This means that the delivery speed depends on user activity and demand.</p>
                <p className="mb-2">If you want your orders to be delivered quicker, visit the “Membership” page, where you can upgrade to the Gold or Platinum plans for a fee and receive “Prioritized Transactions”.</p>
                <p>The Gold and Platinum plans will put your videos ahead of the others for faster service!</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>

        <motion.div
          className="flex-1 flex justify-center items-center"
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <img src={FaqImage} alt="FAQ illustration" className="max-w-full h-auto rounded" />
        </motion.div>
      </div>

      <motion.div
        className="bg-white p-10 rounded-lg shadow-[0px_0px_50px_10px_rgb(255,205,205)] w-full max-w-2xl my-10 mx-auto"
        initial={{ scale: 0.95, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <h1 className="text-4xl font-bold mb-4 text-center">What are you waiting for?</h1>
        <p className="text-lg mb-6 text-center">
          Join our free network and start getting subscribers, watch, likes and comments today!
        </p>
        <Button
          onClick={handleSignup}
          className="block mx-auto bg-red-500 text-white font-semibold px-6 h-auto py-3 rounded-lg hover:bg-red-600 transition"
        >
          Register Now
        </Button>
      </motion.div>
    </motion.section>
  );
}
