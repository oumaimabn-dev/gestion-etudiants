const express = require('express');
const router = express.Router();
const authController = require('../controllers/userController');
const { verifyToken, isSupervisor, isDirector } = require('../middlewares/authMiddleware');
const User = require('../models/User'); 

router.post('/register', authController.register);

router.post('/login', authController.login);

router.get('/all', verifyToken, authController.getAllUsers);

router.get('/supervisors', verifyToken, authController.getSupervisors);

router.put('/:id', verifyToken, authController.updateUser);

router.delete('/delete/:id', verifyToken, authController.deleteUser);

router.get('/supervisor-only', verifyToken, isSupervisor, (req, res) => {
  res.json({ message: 'Welcome Supervisor!' });
});

router.get('/directors', verifyToken, async (req, res) => {
  try {
    const directors = await User.find({ role: "مدير" }).select("fullname _id");
    res.json(directors);
  } catch (err) {
    res.status(500).json({ message: "خطأ في جلب المدراء" });
  }
});

router.get('/dashboard', verifyToken, (req, res) => {
  res.json({ message: `Welcome ${req.user.role}!` });
});

module.exports = router;
