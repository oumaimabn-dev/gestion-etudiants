import React from "react";
import { useNavigate } from "react-router-dom";

const HeaderDirector = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (user.role !== "مدير") return null;

 const handleLogout = () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("role");

  window.location.replace("/")
};

  return (
    <header
      className="bg-white shadow-sm p-3"
      style={{ display: "flex", justifyContent: "flex-end" }}
    >
      <button
        onClick={handleLogout}
        className="btn btn-outline-danger"
      >
        تسجيل الخروج
      </button>
    </header>
  );
};

export default HeaderDirector;
