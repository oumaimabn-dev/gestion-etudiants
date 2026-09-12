const express = require("express");
const router = express.Router();
const {
  getAllSurveillancesForModir,
  addSurveillance,
  deleteSurveillance,
  updateSurveillance,
} = require("../controllers/surveillanceController");
const { verifyToken, isDirector } = require('../middlewares/authMiddleware');
router.use(verifyToken);


router.get("/", verifyToken ,isDirector, getAllSurveillancesForModir);
router.post("/",verifyToken, isDirector, addSurveillance);
router.put("/:id",verifyToken, isDirector, updateSurveillance);
router.delete("/:id",verifyToken, isDirector, deleteSurveillance);

module.exports = router;
