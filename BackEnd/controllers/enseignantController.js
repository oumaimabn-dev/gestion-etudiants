const Enseignant = require("../models/enseignant");

exports.addEnseignant = async (req, res) => {
  try {
    const { id, fullname, etablissement, directorId } = req.body;

    if (!id || !fullname|| !etablissement || !directorId) {
      return res.status(400).json({ message: "جميع الحقول مطلوبة" });
    }
    const exists = await Enseignant.findOne({ id });
    if (exists) {
      return res.status(400).json({ message: "المعرف موجود مسبقًا" });
    }
    const newEnseignant = new Enseignant({ id, fullname, etablissement, directorId });
    await newEnseignant.save();
    res.status(201).json({ message: "تمت إضافة الأستاذ بنجاح", enseignant: newEnseignant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطأ في الخادم" });
  }
};


exports.getEnseignantByCode = async (req, res) => {
  try {
    const code = req.params.code;
    const enseignant = await Enseignant
      .findOne({ id: code })
      .populate("etablissement", "etablissement"); 

    if (!enseignant) {
      return res.status(404).json({ message: "أستاذ غير موجود" });
    }

    res.json({
      _id: enseignant._id,
      fullname: enseignant.fullname,
      etablissementName: enseignant.etablissement.etablissement, 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطأ في الخادم" });
  }
};




exports.getAllEnseignants = async (req, res) => {
  try {
    enseignants = await Enseignant.find()
  .populate({
    path: "etablissement",
    populate: { path: "directorId", select: "fullname" },
    select: "etablissement directorId"
  });
    res.json(enseignants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطأ في جلب الأساتذة" });
  }
};

exports.updateEnseignant = async (req, res) => {
 try {
    const { id, fullname, etablissement, directorId } = req.body;

    const updated = await Enseignant.findByIdAndUpdate(
      req.params.id,
      {
        id,
        fullname,
        etablissement,
        directorId,
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "الأستاذ غير موجود" });

    res.status(200).json(updated);
  } catch (err) {
    console.error("PUT Error:", err);
    res.status(500).json({ message: "خطأ في السيرفر" });
  }
};

exports.deleteEnseignant = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Enseignant.findByIdAndDelete( id );
    if (!deleted) {
      return res.status(404).json({ message: "أستاذ غير موجود" });
    }
    res.json({ message: "تم الحذف بنجاح" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطأ في الحذف" });
  }
};
