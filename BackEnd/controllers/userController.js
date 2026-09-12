const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { email, fullname, password, role } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'البريد الإلكتروني مستعمل مسبقاً' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      fullname,
      password: hashed,
      role
    });
    await user.save();
    res.status(201).json({ message: 'تم إنشاء المستخدم بنجاح', userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'المستخدم غير موجود' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'كلمة المرور غير صحيحة' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({
      token,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

exports.getSupervisors = async (req, res) => {
  try {
    const supervisors = await User.find({ role: "مشرف" }).select("username _id");
    res.json(supervisors);
  } catch (err) {
    res.status(500).json({ message: "فشل في جلب المشرفين" });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, fullname, password, role } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' });

    if (email) user.email = email;
    if (fullname) user.fullname = fullname;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    if (role) user.role = role;

    await user.save();
    res.json({ message: 'تم تحديث المستخدم بنجاح' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' });
    res.json({ message: 'تم حذف المستخدم بنجاح' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};
