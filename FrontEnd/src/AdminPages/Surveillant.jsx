import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Surveillant = () => {
  const [code, setCode] = useState("");
  const [enseignantId, setEnseignantId] = useState(null);
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [etablissement, setEtablissement] = useState("");
  const [date, setDate] = useState("");
  const [heures, setHeures] = useState("");
  const [minutes, setMinutes] = useState("");
  const [periode, setPeriode] = useState("الصباح");
  const [records, setRecords] = useState([]);
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("token");

  const handleChangeCode = async (e) => {
    const entered = e.target.value.trim();
    setCode(entered);
    setErrors((prev) => ({ ...prev, code: undefined }));
    if (!entered) {
      setPrenom("");
      setNom("");
      setEtablissement("");
      setEnseignantId(null);
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:5000/api/enseignants/code/${entered}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) {
        setPrenom("");
        setNom("");
        setEtablissement("");
        setEnseignantId(null);
        return;
      }
      const data = await res.json();
      const [first, ...rest] = data.fullname.trim().split(" ");
      setPrenom(first || "");
      setNom(rest.join(" ") || "");
      setEtablissement(data.etablissementName || "");
      setEnseignantId(data._id);
    } catch (err) {
      console.error(err);
      setPrenom("");
      setNom("");
      setEtablissement("");
      setEnseignantId(null);
    }
  };

  const fetchRecords = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/surveillances", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setRecords(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);
  const handleSave = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!code) newErrors.code = "رقم التأجير مطلوب";
    if (!enseignantId) newErrors.code = "رقم تأجير غير صالح";
    if (!date) newErrors.date = "تاريخ الحراسة مطلوب";
    if (!heures) newErrors.heures = "الساعة مطلوبة";
    if (!minutes) newErrors.minutes = "الدقيقة مطلوبة";
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    const payload = {
      enseignant: enseignantId,
      date,
      heures,
      minutes,
      periode,
    };
    try {
      let res;
      if (editingId) {
        res = await fetch(
          `http://localhost:5000/api/surveillances/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );
      } else {
        res = await fetch("http://localhost:5000/api/surveillances", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        await fetchRecords();
        setCode("");
        setPrenom("");
        setNom("");
        setEtablissement("");
        setDate("");
        setHeures("");
        setMinutes("");
        setPeriode("الصباح");
        setEditingId(null);
        setErrors({});
      }
    } catch (error) {
      console.error(" Surveillance Error:", error.message, error.stack);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من الحذف؟")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/surveillances/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchRecords();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (r) => {
    setEditingId(r._id);
    setCode(r.enseignant?.code || "");
    setDate(r.date);
    setHeures(r.heures);
    setMinutes(r.minutes);
    setPeriode(r.periode);
    setPrenom(r.enseignant?.prenom || "");
    setNom(r.enseignant?.nom || "");
    setEtablissement(r.enseignant?.etablissement?.etablissement || "");
    setEnseignantId(r.enseignant?._id || null);
  };

  return (
    <div
      className="container py-5"
      dir="rtl"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <form onSubmit={handleSave} className="p-3 bg-white rounded mb-4  border">
        <h3>{editingId ? "تعديل الحراسة" : "تسجيل حراسة جديدة"}</h3>
        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label">رقم التأجير</label>
            <input
              className={`form-control ${errors.code ? "is-invalid" : ""}`}
              value={code}
              onChange={handleChangeCode}
            />
            {errors.code && (
              <div className="invalid-feedback">{errors.code}</div>
            )}
          </div>

          <div className="col-md-3">
            <label className="form-label">الاسم</label>
            <input className="form-control" value={prenom} readOnly />
          </div>
          <div className="col-md-3">
            <label className="form-label">النسب</label>
            <input className="form-control" value={nom} readOnly />
          </div>

          <div className="col-md-3">
            <label className="form-label">المؤسسة</label>
            <input className="form-control" value={etablissement} readOnly />
          </div>

          <div className="col-md-3">
            <label className="form-label">تاريخ الحراسة</label>
            <input
              type="date"
              className={`form-control ${errors.date ? "is-invalid" : ""}`}
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setErrors((prev) => ({ ...prev, date: undefined }));
              }}
            />
            {errors.date && (
              <div className="invalid-feedback">{errors.date}</div>
            )}
          </div>

          <div className="col-md-4 d-flex">
            <div className="me-2 flex-grow-1">
              <label className="form-label">الساعة</label>
              <select
                className={`form-select ${errors.heures ? "is-invalid" : ""}`}
                value={heures}
                onChange={(e) => {
                  setHeures(e.target.value);
                  setErrors((prev) => ({ ...prev, heures: undefined }));
                }}
              >
                <option value="">ساعة</option>
                {Array.from({ length: 100 }, (_, i) => (
                  <option key={i} value={i.toString().padStart(2, "0")}>
                    {i.toString().padStart(2, "0")}
                  </option>
                ))}
              </select>
              {errors.heures && (
                <div className="invalid-feedback">{errors.heures}</div>
              )}
            </div>

            <div className="flex-grow-1">
              <label className="form-label">الدقيقة</label>
              <select
                className={`form-select ${errors.minutes ? "is-invalid" : ""}`}
                value={minutes}
                onChange={(e) => {
                  setMinutes(e.target.value);
                  setErrors((prev) => ({ ...prev, minutes: undefined }));
                }}
              >
                <option value="">دقيقة</option>
                {Array.from({ length: 60 }, (_, i) => (
                  <option key={i} value={i.toString().padStart(2, "0")}>
                    {i.toString().padStart(2, "0")}
                  </option>
                ))}
              </select>
              {errors.minutes && (
                <div className="invalid-feedback">{errors.minutes}</div>
              )}
            </div>
          </div>

          <div className="col-md-3">
            <label className="form-label">الفترة</label>
            <select
              className="form-select"
              value={periode}
              onChange={(e) => setPeriode(e.target.value)}
            >
              <option value="الصباح">الصباح</option>
              <option value="المساء">المساء</option>
            </select>
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
                  setDate("");
                  setHeures("");
                  setMinutes("");
                  setPeriode("");
                  setPrenom("");
                  setNom("");
                  setErrors({});
                }}
              >
                إلغاء
              </button>
            )}
          </div>
        </div>
      </form>

      <table className="table text-end">
        <thead className="table-light">
          <tr>
            <th>الأستاذ</th>
            <th>المؤسسة</th>
            <th>يوم الحراسة</th>
            <th>عدد الساعات</th>
            <th>الفترة</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r, idx) => (
            <tr key={idx}>
              <td>{r.enseignant?.fullname}</td>
              <td>{r.enseignant?.etablissement?.etablissement}</td>
              <td>{r.date}</td>
              <td>{`${r.heures}h:${r.minutes}min`}</td>
              <td>{r.periode}</td>
              <td>
                <button
                  className="btn btn-sm border text-primary me-2"
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Surveillant;
