import Logo from "@/assets/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {
  const navigate = useNavigate();

  const handleSignup = () => {
    navigate("/user/signup");
  };

  const handleLogin = () => {
    navigate("/user/login");
  };

  return (
    <motion.header
      className="bg-white shadow-md py-4 sticky top-0 z-50"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto px-4 max-w-screen-xl text-center flex items-center justify-between">
        <Link to="/">
          <motion.img
            src={Logo}
            alt="youquick logo"
            className="h-12 w-[160px]"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          />
        </Link>

        <ul className="hidden md:flex space-x-6">
          {["Home", "Premium Services", "Contact Us", "FAQ"].map(
            (item, index) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Link
                  to={
                    item === "Home"
                      ? "/"
                      : `/${item.toLowerCase().replace(/\s/g, "")}`
                  }
                  className="text-gray-700"
                >
                  {item}
                </Link>
              </motion.li>
            )
          )}
        </ul>

        <div className="flex space-x-4">
          <motion.button
            onClick={handleLogin}
            className="text-[black] font-semibold hover:text-red transition duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Log in
          </motion.button>

          <motion.button
            onClick={handleSignup}
            className="bg-[red] text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-600 transition duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            Sign up
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
