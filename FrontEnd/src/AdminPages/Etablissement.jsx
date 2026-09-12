import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";

const Etablissement = () => {
  const [code, setCode] = useState("");
  const [etablissement, setEtablissement] = useState("");
  const [directorId, setDirectorId] = useState("");
  const [directors, setDirectors] = useState([]);
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [originalCode, setOriginalCode] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:5000/api/users/directors", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setDirectors(Array.isArray(data) ? data : []))
      .catch(() => setDirectors([]));
  }, [token]);

  const loadRecords = () => {
    if (!token) return;
    fetch("http://localhost:5000/api/etablissements", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setRecords(Array.isArray(data) ? data : []))
      .catch(() => setRecords([]));
  };
  useEffect(loadRecords, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = {};
    if (!code.trim()) errs.code = "رمز المؤسسة مطلوب";
    if (!etablissement.trim()) errs.etablissement = "اسم المؤسسة مطلوب";
    if (!directorId) errs.directorId = "يجب اختيار المدير";
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

   const url = editingId
  ? `http://localhost:5000/api/etablissements/edit/${originalCode}`
  : "http://localhost:5000/api/etablissements/add";
    const method = editingId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ code, etablissement, directorId }),
    });
    const data = await res.json();
    setMessage(data.message);

    if (res.ok) {
      setCode("");
      setEtablissement("");
      setDirectorId("");
      setEditingId(null);
      setErrors({});
      loadRecords();
    }
  };

  const handleEdit = (r) => {
    setOriginalCode(r.code);
    setEditingId(r._id);
    setCode(r.code);
    setEditingId(r._id);
    setCode(r.code);
    setEtablissement(r.etablissement);
    setDirectorId(r.directorId?._id || "");
    setErrors({});
    setMessage("");
  };

  const handleDelete = async (r) => {
    if (!window.confirm("هل تريد حذف هذه المؤسسة؟")) return;
    const res = await fetch(
      `http://localhost:5000/api/etablissements/delete/${r.code}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    setMessage(data.message);
    if (res.ok) loadRecords();
  };

  return (
    <div
      className="container py-5"
      dir="rtl"
      style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
    >
      <h2 className="mb-4">
        {editingId ? "تعديل المؤسسة" : "إضافة مؤسسة جديدة"}
      </h2>
      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSubmit} className="p-4 bg-white rounded mb-4 border ">
        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label">رمز المؤسسة</label>
            <input
              type="text"
              className={`form-control ${errors.code ? "is-invalid" : ""}`}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="رمز"
            />
            {errors.code && (
              <div className="invalid-feedback">{errors.code}</div>
            )}
          </div>

          <div className="col-md-4">
            <label className="form-label">اسم المؤسسة</label>
            <input
              type="text"
              className={`form-control ${
                errors.etablissement ? "is-invalid" : ""
              }`}
              value={etablissement}
              onChange={(e) => setEtablissement(e.target.value)}
              placeholder="الاسم"
            />
            {errors.etablissement && (
              <div className="invalid-feedback">{errors.etablissement}</div>
            )}
          </div>

          <div className="col-md-3">
            <label className="form-label">المدير</label>
            <select
              className={`form-select ${errors.directorId ? "is-invalid" : ""}`}
              value={directorId}
              onChange={(e) => setDirectorId(e.target.value)}
            >
              <option value="">اختر المدير</option>
              {directors.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.fullname}
                </option>
              ))}
            </select>
            {errors.directorId && (
              <div className="invalid-feedback">{errors.directorId}</div>
            )}
          </div>

          <div className="col-12 text-start">
            <button type="submit" className="btn btn-dark">
              {editingId ? "تحديث" : "حفظ"}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => {
                  setEditingId(null);
                  setCode("");
                  setEtablissement("");
                  setDirectorId("");
                  setErrors({});
                  setMessage("");
                }}
              >
                إلغاء
              </button>
            )}
          </div>
        </div>
      </form>

      <h3 className="mb-3">قائمة المؤسسات</h3>
      <table className="table text-end border">
        <thead className="table-light">
          <tr>
            <th>رمز</th>
            <th>الاسم</th>
            <th>المدير</th>
            <th>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                لا توجد بيانات
              </td>
            </tr>
          ) : (
            records.map((r) => (
              <tr key={r._id}>
                <td>{r.code}</td>
                <td>{r.etablissement}</td>
                <td>{r.directorId?.fullname || "-"}</td>
                <td>
                  <button
                    className="btn btn-sm border text-primary "
                    onClick={() => handleEdit(r)}
                  >
                    تعديل
                  </button>
                  <button
                    className="btn btn-sm border text-danger me-2"
                    onClick={() => handleDelete(r)}
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

export default Etablissement;
