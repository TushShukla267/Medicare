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

// ✅ Allow both CRA (3000) and Vite (5173)
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow curl/postman
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('Not allowed by CORS'), false);
    }
    return callback(null, true);
  },
  credentials: true
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

Patient.belongsTo(User, { foreignKey: 'userId' });
Doctor.belongsTo(User, { foreignKey: 'userId' });
Admin.belongsTo(User, { foreignKey: 'userId' });
Guardian.belongsTo(User, { foreignKey: 'userId' });

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

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.send('API is running!');
});

// =========================
// Socket.IO signaling server for WebRTC (integrated)
// =========================
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

// ✅ Enhanced room tracking with persistence timers
const signalingRooms = {}; // { roomId: [socketId, ...] }
const roomCleanupTimers = {}; // { roomId: timeoutId }

io.on('connection', (socket) => {
  console.log('🔌 Socket connected:', socket.id);

  // ✅ Join room event
  socket.on('join-room', (roomId) => {
    if (!roomId) {
      console.log('❌ No roomId provided');
      return;
    }
    
    console.log(`📥 Socket ${socket.id} joining room: ${roomId}`);
    
    // Clear any existing cleanup timer for this room (user reconnecting)
    if (roomCleanupTimers[roomId]) {
      console.log(`⏰ Clearing cleanup timer for room ${roomId} (user reconnecting)`);
      clearTimeout(roomCleanupTimers[roomId]);
      delete roomCleanupTimers[roomId];
    }
    
    socket.join(roomId);
    
    if (!signalingRooms[roomId]) {
      signalingRooms[roomId] = [];
    }
    
    // Avoid duplicates
    if (!signalingRooms[roomId].includes(socket.id)) {
      signalingRooms[roomId].push(socket.id);
    }

    // Send current users in room (excluding self)
    const otherUsers = signalingRooms[roomId].filter(id => id !== socket.id);
    socket.emit('room-users', otherUsers);
    
    // Notify others that someone joined (or rejoined)
    socket.to(roomId).emit('user-joined', socket.id);

    console.log(`✅ Room ${roomId} users:`, signalingRooms[roomId]);
  });

  // ✅ Handle WebRTC offer
  socket.on('offer', (data) => {
    const { to, offer } = data;
    if (!to) {
      console.log('❌ No recipient for offer');
      return;
    }
    console.log(`📤 Forwarding offer from ${socket.id} to ${to}`);
    io.to(to).emit('offer', { offer, from: socket.id });
  });

  // ✅ Handle WebRTC answer
  socket.on('answer', (data) => {
    const { to, answer } = data;
    if (!to) {
      console.log('❌ No recipient for answer');
      return;
    }
    console.log(`📤 Forwarding answer from ${socket.id} to ${to}`);
    io.to(to).emit('answer', { answer, from: socket.id });
  });

  // ✅ Handle ICE candidate
  socket.on('ice-candidate', (data) => {
    const { to, candidate } = data;
    if (!to) {
      console.log('❌ No recipient for ICE candidate');
      return;
    }
    console.log(`🧊 Forwarding ICE candidate from ${socket.id} to ${to}`);
    io.to(to).emit('ice-candidate', { candidate, from: socket.id });
  });

  // ✅ Handle disconnect with room persistence
  socket.on('disconnect', () => {
    console.log('🔌 Socket disconnected:', socket.id);
    
    // Remove from all rooms
    for (const roomId in signalingRooms) {
      const index = signalingRooms[roomId].indexOf(socket.id);
      if (index !== -1) {
        signalingRooms[roomId].splice(index, 1);
        
        // Notify others in the room
        socket.to(roomId).emit('user-disconnected', socket.id);
        
        console.log(`👋 Removed ${socket.id} from room ${roomId}`);
        console.log(`📊 Room ${roomId} now has ${signalingRooms[roomId].length} user(s)`);
        
        // If room is empty, start cleanup timer (60 seconds)
        if (signalingRooms[roomId].length === 0) {
          console.log(`⏰ Starting 60-second cleanup timer for empty room: ${roomId}`);
          
          roomCleanupTimers[roomId] = setTimeout(() => {
            if (signalingRooms[roomId] && signalingRooms[roomId].length === 0) {
              console.log(`🗑️ Cleaning up empty room after timeout: ${roomId}`);
              delete signalingRooms[roomId];
              delete roomCleanupTimers[roomId];
            }
          }, 60000); // 60 seconds
        }
      }
    }
  });

  // ✅ Handle explicit leave room
  socket.on('leave-room', (roomId) => {
    if (signalingRooms[roomId]) {
      const index = signalingRooms[roomId].indexOf(socket.id);
      if (index !== -1) {
        signalingRooms[roomId].splice(index, 1);
        socket.leave(roomId);
        socket.to(roomId).emit('user-disconnected', socket.id);
        console.log(`👋 Socket ${socket.id} left room ${roomId}`);
        
        // Start cleanup timer if room is empty
        if (signalingRooms[roomId].length === 0) {
          console.log(`⏰ Starting 60-second cleanup timer for room: ${roomId}`);
          
          roomCleanupTimers[roomId] = setTimeout(() => {
            if (signalingRooms[roomId] && signalingRooms[roomId].length === 0) {
              console.log(`🗑️ Cleaning up empty room: ${roomId}`);
              delete signalingRooms[roomId];
              delete roomCleanupTimers[roomId];
            }
          }, 60000);
        }
      }
    }
  });

  // ✅ Error handling
  socket.on('error', (error) => {
    console.error('❌ Socket error:', error);
  });
});

// ✅ Sync DB & start server
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

// ✅ Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM signal received: closing HTTP server');
  
  // Clear all cleanup timers
  for (const roomId in roomCleanupTimers) {
    clearTimeout(roomCleanupTimers[roomId]);
  }
  
  server.close(() => {
    console.log('✅ HTTP server closed');
    sequelize.close().then(() => {
      console.log('✅ Database connection closed');
      process.exit(0);
    });
  });
});
