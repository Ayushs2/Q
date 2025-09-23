// const mongoose = require('mongoose');

// const userProgressSchema = new mongoose.Schema({
//   userId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'User', 
//     required: true,
//     index: true
//   },
//   score: { 
//     type: Number, 
//     required: true,
//     min: 0
//   },
//   totalQuestions: { 
//     type: Number, 
//     required: true,
//     min: 1
//   },
//   testName: { 
//     type: String, 
//     default: 'Practice Test',
//     trim: true,
//     maxlength: 100
//   },
//   testType: { 
//     type: String, 
//     default: 'practice',
//     enum: ['practice', 'mock', 'custom', 'quick', 'comprehensive'],
//     index: true
//   },
//   timeTaken: { 
//     type: Number, 
//     default: 0,
//     min: 0 // in seconds
//   },
//   accuracy: { 
//     type: Number,
//     min: 0,
//     max: 100
//   },
//   subjects: [{
//     name: { type: String, trim: true },
//     questionsAnswered: { type: Number, min: 0 },
//     correctAnswers: { type: Number, min: 0 },
//     accuracy: { type: Number, min: 0, max: 100 }
//   }],
//   difficulty: {
//     type: String,
//     enum: ['easy', 'medium', 'hard', 'mixed'],
//     default: 'mixed'
//   },
//   questionsData: [{
//     questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'MCQ' },
//     userAnswer: { type: String, enum: ['A', 'B', 'C', 'D', ''] },
//     correctAnswer: { type: String, enum: ['A', 'B', 'C', 'D'] },
//     isCorrect: { type: Boolean },
//     timeTaken: { type: Number, min: 0 }, // in seconds for this question
//     subject: { type: String, trim: true }
//   }],
//   date: { 
//     type: Date, 
//     default: Date.now,
//     index: true
//   }
// });

// // Virtual for accuracy calculation if not provided
// userProgressSchema.virtual('calculatedAccuracy').get(function() {
//   if (this.accuracy !== undefined) {
//     return this.accuracy;
//   }
//   return this.totalQuestions > 0 ? Math.round((this.score / this.totalQuestions) * 100) : 0;
// });

// // Virtual for average time per question
// userProgressSchema.virtual('avgTimePerQuestion').get(function() {
//   return this.totalQuestions > 0 ? Math.round(this.timeTaken / this.totalQuestions) : 0;
// });

// // Virtual for performance grade
// userProgressSchema.virtual('performanceGrade').get(function() {
//   const accuracy = this.calculatedAccuracy;
//   if (accuracy >= 90) return 'A';
//   if (accuracy >= 80) return 'B';
//   if (accuracy >= 70) return 'C';
//   if (accuracy >= 60) return 'D';
//   return 'F';
// });

// // Pre-save middleware to calculate accuracy if not provided
// userProgressSchema.pre('save', function(next) {
//   if (this.accuracy === undefined) {
//     this.accuracy = this.totalQuestions > 0 ? Math.round((this.score / this.totalQuestions) * 100) : 0;
//   }
//   next();
// });

// // Static method to get user statistics
// userProgressSchema.statics.getUserStats = async function(userId) {
//   try {
//     const stats = await this.aggregate([
//       { $match: { userId: new mongoose.Types.ObjectId(userId) } },
//       {
//         $group: {
//           _id: '$userId',
//           totalTests: { $sum: 1 },
//           totalQuestions: { $sum: '$totalQuestions' },
//           totalScore: { $sum: '$score' },
//           avgAccuracy: { $avg: '$accuracy' },
//           totalTimeTaken: { $sum: '$timeTaken' },
//           bestScore: { $max: '$accuracy' },
//           recentTests: { $push: { date: '$date', accuracy: '$accuracy', testName: '$testName' } }
//         }
//       },
//       {
//         $project: {
//           totalTests: 1,
//           totalQuestions: 1,
//           totalScore: 1,
//           avgAccuracy: { $round: ['$avgAccuracy', 1] },
//           totalTimeTaken: 1,
//           bestScore: 1,
//           avgTimePerTest: { 
//             $cond: { 
//               if: { $gt: ['$totalTests', 0] }, 
//               then: { $round: [{ $divide: ['$totalTimeTaken', '$totalTests'] }, 0] }, 
//               else: 0 
//             } 
//           },
//           recentTests: { $slice: [{ $sortArray: { input: '$recentTests', sortBy: { date: -1 } } }, 10] }
//         }
//       }
//     ]);
    
