const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/civicchain';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    // Clean up old indexes and collections that have walletAddress
    try {
      await mongoose.connection.db.collection('users').dropIndex('walletAddress_1').catch(() => {});
      await mongoose.connection.db.collection('grievances').dropIndex('walletAddress_1').catch(() => {});
      console.log('🧹 Cleaned up old wallet-related indexes');
    } catch (error) {
      console.log('ℹ️ No old indexes to clean up or already cleaned');
    }
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// User Schema (New Email/Password + ZKP Verification System)
const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  
  // Profile Information
  profile: {
    fullName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    phone: { type: String, required: true },
    address: {
      line1: { type: String, required: true },
      line2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true }
    }
  },
  
  // Verification Status
  verification: {
    email: { type: Boolean, default: false },
    phone: { type: Boolean, default: false },
    aadhaar: { type: Boolean, default: false } // Will be set to true after ZKP verification
  },
  
  // Aadhaar ZKP Data (will be filled during ZKP verification step)
  aadhaarZKP: {
    verified: { type: Boolean, default: false },
    nullifier: { 
      type: String, 
      sparse: true, 
      unique: true,
      default: undefined // Explicitly set default to undefined to avoid null conflicts
    }, 
    verificationDate: { type: Date },
    zkProof: {
      ageAbove18: { type: String },
      gender: { type: String },
      state: { type: String },
      pincode: { type: String },
      signalHash: { type: String },
      timestamp: { type: String }
    }
  },
  
  // Account Management
  accountStatus: { type: String, enum: ['active', 'suspended', 'inactive'], default: 'active' },
  grievanceCount: { type: Number, default: 0 },
  lastLogin: { type: Date },
  settings: {
    notifications: { type: Boolean, default: true },
    newsletter: { type: Boolean, default: false },
    privacy: { type: String, enum: ['public', 'private'], default: 'public' }
  }
}, {
  timestamps: true
});

// ZKP User Schema (Aadhaar verified users)
const zkpUserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  nullifier: { type: String, required: true, unique: true },
  verified: { type: Boolean, default: true },
  aadhaarVerified: { type: Boolean, default: true },
  ageVerified: { type: Boolean, default: false },
  grievanceCount: { type: Number, default: 0 },
  registrationDate: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
  profile: {
    ageCategory: { type: String }, // "18+" or "Under 18"
    location: {
      state: { type: String },
      pincode: { type: String }
    },
    verificationLevel: { type: String, default: 'full' }
  },
  zkProof: {
    nullifier: { type: String, required: true },
    timestamp: { type: String },
    ageAbove18: { type: String },
    gender: { type: String },
    state: { type: String },
    pincode: { type: String },
    signalHash: { type: String },
    verified: { type: Boolean, default: true },
    verificationTime: { type: Date, default: Date.now }
  }
}, {
  timestamps: true
});

// Grievance Schema (Updated for ZKP users only)
const grievanceSchema = new mongoose.Schema({
  grievanceId: { type: String, required: true, unique: true },
  // User identification (ZKP nullifier only)
  zkpNullifier: { type: String, required: true }, // For ZKP verified users
  userEmail: { type: String, required: true }, // Link to user email for identification
  
  // Citizen information
  citizenName: { type: String, required: true },
  citizenEmail: { type: String, required: true },
  citizenPhone: { type: String, required: true },
  citizenAddress: { type: String, required: true },
  
  // Grievance details
  description: { type: String, required: true },
  department: { type: String, required: true },
  state: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['raised', 'in_progress', 'resolved', 'failed'],
    default: 'raised'
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  submittedAt: { type: Date, default: Date.now },
  transactionHash: { type: String },
  blockNumber: { type: String },
  gasUsed: { type: String },
  category: { type: String, required: true },
  timeline: [{
    status: String,
    description: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Create Models
const User = mongoose.model('User', userSchema);
const ZKPUser = mongoose.model('ZKPUser', zkpUserSchema);
const Grievance = mongoose.model('Grievance', grievanceSchema);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'CivicChain API is running',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Middleware for JWT verification
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Helper function to generate user ID
const generateUserId = () => {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Authentication endpoints
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, profile } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ 
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user with temporary data (ZKP verification required before full access)
    const userData = {
      id: generateUserId(),
      email,
      passwordHash,
      profile,
      verification: {
        email: false, // TODO: Implement email verification
        phone: false,
        aadhaar: false // Will be set to true after ZKP verification
      },
      aadhaarZKP: {
        verified: false
        // nullifier and other fields will be set during ZKP verification step
      },
      accountStatus: 'active',
      grievanceCount: 0,
      settings: {
        notifications: true,
        newsletter: false,
        privacy: 'public'
      }
    };

    const user = new User(userData);
    const savedUser = await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: savedUser.id, email: savedUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password hash from response
    const userResponse = savedUser.toObject();
    delete userResponse.passwordHash;

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(400).json({ 
      message: 'Failed to register user',
      error: error.message
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (user.accountStatus !== 'active') {
      return res.status(401).json({ 
        message: 'Account is suspended or inactive'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Invalid email or password'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password hash from response
    const userResponse = user.toObject();
    delete userResponse.passwordHash;

    res.json({
      message: 'Login successful',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ 
      message: 'Failed to login',
      error: error.message
    });
  }
});

// Get current user profile
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ id: req.user.userId }).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User profile retrieved successfully',
      user
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ 
      message: 'Failed to fetch user profile',
      error: error.message
    });
  }
});

