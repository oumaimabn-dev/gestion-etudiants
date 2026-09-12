import React from "react";
import { Outlet } from "react-router-dom";
import HeaderAdmin from "./HeaderAdmin";
import HeaderDirector from "./HeaderDirector";

const LayoutAdmin = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isDirector = user.role === "مدير";

  return (
    <div className="min-vh-100 d-flex flex-column">
      {isDirector ? <HeaderDirector /> : <HeaderAdmin />}

      <main className="flex-grow-1 p-4 bg-light">
        <Outlet />
      </main>
    </div>
  );
};

export default LayoutAdmin;
