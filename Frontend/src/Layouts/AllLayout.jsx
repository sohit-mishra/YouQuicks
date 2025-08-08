import React from "react";
import Navbar from "@/pages/HomeComponent/Navbar";
import Footer from "@/pages/HomeComponent/Footer";
import { Outlet } from "react-router-dom";

import "@/index.css";

export default function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}