// Aadhaar ZKP Verification endpoint
app.post('/api/auth/verify-aadhaar', authenticateToken, async (req, res) => {
  try {
    const { zkProof } = req.body;
    
    const user = await User.findOne({ id: req.user.userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if nullifier already exists (prevent duplicate verifications)
    if (zkProof.nullifier) {
      const existingVerification = await User.findOne({ 
        'aadhaarZKP.nullifier': zkProof.nullifier 
      });
      if (existingVerification && existingVerification.id !== user.id) {
        return res.status(409).json({ 
          message: 'This Aadhaar has already been verified by another account'
        });
      }
    }

    // Update user with Aadhaar verification
    user.verification.aadhaar = true;
    user.aadhaarZKP = {
      verified: true,
      nullifier: zkProof.nullifier,
      verificationDate: new Date(),
      zkProof: {
        ageAbove18: zkProof.ageAbove18,
        gender: zkProof.gender,
        state: zkProof.state,
        pincode: zkProof.pincode,
        signalHash: zkProof.signalHash,
        timestamp: zkProof.timestamp
      }
    };

    const savedUser = await user.save();

    // Remove password hash from response
    const userResponse = savedUser.toObject();
    delete userResponse.passwordHash;

    res.json({
      message: 'Aadhaar verification successful',
      user: userResponse
    });
  } catch (error) {
    console.error('Error verifying Aadhaar:', error);
    res.status(500).json({ 
      message: 'Failed to verify Aadhaar',
      error: error.message
    });
  }
});

// Users endpoints (Updated)
// Users endpoints (Email + ZKP Only) - Wallet functionality removed
app.get('/api/users/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      message: 'User retrieved successfully',
      user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ 
      message: 'Failed to fetch user',
      error: error.message
    });
  }
});

// ZKP Users endpoints
app.post('/api/zkp-users', async (req, res) => {
  try {
    const zkpUserData = req.body;
    
    // Check if ZKP user already exists
    const existingZKPUser = await ZKPUser.findOne({ nullifier: zkpUserData.nullifier });
    if (existingZKPUser) {
      return res.status(409).json({ 
        message: 'User with this nullifier already exists',
        nullifier: zkpUserData.nullifier
      });
    }

    const zkpUser = new ZKPUser(zkpUserData);
    const savedZKPUser = await zkpUser.save();
    
    res.status(201).json({
      message: 'ZKP User created successfully',
      user: savedZKPUser
    });
  } catch (error) {
    console.error('Error creating ZKP user:', error);
    res.status(400).json({ 
      message: 'Failed to create ZKP user',
      error: error.message
    });
  }
});

app.get('/api/zkp-users', async (req, res) => {
  try {
    const zkpUsers = await ZKPUser.find();
    res.json({
      message: 'ZKP Users retrieved successfully',
      count: zkpUsers.length,
      users: zkpUsers
    });
  } catch (error) {
    console.error('Error fetching ZKP users:', error);
    res.status(500).json({ 
      message: 'Failed to fetch ZKP users',
      error: error.message
    });
  }
});

