import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "فشل تسجيل الدخول");
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        onLoginSuccess(data.user.role);

        if (data.user.role === "مشرف") {
          navigate("/admin/surveillant");
        } else if (data.user.role === "مدير") {
          navigate("/admin/director");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      setError("خطأ في الاتصال بالسيرفر");
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex p-5">
      <div className="row flex-fill rounded-4 shadow-lg overflow-hidden">
        {/* LEFT SIDE */}
        <div
          className="col-md-6 d-flex align-items-center justify-content-center text-white section-style"
          style={{
            backgroundColor: "#0dbb95ff",
          }}
        >
          <div className="text-center">
            <h1 className="fw-bold" style={{ fontSize: "8vh"  }}>
              مرحباً بك في
            </h1>
            <h2 className="fw-bold" style={{ fontSize: "8vh" }}>
              منصة الامتحانات
            </h2>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-md-6 d-flex justify-content-center align-items-center bg-white section-style">
          <form
            onSubmit={handleLogin}
            className="w-100 text-center"
            style={{ maxWidth: "400px" }}
          >
            <img src="./logo2.jpg" alt="logo" style={{ height: 120 }} />
            <h1 className="mt-4 mb-4" style={{ fontSize: "6vh", color: "#0CCDA3" }}>
              الامتحانات
            </h1>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="mt-3">
              <input
                type="text"
                className="form-control mb-3 rounded-3"
                placeholder="اسم المستخدم"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                className="form-control mb-3 rounded-3"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="submit"
                className="btn w-50 rounded-3 shadowéé"
                style={{ backgroundColor: "#0CCDA3", color: "white" }}
              >
                تسجيل الدخول
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
