require('dotenv').config();
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const http = require('http');
const { Server: IOServer } = require('socket.io');

const app = express();
app.use(express.json());

// =====================================
// ✅ CORS Configuration
// =====================================
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('Not allowed by CORS'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// =====================================
// ✅ Database Setup
// =====================================
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: process.env.DATABASE_SSL === "true" ? { require: true, rejectUnauthorized: false } : false
  }
});

// =====================================
// ✅ Model Definitions
// =====================================
const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('patient', 'doctor', 'admin', 'guardian'), allowNull: false },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
});

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

const Guardian = sequelize.define('Guardian', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  first_name: DataTypes.STRING,
  last_name: DataTypes.STRING,
  phone: DataTypes.STRING,
  relationship_type: DataTypes.STRING
});

const Appointment = sequelize.define('Appointment', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  doctorId: { type: DataTypes.INTEGER, allowNull: false, field: 'doctor_id' },
  patientId: { type: DataTypes.INTEGER, allowNull: true, field: 'patient_id' },
  appointmentDate: { type: DataTypes.DATEONLY, allowNull: false, field: 'appointment_date' },
  appointmentTime: { type: DataTypes.STRING, allowNull: false, field: 'appointment_time' },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created_at' },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
    defaultValue: 'pending'
  },
  notes: { type: DataTypes.TEXT }
}, {
  tableName: 'appointments',
  timestamps: false
});

// =====================================
// ✅ Model Associations
// =====================================
User.hasOne(Patient, { foreignKey: 'userId' });
User.hasOne(Doctor, { foreignKey: 'userId' });
User.hasOne(Admin, { foreignKey: 'userId' });
User.hasOne(Guardian, { foreignKey: 'userId' });

Patient.belongsTo(User, { foreignKey: 'userId' });
Doctor.belongsTo(User, { foreignKey: 'userId' });
Admin.belongsTo(User, { foreignKey: 'userId' });
Guardian.belongsTo(User, { foreignKey: 'userId' });

Doctor.hasMany(Appointment, { foreignKey: 'doctorId' });
Patient.hasMany(Appointment, { foreignKey: 'patientId' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctorId' });
Appointment.belongsTo(Patient, { foreignKey: 'patientId' });

// =====================================
// ✅ Helper Functions
// =====================================
function validateEmail(email) {
  return /^[^@]+@[^@]+\.[^@]+$/.test(email);
}
function validatePassword(password) {
  return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password);
}
function generateToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET || 'jwtsecret',
    { expiresIn: '24h' }
  );
}
function convertToSqlTime(timeStr) {
  const [hour, minutePart] = timeStr.split(':');
  let [minute, period] = minutePart.split(' ');
  let h = parseInt(hour, 10);
  if (period === 'PM' && h < 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return `${h.toString().padStart(2, '0')}:${minute}:00`;
}

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  jwt.verify(token, process.env.JWT_SECRET || 'jwtsecret', (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.user = decoded;
    next();
  });
}

// =====================================
// ✅ Routes
// =====================================

