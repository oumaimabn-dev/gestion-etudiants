const jwt = require("jsonwebtoken");
const Etablissement = require('../models/etablissement');
const User = require('../models/User');

const checkAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; 
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, "your_secret_key", (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }
    req.user = decoded; 
    next();
  });
};
const addEtablissement = async (req, res) => {
  const { code, etablissement, directorId } = req.body;
console.log(req.body)
  if (!code || !etablissement || !directorId) {
    return res.status(400).json({ message: "يرجى ملء جميع الحقول" });
  }

  const director = await User.findById(directorId);
  if (!director || director.role !== 'مدير') {
    return res.status(400).json({ message: "المستخدم المحدد ليس مديراً" });
 }

  const supervisor = await User.findById(req.user.id);
  if (!supervisor || supervisor.role !== 'مشرف') {
    return res.status(403).json({ message: "غير مسموح لك بإضافة مؤسسة" });
  }

  const exists = await Etablissement.findOne({ code });
  if (exists) {
    return res.status(400).json({ message: "الرمز موجود مسبقاً" });
  }

  const newEtab = new Etablissement({
    code,
    etablissement,
    supervisor: req.user.id,
    directorId: directorId,
  });

  await newEtab.save();
  res.status(201).json({
    message: "تمت إضافة المؤسسة بنجاح",
    etablissement: newEtab
  });
};


const getAllEtablissements = async (req, res) => {
  try {
    const list = await Etablissement
      .find()
      .populate("directorId", "fullname"); 
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "خطأ في جلب المؤسسات" });
  }
};

const updateEtablissement = async (req, res) => {
  const code = req.params.code;
  const updated = await Etablissement.findOneAndUpdate(
    { code },
    req.body,
    { new: true }
  );

  if (!updated) return res.status(404).json({ message: "المؤسسة غير موجودة" });
  res.json({ message: "تم التحديث بنجاح", updated });
};

const deleteEtablissement = async (req, res) => {
  const { code } = req.params;

  try {
    const deleted = await Etablissement.findOneAndDelete({ code });
    if (!deleted) {
      return res.status(404).json({ message: "المؤسسة غير موجودة" });
    }

    res.json({ message: "تم حذف المؤسسة بنجاح" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "حدث خطأ أثناء حذف المؤسسة" });
  }
};


module.exports = {
  addEtablissement,
  getAllEtablissements,
  updateEtablissement,
  deleteEtablissement,
  checkAuth,
  
};