//     return stats[0] || {
//       totalTests: 0,
//       totalQuestions: 0,
//       totalScore: 0,
//       avgAccuracy: 0,
//       totalTimeTaken: 0,
//       bestScore: 0,
//       avgTimePerTest: 0,
//       recentTests: []
//     };
//   } catch (error) {
//     throw error;
//   }
// };

// // Static method to get subject-wise performance
// userProgressSchema.statics.getSubjectPerformance = async function(userId) {
//   try {
//     return await this.aggregate([
//       { $match: { userId: new mongoose.Types.ObjectId(userId) } },
//       { $unwind: '$subjects' },
//       {
//         $group: {
//           _id: '$subjects.name',
//           totalQuestions: { $sum: '$subjects.questionsAnswered' },
//           totalCorrect: { $sum: '$subjects.correctAnswers' },
//           avgAccuracy: { $avg: '$subjects.accuracy' },
//           testCount: { $sum: 1 }
//         }
//       },
//       {
//         $project: {
//           subject: '$_id',
//           totalQuestions: 1,
//           totalCorrect: 1,
//           avgAccuracy: { $round: ['$avgAccuracy', 1] },
//           testCount: 1,
//           _id: 0
//         }
//       },
//       { $sort: { avgAccuracy: -1 } }
//     ]);
//   } catch (error) {
//     throw error;
//   }
// };

// // Static method to get performance trend
// userProgressSchema.statics.getPerformanceTrend = async function(userId, days = 30) {
//   try {
//     const startDate = new Date();
//     startDate.setDate(startDate.getDate() - days);
    
//     return await this.aggregate([
//       { 
//         $match: { 
//           userId: new mongoose.Types.ObjectId(userId),
//           date: { $gte: startDate }
//         } 
//       },
//       {
//         $group: {
//           _id: {
//             year: { $year: '$date' },
//             month: { $month: '$date' },
//             day: { $dayOfMonth: '$date' }
//           },
//           avgAccuracy: { $avg: '$accuracy' },
//           testCount: { $sum: 1 },
//           totalQuestions: { $sum: '$totalQuestions' },
//           date: { $first: '$date' }
//         }
//       },
//       {
//         $project: {
//           date: 1,
//           avgAccuracy: { $round: ['$avgAccuracy', 1] },
//           testCount: 1,
//           totalQuestions: 1,
//           _id: 0
//         }
//       },
//       { $sort: { date: 1 } }
//     ]);
//   } catch (error) {
//     throw error;
//   }
// };

// // Instance method to calculate improvement
// userProgressSchema.methods.getImprovementRate = async function() {
//   try {
//     const recentTests = await this.constructor.find({
//       userId: this.userId,
//       date: { $lte: this.date }
//     })
//     .sort({ date: -1 })
//     .limit(5)
//     .select('accuracy date');
    
//     if (recentTests.length < 2) return 0;
    
//     const oldestAccuracy = recentTests[recentTests.length - 1].accuracy;
//     const newestAccuracy = recentTests[0].accuracy;
    
//     return Math.round(((newestAccuracy - oldestAccuracy) / oldestAccuracy) * 100);
//   } catch (error) {
//     return 0;
//   }
// };

// // Set schema options
// userProgressSchema.set('toJSON', { virtuals: true });
// userProgressSchema.set('toObject', { virtuals: true });

// // Indexes for better performance
// userProgressSchema.index({ userId: 1, date: -1 });
// userProgressSchema.index({ testType: 1 });
// userProgressSchema.index({ date: -1 });
// userProgressSchema.index({ accuracy: -1 });
// userProgressSchema.index({ userId: 1, testType: 1 });

// module.exports = mongoose.model('UserProgress', userProgressSchema);

