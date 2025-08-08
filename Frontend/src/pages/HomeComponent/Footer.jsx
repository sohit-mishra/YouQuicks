import logo from "@/assets/logo.svg";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaTelegram,
  FaInstagramSquare,
  FaFacebook,
  FaWhatsapp,
} from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Footer() {
  const [data, setData] = useState([]);

  const Facebook = data.facebook || "youquicks";
  const Instgram = data.instagram || "youquicks";
  const Telegram = data.telegram || "@youquicks";
  const Email = data.email || "support@youquicks.com";
  const PhoneNumber = data.phone ? `+${data.phone}` : "+919671619743";
  const FormattedPhoneNumber = `+91 ${PhoneNumber.slice(
    3,
    5
  )} ${PhoneNumber.slice(5, 8)} ${PhoneNumber.slice(8)}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/social-media`
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-white py-10"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mx-auto px-4 max-w-screen-xl text-center lg:text-left">
        <div>
          <Link to="/">
            <img
              src={logo}
              alt="YouQuick logo"
              className="h-[50px] sm:h-[60px] md:h-[70px] lg:h-[80px] w-auto mx-auto lg:mx-0 mb-4"
            />
          </Link>
          <p className="text-gray-600">
            Get free YouTube views, subscribers, comments, and likes using our
            simple & effective network.
          </p>
        </div>

      
        <div>
          <h4 className="font-semibold text-xl text-gray-800 mb-4">
            YouTube Services
          </h4>
          {["Subscribers", "Watch Hours", "Likes", "Comments"].map(
            (service, idx) => (
              <Link
                to="/user/dashboard"
                key={idx}
                className="block text-gray-600 mb-2 hover:underline"
              >
                {service}
              </Link>
            )
          )}
        </div>

       
        <div>
          <h4 className="font-semibold text-xl text-gray-800 mb-4">Service</h4>
          <Link
            to="/affiliates"
            className="block text-gray-600 mb-2 hover:underline"
          >
            Affiliates
          </Link>
          <Link to="/blog" className="block text-gray-600 mb-2 hover:underline">
            Blog
          </Link>
          <Link
            to="/contactus"
            className="block text-gray-600 mb-2 hover:underline"
          >
            Contact Us
          </Link>
          <Link to="/faq" className="block text-gray-600 mb-2 hover:underline">
            FAQ
          </Link>
        </div>

        <div>
          <h4 className="font-semibold text-xl text-gray-800 mb-4">
            Contact Us
          </h4>
          <a
            href={`mailto:${Email}`}
            className="flex items-center justify-center lg:justify-start text-gray-600 mb-2"
            aria-label="Email us"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MdOutlineMail size={20} className="mr-2" /> {Email}
          </a>
          <a
            href={`https://api.whatsapp.com/send/?phone=${PhoneNumber}&text=Hi`}
            className="flex items-center justify-center lg:justify-start text-gray-600 mb-2"
            aria-label="Contact via WhatsApp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp size={20} className="mr-2" /> {FormattedPhoneNumber}
          </a>
          <div className="flex justify-center lg:justify-start gap-4 mt-4">
            <a
              href={`https://www.facebook.com/${Facebook}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebook size={24} />
            </a>
            <a
              href={`https://web.telegram.org/k/#@${Telegram}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
            >
              <FaTelegram size={24} />
            </a>
            <a
              href={`https://www.instagram.com/${Instgram}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagramSquare size={24} />
            </a>
          </div>
        </div>
      </div>

      <hr className="my-8 border-gray-200" />
      <div className="text-center text-gray-500">
        <p>
          &#169; {new Date().getFullYear()} YouQuicks.com — All Rights Reserved
        </p>
      </div>
    </motion.footer>
  );
}