// -------- AUTH ROUTES --------
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
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = generateToken(user);
    res.json({ message: 'Login successful', token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/verify', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/logout', authMiddleware, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// -------- APPOINTMENT ROUTES --------
app.post('/api/appointments', async (req, res) => {
  try {
    const { doctorId, patientId, appointmentDate, appointmentTime } = req.body;
    if (!doctorId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    const formattedTime = convertToSqlTime(appointmentTime);
    const appointment = await Appointment.create({
      doctorId,
      patientId: patientId || null,
      appointmentDate,
      appointmentTime: formattedTime
    });
    res.status(201).json({ message: 'Appointment created', appointment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/appointments', async (req, res) => {
  try {
    const { doctorId } = req.query;
    if (!doctorId) return res.status(400).json({ error: 'doctorId is required' });
    const appointments = await Appointment.findAll({ where: { doctorId } });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/appointments/all', async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      include: [
        { model: Doctor, attributes: ['first_name', 'last_name'] },
        { model: Patient, attributes: ['first_name', 'last_name'] }
      ]
    });
    const logs = appointments.map(app => ({
      id: app.id,
      patientName: app.Patient ? `${app.Patient.first_name} ${app.Patient.last_name}` : '-',
      doctorName: app.Doctor ? `${app.Doctor.first_name} ${app.Doctor.last_name}` : `#${app.doctorId}`,
      doctorId: app.doctorId,
      appointmentDate: app.appointmentDate,
      appointmentTime: app.appointmentTime,
      status: app.status
    }));
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ NEW FIXED ROUTE: Update Appointment Status
app.put('/api/appointments/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    const appointment = await Appointment.findByPk(id);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    appointment.status = status;
    await appointment.save();
    res.json({ message: 'Status updated successfully', appointment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------- HEALTH CHECK --------
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.send('API is running!');
});

// =====================================
// ✅ Socket.IO Server for WebRTC
// =====================================
const server = http.createServer(app);
const io = new IOServer(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

const signalingRooms = {};
const roomCleanupTimers = {};

io.on('connection', (socket) => {
  console.log('🔌 Socket connected:', socket.id);
  socket.on('join-room', (roomId) => {
    if (!roomId) return;
    console.log(`📥 Socket ${socket.id} joining room: ${roomId}`);
    if (roomCleanupTimers[roomId]) {
      clearTimeout(roomCleanupTimers[roomId]);
      delete roomCleanupTimers[roomId];
    }
    socket.join(roomId);
    if (!signalingRooms[roomId]) signalingRooms[roomId] = [];
    if (!signalingRooms[roomId].includes(socket.id))
      signalingRooms[roomId].push(socket.id);
    const otherUsers = signalingRooms[roomId].filter(id => id !== socket.id);
    socket.emit('room-users', otherUsers);
    socket.to(roomId).emit('user-joined', socket.id);
  });
  socket.on('offer', ({ to, offer }) => {
    if (to) io.to(to).emit('offer', { offer, from: socket.id });
  });
  socket.on('answer', ({ to, answer }) => {
    if (to) io.to(to).emit('answer', { answer, from: socket.id });
  });
  socket.on('ice-candidate', ({ to, candidate }) => {
    if (to) io.to(to).emit('ice-candidate', { candidate, from: socket.id });
  });
  socket.on('disconnect', () => {
    for (const roomId in signalingRooms) {
      const index = signalingRooms[roomId].indexOf(socket.id);
      if (index !== -1) {
        signalingRooms[roomId].splice(index, 1);
        socket.to(roomId).emit('user-disconnected', socket.id);
        if (signalingRooms[roomId].length === 0) {
          roomCleanupTimers[roomId] = setTimeout(() => {
            if (signalingRooms[roomId] && signalingRooms[roomId].length === 0) {
              delete signalingRooms[roomId];
              delete roomCleanupTimers[roomId];
            }
          }, 60000);
        }
      }
    }
  });
});

// =====================================
// ✅ Sync Database & Start Server
// =====================================
const PORT = process.env.PORT || 5000;
sequelize.sync({ alter: true }).then(() => {
  server.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`✅ API available at http://localhost:${PORT}`);
    console.log(`✅ Socket.IO signaling server ready`);
    console.log(`✅ Room persistence: 60 seconds after last user leaves`);
    console.log(`✅ Allowed origins: ${allowedOrigins.join(', ')}`);
    console.log('='.repeat(50));
  });
}).catch(err => {
  console.error('❌ Database sync failed:', err);
  process.exit(1);
});

// =====================================
// ✅ Graceful Shutdown
// =====================================
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM signal received: closing HTTP server');
  for (const roomId in roomCleanupTimers) {
    clearTimeout(roomCleanupTimers[roomId]);
  }
  server.close(() => {
    sequelize.close().then(() => {
      console.log('✅ Database connection closed');
      process.exit(0);
    });
  });
});
