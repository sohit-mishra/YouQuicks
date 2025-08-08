import React from "react";
import Navbar from "@/pages/User/Component/Navbar";
import { Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
