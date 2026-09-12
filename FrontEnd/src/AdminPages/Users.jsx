import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";

const roles = ["مشرف", "مدير"];

const Users = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("يرجى تسجيل الدخول أولاً");
      return;
    }
    fetch("http://localhost:5000/api/users/all", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("فشل جلب المستخدمين");
        return res.json();
      })
      .then((data) => {
        setRecords(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  };

  const resetForm = () => {
    setFullname("");
    setEmail("");
    setPassword("");
    setRole("");
    setEditingId(null);
    setErrors({});
    setMessage("");
  };

  const handleSave = (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const newErrors = {};
    if (!fullname.trim()) newErrors.fullname = "الاسم الكامل مطلوب";
    if (!email.trim()) newErrors.email = "البريد الإلكتروني مطلوب";
    if (!editingId && !password.trim()) newErrors.password = "كلمة المرور مطلوبة";
    if (!role) newErrors.role = "اختر دوراً";

    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    const token = localStorage.getItem("token");
    const url = editingId
      ? `http://localhost:5000/api/users/${editingId}`
      : "http://localhost:5000/api/users/register";
    const method = editingId ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ fullname, email, password, role }),
    })
      .then((res) =>
        res.json().then((data) => ({ status: res.ok, data }))
      )
      .then(({ status, data }) => {
        setMessage(data.message || (status ? "تم الحفظ بنجاح" : "فشل الحفظ"));
        if (status) {
          fetchUsers();
          resetForm();
        }
      })
      .catch((err) => {
        console.error(err);
        setError("حدث خطأ أثناء الحفظ");
      });
  };

  const handleEdit = (user) => {
    setFullname(user.fullname);
    setEmail(user.email);
    setPassword(""); 
    setRole(user.role);
    setEditingId(user._id);
    setErrors({});
    setMessage("");
  };

  const handleDelete = (id) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;

    fetch(`http://localhost:5000/api/users/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message || "تم الحذف بنجاح");
        setRecords((prev) => prev.filter((user) => user._id !== id));
      })
      .catch((err) => {
        console.error(err);
        setError("حدث خطأ أثناء الحذف");
      });
  };
  
  
  return (
    <div className="container py-5" dir="rtl" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <h2>إدارة المستخدمين</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSave} className="p-3 bg-white rounded mb-4">
        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label">الاسم الكامل</label>
            <input
              type="text"
              className={`form-control ${errors.fullname ? "is-invalid" : ""}`}
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="ادخل الاسم الكامل"
            />
            {errors.fullname && <div className="invalid-feedback">{errors.fullname}</div>}
          </div>

          <div className="col-md-3">
            <label className="form-label">البريد الإلكتروني</label>
            <input
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ادخل البريد الإلكتروني"
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          <div className="col-md-3">
            <label className="form-label">كلمة المرور</label>
            <input
              type="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={editingId ? "اتركها فارغة إن لم تغيرها" : "ادخل كلمة المرور"}
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          <div className="col-md-3">
            <label className="form-label">الدور</label>
            <select
              className={`form-select ${errors.role ? "is-invalid" : ""}`}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">اختر الدور</option>
              {roles.map((r, i) => (
                <option key={i} value={r}>{r}</option>
              ))}
            </select>
            {errors.role && <div className="invalid-feedback">{errors.role}</div>}
          </div>
        </div>

        <div className="text-start mt-3">
          <button type="submit" className="btn bg-dark text-white">
            {editingId ? "تحديث" : "حفظ"}
          </button>
          {editingId && (
            <button type="button" className="btn btn-secondary ms-2" onClick={resetForm}>
              إلغاء
            </button>
          )}
        </div>
      </form>

      <hr />

      <h3 className="mt-4">قائمة المستخدمين</h3>
      <table className="table text-end">
        <thead className="table-light">
          <tr>
            <th>الاسم الكامل</th>
            <th>البريد الإلكتروني</th>
            <th>الدور</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">لا توجد بيانات</td>
            </tr>
          ) : (
            records.map((r) => (
              <tr key={r._id}>
                <td>{r.fullname}</td>
                <td>{r.email}</td>
                <td>{r.role}</td>
                <td>
                  <button
                    className="btn btn-sm border text-primary "
                    onClick={() => handleEdit(r)}
                  >
                    تعديل
                  </button>
                  <button
                    className="btn btn-sm border text-danger me-2"
                    onClick={() => handleDelete(r._id)}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
