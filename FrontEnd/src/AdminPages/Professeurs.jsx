import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";

const Professeurs = () => {
  const [code, setCode] = useState("");
  const [fullName, setFullName] = useState(""); 
  const [etablissement, setEtablissement] = useState(""); 
  const [directeur, setDirecteur] = useState("");  
  const [directorId, setDirectorId] = useState(""); 
  const [records, setRecords] = useState([]);
  const [etablissements, setEtablissements] = useState([]); 
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    console.log("Token:", token);

    fetch("http://localhost:5000/api/enseignants", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("DATA:", data);
        setRecords(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error fetching professors:", err);
        setRecords([]);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:5000/api/etablissements", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setEtablissements(data);
        else if (Array.isArray(data.etablissements))
          setEtablissements(data.etablissements);
        else setEtablissements([]);
      })
      .catch((err) => {
        console.error("Error fetching establishments:", err);
        setEtablissements([]);
      });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!code) newErrors.code = "رقم التأجير مطلوب";
    if (!fullName) newErrors.fullName = "الاسم الكامل مطلوب";
    if (!etablissement) newErrors.etablissement = "يجب اختيار المؤسسة";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/enseignants/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          id: code,
          fullname: fullName,
          etablissement,
          directorId, 
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("تمت إضافة الأستاذ بنجاح");
const updated = await fetch("http://localhost:5000/api/enseignants", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });        const list = await updated.json();
        setRecords(Array.isArray(list) ? list : []);
        setCode("");
        setFullName("");
        setEtablissement("");
        setDirecteur("");
        setDirectorId("");
      } else {
        setMessage(data.message || "فشل في الإضافة");
      }
    } catch (err) {
      console.error("Error adding professor:", err);
      setMessage("خطأ في الاتصال بالسيرفر");
    }
  };

  const handleEtablissementChange = (e) => {
    const selectedId = e.target.value;
    setEtablissement(selectedId);

    const etab = etablissements.find((item) => item._id === selectedId);
    if (etab && etab.directorId) {
      setDirecteur(etab.directorId.fullname);
      setDirectorId(etab.directorId._id);
    } else {
      setDirecteur("");
      setDirectorId("");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/enseignants/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setRecords((prev) => prev.filter((r) => r._id !== id));
      } else {
        console.error("Failed to delete professor");
      }
    } catch (err) {
      console.error("Error deleting professor:", err);
    }
  };
  const handleEdit = (record) => {
    setEditingId(record._id);
    setCode(record.id);
    setFullName(`${record.fullname}`);
    setEtablissement(record.etablissement._id || record.etablissement); 
    setDirecteur(record.directeur);
    setDirectorId(record.directorId || "");
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:5000/api/enseignants/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: code,
            fullname: fullName,
            etablissement,
            directorId,
          }),
        }
      );
      console.log("editingId:", editingId);

      const data = await res.json();
      if (res.ok) {
        setMessage("تم تحديث بيانات الأستاذ بنجاح");

        
        const updated = await fetch("http://localhost:5000/api/enseignants", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
const list = await updated.json();
setRecords(Array.isArray(list) ? list : []);
        setCode("");
        setFullName("");
        setEtablissement("");
        setDirecteur("");
        setDirectorId("");
        setEditingId(null);
      } else {
        setMessage(data.message || "فشل في التحديث");
      }
    } catch (err) {
      console.error("Error updating professor:", err);
      setMessage("خطأ في الاتصال بالسيرفر");
    }
  };

  return (
    <div
      className="container py-5"
      dir="rtl"
      style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
    >
      <h2>إضافة أستاذ جديد</h2>
      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={editingId ? handleUpdate : handleSave}>
        <div className="p-3 rounded bg-white mt-3 border">
          <div className="row mb-3">
            <div className="col-md-2">
              <label className="form-label">رقم التأجير</label>
              <input
                type="text"
                className={`form-control ${errors.code ? "is-invalid" : ""}`}
                placeholder="رقم التأجير"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              {errors.code && (
                <div className="invalid-feedback">{errors.code}</div>
              )}
            </div>

            <div className="col-md-3">
              <label className="form-label">الاسم الكامل</label>
              <input
                type="text"
                className={`form-control ${
                  errors.fullName ? "is-invalid" : ""
                }`}
                placeholder="الاسم الكامل"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              {errors.fullName && (
                <div className="invalid-feedback">{errors.fullName}</div>
              )}
            </div>

            <div className="col-md-3">
              <label className="form-label">المؤسسة</label>
              <select
                className={`form-select ${
                  errors.etablissement ? "is-invalid" : ""
                }`}
                value={etablissement}
                onChange={handleEtablissementChange}
              >
                <option value="">اختر المؤسسة</option>
                {etablissements.map((etab) => (
                  <option key={etab._id} value={etab._id}>
                    {etab.etablissement}
                  </option>
                ))}
              </select>
              {errors.etablissement && (
                <div className="invalid-feedback">{errors.etablissement}</div>
              )}
            </div>

            <div className="col-md-3">
              <label className="form-label">المدير</label>
              <input
                type="text"
                className="form-control"
                placeholder="المدير"
                value={directeur}
                readOnly
              />
            </div>
          </div>

          <div className="text-start">
            <button type="submit" className="btn bg-dark text-white">
              {editingId ? "تحديث" : "حفظ"}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => {
                  setEditingId(null);
                  setCode("");
                  setFullName("");
                  setEtablissement("");
                  setDirectorId("");
                }}
              >
                إلغاء
              </button>
            )}
          </div>
        </div>
      </form>

      <hr />

      <h3 className="mt-4">قائمة الأساتذة</h3>
      <table className="table text-end border ">
        <thead className="table-light">
          <tr>
            <th>رقم التأجير</th>
            <th>الاسم الكامل</th>
            <th>المؤسسة</th>
            <th>مدير المؤسسة</th>
            <th>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                لا توجد بيانات
              </td>
            </tr>
          ) : (
            records.map((r) => (
              <tr key={r._id}>
                <td>{r.id}</td>
                <td>{r.fullname}</td>
                <td>{r.etablissement?.etablissement || "غير معروف"}</td>
                <td>{r.etablissement?.directorId?.fullname || "غير معروف"}</td>

                <td>
                  <button
                    onClick={() => handleEdit(r)}
                    className="btn btn-sm border text-primary  "
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="btn btn-sm border text-danger me-2"
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

export default Professeurs;