app.get('/api/zkp-users/:nullifier', async (req, res) => {
  try {
    const { nullifier } = req.params;
    const zkpUser = await ZKPUser.findOne({ nullifier });
    
    if (!zkpUser) {
      return res.status(404).json({ 
        message: 'ZKP User not found',
        nullifier
      });
    }

    res.json({
      message: 'ZKP User retrieved successfully',
      user: zkpUser
    });
  } catch (error) {
    console.error('Error fetching ZKP user:', error);
    res.status(500).json({ 
      message: 'Failed to fetch ZKP user',
      error: error.message
    });
  }
});

// Grievances endpoints
app.post('/api/grievances', async (req, res) => {
  try {
    const grievanceData = req.body;
    
    // Check if grievance already exists
    const existingGrievance = await Grievance.findOne({ grievanceId: grievanceData.grievanceId });
    if (existingGrievance) {
      return res.status(409).json({ 
        message: 'Grievance with this ID already exists',
        grievanceId: grievanceData.grievanceId
      });
    }

    const grievance = new Grievance(grievanceData);
    const savedGrievance = await grievance.save();
    
    res.status(201).json({
      message: 'Grievance created successfully',
      grievance: savedGrievance
    });
  } catch (error) {
    console.error('Error creating grievance:', error);
    res.status(400).json({ 
      message: 'Failed to create grievance',
      error: error.message
    });
  }
});

app.get('/api/grievances', async (req, res) => {
  try {
    const { state, status, department, limit = 50, page = 1 } = req.query;
    
    // Build filter
    const filter = {};
    if (state) filter.state = state;
    if (status) filter.status = status;
    if (department) filter.department = department;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const grievances = await Grievance.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);
      
    const total = await Grievance.countDocuments(filter);
    
    res.json({
      message: 'Grievances retrieved successfully',
      count: grievances.length,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      grievances
    });
  } catch (error) {
    console.error('Error fetching grievances:', error);
    res.status(500).json({ 
      message: 'Failed to fetch grievances',
      error: error.message
    });
  }
});

app.get('/api/grievances/:grievanceId', async (req, res) => {
  try {
    const grievance = await Grievance.findOne({ grievanceId: req.params.grievanceId });
    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }
    res.json({
      message: 'Grievance retrieved successfully',
      grievance
    });
  } catch (error) {
    console.error('Error fetching grievance:', error);
    res.status(500).json({ 
      message: 'Failed to fetch grievance',
      error: error.message
    });
  }
});

// Update grievance status
app.patch('/api/grievances/:grievanceId/status', async (req, res) => {
  try {
    const { status, description } = req.body;
    
    const grievance = await Grievance.findOne({ grievanceId: req.params.grievanceId });
    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }
    
    // Update status
    grievance.status = status;
    
    // Add to timeline
    grievance.timeline.push({
      status,
      description: description || `Status updated to ${status}`,
      timestamp: new Date()
    });
    
    const updatedGrievance = await grievance.save();
    
    res.json({
      message: 'Grievance status updated successfully',
      grievance: updatedGrievance
    });
  } catch (error) {
    console.error('Error updating grievance:', error);
    res.status(500).json({ 
      message: 'Failed to update grievance',
      error: error.message
    });
  }
});

// Statistics endpoint
app.get('/api/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      totalGrievances,
      grievancesByStatus,
      grievancesByState,
      grievancesByDepartment
    ] = await Promise.all([
      User.countDocuments(),
      Grievance.countDocuments(),
      Grievance.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Grievance.aggregate([
        { $group: { _id: '$state', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Grievance.aggregate([
        { $group: { _id: '$department', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);
    
    res.json({
      message: 'Statistics retrieved successfully',
      stats: {
        totalUsers,
        totalGrievances,
        grievancesByStatus,
        grievancesByState,
        grievancesByDepartment
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ 
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 CivicChain API Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📚 API Base URL: http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n⚠️ Shutting down server...');
  await mongoose.connection.close();
  console.log('✅ Database connection closed');
  process.exit(0);
});

module.exports = app;
