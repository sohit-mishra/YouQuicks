import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Settings,
  User,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { FaCoins, FaRegAddressCard, FaTicketAlt  } from 'react-icons/fa';
import { RiCouponLine } from 'react-icons/ri';
import { MdRequestPage , MdSubscriptions} from 'react-icons/md';
import { motion } from 'framer-motion';

const sidebarItems = [
  { icon: <Home size={18} />, label: 'Dashboard', path: '/employee/dashboard' },
  { icon: <User size={18} />, label: 'User', path: '/employee/user' },
  { icon: <FaRegAddressCard size={18} />, label: 'Premium User', path: '/employee/premium' },
  { icon: <RiCouponLine size={18} />, label: 'Order', path: '/employee/order' },
  { icon: <FaTicketAlt  size={18} />, label: 'Coupon', path: '/employee/coupon' },
  { icon: <FaCoins size={18} />, label: 'Payment Coin', path: '/employee/payment-coin' },
  { icon: <MdSubscriptions size={18} />, label: 'Payment Subscription', path: '/employee/payment-subscription' },
  { icon: <MdRequestPage size={18} />, label: 'Blog', path: '/employee/blog' },
  { icon: <FaRegAddressCard size={18} />, label: 'Contact', path: '/employee/contact' },
  {
    icon: <Settings size={18} />,
    label: 'Settings',
    submenu: [
      { label: 'Profile Edit', path: '/employee/settings/profile' },
    ],
  },
];

export default function Sidebar() {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <motion.aside
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-60 min-h-full bg-white border-r p-4"
    >
      <nav className="space-y-2">
        {sidebarItems.map((item, idx) => {
          const isActive = item.path && location.pathname.startsWith(item.path);
          const isOpen = openMenus[item.label] || false;

          if (item.submenu) {
            return (
              <div key={idx}>
                <div
                  onClick={() => toggleMenu(item.label)}
                  className={`flex items-center justify-between px-2 py-2 rounded cursor-pointer hover:bg-gray-100 ${
                    isOpen ? 'bg-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center gap-2 text-gray-800">
                    {item.icon}
                    <span className="text-sm">{item.label}</span>
                  </div>
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>

                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: isOpen ? 'auto' : 0 }}
                  transition={{ duration: 0.3 }}
                  className="ml-6 overflow-hidden"
                >
                  <ul className="space-y-1 mt-2">
                    {item.submenu.map((sub, subIdx) => (
                      <li key={subIdx}>
                        <Link
                          to={sub.path}
                          className={`block text-sm px-2 py-1 rounded hover:text-black hover:bg-gray-50 ${
                            location.pathname === sub.path
                              ? 'text-black font-medium bg-gray-100'
                              : 'text-gray-600'
                          }`}
                        >
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            );
          }

          return (
            <Link
              key={idx}
              to={item.path}
              className={`flex items-center gap-2 px-2 py-2 rounded text-sm transition hover:bg-gray-100 ${
                isActive ? 'text-black font-medium bg-gray-100' : 'text-gray-700'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </motion.aside>
  );
}
