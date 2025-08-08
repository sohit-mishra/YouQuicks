import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '@/assets/logo.svg';
import { IoHome } from "react-icons/io5";
import { FaYoutube } from "react-icons/fa";
import avatar from '@/assets/user/account.svg';
import { FaCoins } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";
import api from '@/api/api';
import { showSuccessToast, showErrorToast } from '@/lib/toastUtils';
import { AuthContext } from '@/context/AuthContext';


export default function Navbar() {
  const { setIsLoggedIn, setRole, setToken, setPremium }= useContext(AuthContext);
  const [accountOpen, setAccountOpen] = useState(false);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); 

  const toggleAccount = () => {
    setAccountOpen(prev => !prev);
  };

  const handleClearCookies = async () => {
    try {
      const res = await api.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`);
      showSuccessToast(res.data.message)
      setIsLoggedIn(false);
      setRole("");
      setToken("");
      setPremium("");
      localStorage.removeItem('payload');
      localStorage.removeItem('channelId');
      setTimeout(()=>{
        navigate('/user/login');
      },200)
    } catch (err) {
      showErrorToast(err.response.data.message);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`${import.meta.env.VITE_API_URL}/api/user/detail`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching premium plans:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <header className="flex mb-5 justify-between items-center px-4 py-5 shadow-lg sticky top-0 bg-white z-50">
      <div className="w-[180px] h-[40px]">
        <Link to="/user/dashboard"><img src={Logo} alt="logo" /></Link>
      </div>

      <div className="hidden md:flex space-x-6">
        <ul className="flex space-x-6">
          <Link to="/user/dashboard">
            <li className="flex items-center space-x-2">
              <IoHome />
              <span>Dashboard</span>
            </li>
          </Link>
          <Link to="/user/earn">
            <li className="flex items-center space-x-2">
              <FaYoutube />
              <span>Earn Coin</span>
            </li>
          </Link>
        </ul>
      </div>

      {/* Mobile menu hamburger icon */}
      <div className="md:hidden flex items-center">
        <button onClick={toggleMenu} className="text-xl">
          <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>
      </div>

      {/* Account info */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <FaCoins className="text-yellow-500" />
          <div className="text-sm">{data.coin}</div>
        </div>
        <div className="flex items-center space-x-2 cursor-pointer" onClick={toggleAccount}>
          <FaUserAlt />
          <p className="text-sm">Hi, {data.name}</p>
          <img src={data?.avatar || avatar} alt="userlogo" className="w-8 h-8 rounded-full" onError={(e) => { e.target.src = avatar }}/>
        </div>
      </div>

      {/* Account dropdown */}
      {accountOpen && (
        <div className="absolute right-0 top-[60px] bg-white shadow-lg p-4 w-48 rounded-lg z-10">
          <ul>
            <span onClick={toggleAccount} id="close" style={{ cursor: 'pointer' }} className="text-xl text-gray-600">
              <i className="fa-solid fa-xmark"></i>
            </span>
            <Link to="/user/dashboard" className="block text-sm text-gray-800 hover:bg-gray-100 p-2 rounded"><li><i className="fa-solid fa-house"></i><span> Dashboard</span></li></Link>
            <Link to="/user/earn" className="block text-sm text-gray-800 hover:bg-gray-100 p-2 rounded"><li><i className="fa-brands fa-youtube"></i><span> Earn Coin</span></li></Link>
            <Link to="/user/premium" className="block text-sm text-gray-800 hover:bg-gray-100 p-2 rounded"><li><i className="fa-solid fa-credit-card"></i><span> Premium</span></li></Link>
            <Link to="/user/buycoins" className="block text-sm text-gray-800 hover:bg-gray-100 p-2 rounded"><li><i className="fa-solid fa-coins"></i><span> Buy Coins</span></li></Link>
            <Link to="/user/paymenthisotry" className="block text-sm text-gray-800 hover:bg-gray-100 p-2 rounded"><li><i className="fa-solid fa-coins"></i><span> Payment History</span></li></Link>
            <Link to="/user/profile" className="block text-sm text-gray-800 hover:bg-gray-100 p-2 rounded"><li><i className="fa-solid fa-coins"></i><span> Profile Setting</span></li></Link>
            <Link to="/contactus" className="block text-sm text-gray-800 hover:bg-gray-100 p-2 rounded"><li><i className="fa-solid fa-envelope-open"></i><span> Report a Bug</span></li></Link>
            <button onClick={handleClearCookies} className="flex items-center text-sm text-gray-800 hover:bg-gray-100 py-2 rounded w-full">
              <i className="fa-solid fa-right-from-bracket mr-2"></i>
              <span>Log out</span>
            </button>
          </ul>
        </div>
      )}

      {/* Mobile menu items */}
      {isMenuOpen && (
        <div className="md:hidden fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-20">
          <div className="bg-white w-3/4 h-full p-6 space-y-4">
            <Link to="/user/dashboard" onClick={toggleMenu} className="text-sm text-gray-800 hover:bg-gray-100 p-2 rounded">Dashboard</Link>
            <Link to="/user/earn" onClick={toggleMenu} className="text-sm text-gray-800 hover:bg-gray-100 p-2 rounded">Earn Coin</Link>
            <Link to="/user/premium" onClick={toggleMenu} className="text-sm text-gray-800 hover:bg-gray-100 p-2 rounded">Premium</Link>
            <Link to="/user/buycoins" onClick={toggleMenu} className="text-sm text-gray-800 hover:bg-gray-100 p-2 rounded">Buy Coins</Link>
            <Link to="/user/paymenthisotry" onClick={toggleMenu} className="text-sm text-gray-800 hover:bg-gray-100 p-2 rounded">Payment History</Link>
            <Link to="/user/profile" onClick={toggleMenu} className="text-sm text-gray-800 hover:bg-gray-100 p-2 rounded">Profile Setting</Link>
            <Link to="/contactus" onClick={toggleMenu} className="text-sm text-gray-800 hover:bg-gray-100 p-2 rounded">Report a Bug</Link>
            <Button onClick={handleClearCookies} className="text-sm text-gray-800 hover:bg-gray-100 py-2 rounded">Log out</Button>
          </div>
        </div>
      )}
    </header>
  );
}
