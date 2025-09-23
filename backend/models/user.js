// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true
//   },
//   password: {
//     type: String,
//     required: true
//   },
//   isAdmin: {
//     type: Boolean,
//     default: false  // Important: Set default value
//   }
// }, {
//   timestamps: true
// });

// // Hash password before saving
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
  
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// module.exports = mongoose.model('User', userSchema);

// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   email: { type: String, unique: true, sparse: true }, // Optional email
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
//   password: { type: String, required: true },
//   isAdmin: { type: Boolean, default: false },
//   profileImage: { type: String }, // Optional profile picture
//   createdAt: { type: Date, default: Date.now }
// });

// // Virtual for full name
// userSchema.virtual('fullName').get(function() {
//   return `${this.firstName} ${this.lastName}`;
// });

// // Hash password before saving
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// module.exports = mongoose.model('User', userSchema);


// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema({
//   username: { 
//     type: String, 
//     required: true, 
//     unique: true,
//     trim: true,
//     minlength: 3,
//     maxlength: 30
//   },
//   email: { 
//     type: String, 
//     unique: true, 
//     sparse: true,
//     trim: true,
//     lowercase: true,
//     match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
//   },
//   firstName: { 
//     type: String, 
//     required: true,
//     trim: true,
//     maxlength: 50
//   },
//   lastName: { 
//     type: String, 
//     required: true,
//     trim: true,
//     maxlength: 50
//   },
//   password: { 
//     type: String, 
//     required: true,
//     minlength: 6
//   },
//   isAdmin: { 
//     type: Boolean, 
//     default: false 
//   },
//   profileImage: { 
//     type: String,
//     default: null
//   },
//   lastLogin: {
//     type: Date,
//     default: null
//   },
//   loginCount: {
//     type: Number,
//     default: 0
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   createdAt: { 
//     type: Date, 
//     default: Date.now 
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Virtual for full name
// userSchema.virtual('fullName').get(function() {
//   return `${this.firstName} ${this.lastName}`;
// });

// // Virtual for initials
// userSchema.virtual('initials').get(function() {
//   return `${this.firstName.charAt(0)}${this.lastName.charAt(0)}`.toUpperCase();
// });

// // Hash password before saving
// userSchema.pre('save', async function(next) {
//   // Only hash password if it's modified
//   if (!this.isModified('password')) return next();
  
//   try {
//     // Hash password with cost of 12
//     this.password = await bcrypt.hash(this.password, 12);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// // Update the updatedAt field before saving
// userSchema.pre('save', function(next) {
//   this.updatedAt = Date.now();
//   next();
// });

// // Instance method to check password
// userSchema.methods.comparePassword = async function(candidatePassword) {
//   try {
//     return await bcrypt.compare(candidatePassword, this.password);
//   } catch (error) {
//     throw error;
//   }
// };

// // Instance method to update last login
// userSchema.methods.updateLastLogin = async function() {
//   this.lastLogin = new Date();
//   this.loginCount += 1;
//   return await this.save();
// };

// // Instance method to get user profile (without sensitive data)
// userSchema.methods.getPublicProfile = function() {
//   const userObject = this.toObject();
//   delete userObject.password;
//   return userObject;
// };

// // Static method to find by credentials
// userSchema.statics.findByCredentials = async function(username, password) {
//   const user = await this.findOne({ 
//     username: username.trim().toLowerCase(),
//     isActive: true 
//   });
  
//   if (!user) {
//     throw new Error('Invalid credentials');
//   }

//   const isMatch = await user.comparePassword(password);
//   if (!isMatch) {
//     throw new Error('Invalid credentials');
//   }

//   return user;
// };

// // Set schema options
// userSchema.set('toJSON', { 
//   virtuals: true,
//   transform: function(doc, ret) {
//     delete ret.password;
//     delete ret.__v;
//     return ret;
//   }
// });

// userSchema.set('toObject', { virtuals: true });

// // Indexes for better performance
// userSchema.index({ username: 1 });
// userSchema.index({ email: 1 });
// userSchema.index({ isAdmin: 1 });
// userSchema.index({ isActive: 1 });
// userSchema.index({ createdAt: -1 });

// module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,  // This creates an index automatically
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: { 
    type: String, 
    unique: true,  // This creates an index automatically
    sparse: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
  },
  firstName: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 50
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  isAdmin: { 
    type: Boolean, 
    default: false 
  },
  profileImage: { 
    type: String,
    default: null
  },
  lastLogin: {
    type: Date,
    default: null
  },
  loginCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for initials
userSchema.virtual('initials').get(function() {
  return `${this.firstName.charAt(0)}${this.lastName.charAt(0)}`.toUpperCase();
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash password if it's modified
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
  }
});

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Instance method to update last login
userSchema.methods.updateLastLogin = async function() {
  this.lastLogin = new Date();
  this.loginCount += 1;
  return await this.save();
};

// Instance method to get user profile (without sensitive data)
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Static method to find by credentials
userSchema.statics.findByCredentials = async function(username, password) {
  const user = await this.findOne({ 
    username: username.trim().toLowerCase(),
    isActive: true 
  });
  
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  return user;
};

// Set schema options
userSchema.set('toJSON', { 
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password;
    delete ret.__v;
    return ret;
  }
});

userSchema.set('toObject', { virtuals: true });

// REMOVED DUPLICATE INDEXES - unique: true already creates them
// Only add additional indexes that aren't already created by unique: true
userSchema.index({ isAdmin: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', userSchema);