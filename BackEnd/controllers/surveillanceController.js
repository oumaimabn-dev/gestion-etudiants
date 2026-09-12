const Surveillance = require("../models/surveillance");
const Enseignant = require("../models/enseignant");

const addSurveillance = async (req, res) => {
  try {
    
    const { enseignant, date, heures, minutes, periode } = req.body;
    if (!enseignant || !date || !heures || !minutes || !periode) {
      return res.status(400).json({ message: "جميع الحقول مطلوبة" });
    }

    const teacher = await Enseignant.findById(enseignant);
    if (!teacher) {
      return res.status(404).json({ message: "الأستاذ غير موجود" });
    }

    const newSurv = new Surveillance({
      enseignant,
      date,
      heures,
      minutes,
      periode,
      director: req.user._id       
    });
     console.log(newSurv)
    await newSurv.save();
    res.status(201).json({ message: "تمت إضافة المراقبة بنجاح", newSurv });
  } catch (error) {
    console.error(" Erreur interne:", error.message);
    res.status(500).json({ message: "حدث خطأ أثناء إضافة المراقبة" });
  }
};


const getAllSurveillances = async (req, res) => {
  try {
    const records = await Surveillance.find()
      .sort({ date: -1 })
      .populate({
        path: "enseignant", 
        select: "fullname etablissement", 
        populate: {
          path: "etablissement", 
          select: "etablissement", 
        },
      });
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطأ في جلب البيانات" });
  }
};

const getAllSurveillancesForModir = async (req, res) => {
  try {
    const surveillances = await Surveillance.find({ director: req.user._id })
      .populate("enseignant", "fullname"); 
    res.json(surveillances);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "خطأ في جلب سجلات الحراسة" });
  }
};

const deleteSurveillance = async (req, res) => {
  try {
    await Surveillance.findByIdAndDelete(req.params.id);
    res.json({ message: "تم الحذف بنجاح" });
  } catch (err) {
    res.status(500).json({ message: "خطأ في الحذف" });
  }
};

const updateSurveillance = async (req, res) => {
  try {
    const { id } = req.params;
    const { enseignant, date, heures, minutes, periode } = req.body;

    if (!enseignant || !date || !heures || !minutes || !periode) {
      return res.status(400).json({ message: "جميع الحقول مطلوبة" });
    }

    const updated = await Surveillance.findByIdAndUpdate(
      id,
      { enseignant, date, heures, minutes, periode },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "السجل غير موجود" });

    res.json({ message: "تم التحديث بنجاح", updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطأ أثناء التحديث" });
  }
};

module.exports = {
  addSurveillance,
  deleteSurveillance,
  getAllSurveillances,
  updateSurveillance,
  getAllSurveillancesForModir,
};
