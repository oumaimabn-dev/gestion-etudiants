const express = require("express");
const router = express.Router();

const {
  addEnseignant, getAllEnseignants, getEnseignantByCode, updateEnseignant, deleteEnseignant} = require("../controllers/enseignantController");

const { verifyToken, isSupervisor, isDirector } = require("../middlewares/authMiddleware");

router.post("/add", verifyToken, addEnseignant);

router.get("/", verifyToken, getAllEnseignants);

router.get('/code/:code', getEnseignantByCode);

router.put("/:id", verifyToken, updateEnseignant);

router.delete("/:id", verifyToken, deleteEnseignant);

module.exports = router;
