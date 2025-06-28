// components/layouts/CustomerLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/shared/Navbar";

const CustomerLayout = () => {
  return (
    <>
      <Navbar />
      <main className="p-4">
        <Outlet />
      </main>
    </>
  );
};

export default CustomerLayout;