const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  score: {
    type: Number,
    required: true,
    min: 0
  },
  totalQuestions: {
    type: Number,
    required: true,
    min: 1
  },
  testName: {
    type: String,
    default: 'Practice Test',
    trim: true
  },
  testType: {
    type: String,
    enum: ['practice', 'mock', 'custom', 'timed'],
    default: 'practice'
  },
  timeTaken: {
    type: Number, // in seconds
    default: 0,
    min: 0
  },
  accuracy: {
    type: Number, // percentage
    min: 0,
    max: 100
  },
  subjects: [{
    type: String,
    trim: true
  }],
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'mixed'],
    default: 'mixed'
  },
  detailedResults: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MCQ'
    },
    userAnswer: {
      type: String,
      enum: ['A', 'B', 'C', 'D', '']
    },
    correctAnswer: {
      type: String,
      enum: ['A', 'B', 'C', 'D']
    },
    isCorrect: Boolean,
    timeTakenForQuestion: Number, // in seconds
    subject: String
  }],
  date: {
    type: Date,
    default: Date.now,
    index: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate accuracy percentage before saving
userProgressSchema.pre('save', function(next) {
  if (this.score !== undefined && this.totalQuestions) {
    this.accuracy = Math.round((this.score / this.totalQuestions) * 100);
  }
  next();
});

// Virtual for pass/fail status (assuming 60% is passing)
userProgressSchema.virtual('isPassed').get(function() {
  return this.accuracy >= 60;
});

// Virtual for grade
userProgressSchema.virtual('grade').get(function() {
  if (this.accuracy >= 90) return 'A';
  if (this.accuracy >= 80) return 'B';
  if (this.accuracy >= 70) return 'C';
  if (this.accuracy >= 60) return 'D';
  return 'F';
});

// Virtual for performance level
userProgressSchema.virtual('performanceLevel').get(function() {
  if (this.accuracy >= 90) return 'Excellent';
  if (this.accuracy >= 80) return 'Good';
  if (this.accuracy >= 70) return 'Average';
  if (this.accuracy >= 60) return 'Below Average';
  return 'Poor';
});

// Indexes for better performance
userProgressSchema.index({ userId: 1, date: -1 });
userProgressSchema.index({ testType: 1 });
userProgressSchema.index({ accuracy: -1 });
userProgressSchema.index({ score: -1 });
userProgressSchema.index({ userId: 1, testType: 1 });

// Static method to get user statistics
userProgressSchema.statics.getUserStats = async function(userId) {
  return await this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalTests: { $sum: 1 },
        totalQuestions: { $sum: '$totalQuestions' },
        totalCorrect: { $sum: '$score' },
        avgAccuracy: { $avg: '$accuracy' },
        bestScore: { $max: '$accuracy' },
        totalTimeTaken: { $sum: '$timeTaken' },
        recentTests: { $push: { date: '$date', accuracy: '$accuracy', testName: '$testName' } }
      }
    }
  ]);
};

// Static method to get leaderboard
userProgressSchema.statics.getLeaderboard = async function(limit = 10) {
  return await this.aggregate([
    {
      $group: {
        _id: '$userId',
        totalScore: { $sum: '$score' },
        totalQuestions: { $sum: '$totalQuestions' },
        avgAccuracy: { $avg: '$accuracy' },
        totalTests: { $sum: 1 },
        bestAccuracy: { $max: '$accuracy' }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' },
    {
      $project: {
        userId: '$_id',
        username: '$user.username',
        fullName: '$user.fullName',
        totalScore: 1,
        totalQuestions: 1,
        avgAccuracy: { $round: ['$avgAccuracy', 1] },
        totalTests: 1,
        bestAccuracy: 1,
        overallScore: {
          $round: [
            { $multiply: [{ $divide: ['$totalScore', '$totalQuestions'] }, 100] },
            1
          ]
        }
      }
    },
    { $sort: { overallScore: -1 } },
    { $limit: limit }
  ]);
};

// Set schema options
userProgressSchema.set('toJSON', { virtuals: true });
userProgressSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('UserProgress', userProgressSchema);