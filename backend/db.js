const mongoose = require('mongoose');

const dbURI = 'mongodb+srv://singhayush0105:Affrim%40123@cluster0.6tdpouv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
  try {
    // These options are now deprecated and can be removed
    await mongoose.connect(dbURI);
    console.log('MongoDB connected successfully!');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;