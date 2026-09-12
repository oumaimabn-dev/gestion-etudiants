const express = require('express');
const router = express.Router();
const {
  addEtablissement,
  getAllEtablissements,
  updateEtablissement,
  deleteEtablissement
} = require('../controllers/etablissementController');
const { verifyToken ,isSupervisor } = require('../middlewares/authMiddleware');

router.post('/add', verifyToken, isSupervisor, addEtablissement);

router.get('/', verifyToken, getAllEtablissements);

router.patch('/edit/:code', verifyToken, isSupervisor, updateEtablissement);

router.delete('/delete/:code', verifyToken, isSupervisor, deleteEtablissement);

module.exports = router;
