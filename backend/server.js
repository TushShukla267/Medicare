require('dotenv').config();
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());

// ✅ Allow both CRA (3000) and Vite (5173)
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow curl/postman
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('Not allowed by CORS'), false);
    }
    return callback(null, true);
  }
}));

// ✅ Database connection
const sequelize = new Sequelize(process.env.DATABASE_URL);

// ✅ User Model
const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('patient', 'doctor', 'admin', 'guardian'), allowNull: false },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
});

// ✅ Patient
const Patient = sequelize.define('Patient', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  first_name: DataTypes.STRING,
  last_name: DataTypes.STRING,
  phone: DataTypes.STRING,
  date_of_birth: DataTypes.DATE,
  gender: DataTypes.ENUM('male', 'female', 'other'),
  address: DataTypes.TEXT,
  emergency_contact: DataTypes.STRING,
  medical_history: DataTypes.TEXT
});

// ✅ Doctor
const Doctor = sequelize.define('Doctor', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  first_name: DataTypes.STRING,
  last_name: DataTypes.STRING,
  medical_license: { type: DataTypes.STRING, unique: true },
  specialization: DataTypes.STRING,
  phone: DataTypes.STRING,
  hospital_affiliation: DataTypes.STRING,
  years_experience: DataTypes.INTEGER,
  is_verified: { type: DataTypes.BOOLEAN, defaultValue: false }
});

// ✅ Admin
const Admin = sequelize.define('Admin', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  first_name: DataTypes.STRING,
  last_name: DataTypes.STRING,
  employee_id: { type: DataTypes.STRING, unique: true },
  department: DataTypes.STRING,
  phone: DataTypes.STRING,
  access_level: { type: DataTypes.ENUM('super_admin', 'admin', 'moderator'), defaultValue: 'admin' }
});

// ✅ Guardian
const Guardian = sequelize.define('Guardian', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  first_name: DataTypes.STRING,
  last_name: DataTypes.STRING,
  phone: DataTypes.STRING,
  relationship_type: DataTypes.STRING
});

// ✅ Relations
User.hasOne(Patient, { foreignKey: 'userId' });
User.hasOne(Doctor, { foreignKey: 'userId' });
User.hasOne(Admin, { foreignKey: 'userId' });
User.hasOne(Guardian, { foreignKey: 'userId' });

// ✅ Helpers
function validateEmail(email) {
  return /^[^@]+@[^@]+\.[^@]+$/.test(email);
}
function validatePassword(password) {
  return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password);
}
function generateToken(user) {
  return jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET || 'jwtsecret', { expiresIn: '24h' });
}

// ✅ Middleware
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  jwt.verify(token, process.env.JWT_SECRET || 'jwtsecret', (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.user = decoded;
    next();
  });
}

// ✅ Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, role, first_name, last_name } = req.body;

    if (!validateEmail(email)) return res.status(400).json({ error: 'Invalid email' });
    if (!validatePassword(password)) return res.status(400).json({ error: 'Weak password' });

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: 'User already exists' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password_hash: hash, role });

    if (role === 'patient') {
      await Patient.create({
        userId: user.id,
        first_name,
        last_name,
        phone: req.body.phone,
        date_of_birth: req.body.date_of_birth,
        gender: req.body.gender?.toLowerCase(),
        address: req.body.address,
        emergency_contact: req.body.emergency_contact || "",
        medical_history: req.body.medical_history || ""
      });
    } else if (role === 'doctor') {
      await Doctor.create({
        userId: user.id,
        first_name,
        last_name,
        medical_license: req.body.medical_license,
        specialization: req.body.specialization,
        phone: req.body.phone,
        hospital_affiliation: req.body.hospital_affiliation,
        years_experience: req.body.years_experience ? parseInt(req.body.years_experience, 10) : null
      });
    } else if (role === 'admin') {
      await Admin.create({
        userId: user.id,
        first_name,
        last_name,
        employee_id: req.body.employee_id,
        department: req.body.department,
        phone: req.body.phone,
        access_level: req.body.access_level?.toLowerCase() || "admin"
      });
    } else if (role === 'guardian') {
      await Guardian.create({
        userId: user.id,
        first_name,
        last_name,
        phone: req.body.phone,
        relationship_type: req.body.relationship_type || null
      });
    }

    res.status(201).json({ message: 'Registration successful', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = generateToken(user);
  // 👇 Add role in the response
  res.json({ message: 'Login successful', token, role: user.role });
});

app.get('/api/auth/verify', authMiddleware, async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user, role: user.role });
});

app.post('/api/auth/logout', authMiddleware, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.send('API is running!');
});

// ✅ Sync DB & start server
sequelize.sync({ alter: true }).then(() => {
  app.listen(5000, () => console.log('Server running on port 5000'));
});
