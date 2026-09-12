const express = require('express');
const router = express.Router();
const {addSurveillance,getAllSurveillances,deleteSurveillance,updateSurveillance, getAllSurveillancesForDirector} = require('../controllers/surveillanceController');
const { verifyToken, isDirector } = require('../middlewares/authMiddleware');

router.use(verifyToken); 

router.post('/', addSurveillance);

router.get('/', getAllSurveillances);

router.delete('/:id', deleteSurveillance);

router.put("/:id", updateSurveillance)

module.exports = router;
