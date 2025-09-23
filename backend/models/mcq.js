// const mongoose = require('mongoose');

// const mcqSchema = new mongoose.Schema({
//   question: { type: String, required: true },
//   options: {
//     A: { type: String, required: true },
//     B: { type: String, required: true },
//     C: { type: String, required: true },
//     D: { type: String, required: true }
//   },
//   correctAnswer: { type: String, required: true },
//   explanation: { type: String },
//   subject: { type: String },
//   topic: { type: String },

//   // ✅ New field
//   exam: { type: String, default: "" }, // Example: "GATE 2023", "IES 2022", "Not PYQ"
//   year: { type: Number } 
// });

// module.exports = mongoose.model('MCQ', mcqSchema);



// // models/mcq.js - Updated with Cloudinary image support
// const mongoose = require('mongoose');

// const mcqSchema = new mongoose.Schema({
//   question: { type: String, required: true },
  
//   // Image support for questions
//   questionImage: {
//     url: { type: String }, // Cloudinary URL
//     publicId: { type: String }, // Cloudinary public ID for deletion
//     description: { type: String } // Alt text for accessibility
//   },
  
//   options: {
//     A: { type: String, required: true },
//     B: { type: String, required: true },
//     C: { type: String, required: true },
//     D: { type: String, required: true }
//   },
  
//   // Image support for options
//   optionImages: {
//     A: {
//       url: { type: String },
//       publicId: { type: String },
//       description: { type: String }
//     },
//     B: {
//       url: { type: String },
//       publicId: { type: String },
//       description: { type: String }
//     },
//     C: {
//       url: { type: String },
//       publicId: { type: String },
//       description: { type: String }
//     },
//     D: {
//       url: { type: String },
//       publicId: { type: String },
//       description: { type: String }
//     }
//   },
  
//   correctAnswer: { type: String, required: true },
//   explanation: { type: String },
  
//   // Image support for explanations
//   explanationImage: {
//     url: { type: String },
//     publicId: { type: String },
//     description: { type: String }
//   },
  
//   subject: { type: String },
//   topic: { type: String },
//   exam: { type: String, default: "" },
//   year: { type: Number },
  
//   // Metadata
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// });

// // Update the updatedAt field before saving
// mcqSchema.pre('save', function(next) {
//   this.updatedAt = Date.now();
//   next();
// });

// module.exports = mongoose.model('MCQ', mcqSchema);







const mongoose = require('mongoose');

const mcqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  questionImage: {
    url: String,
    publicId: String,
    description: String
  },
  options: {
    A: { type: String, required: true, trim: true },
    B: { type: String, required: true, trim: true },
    C: { type: String, required: true, trim: true },
    D: { type: String, required: true, trim: true }
  },
  optionImages: {
    A: {
      url: String,
      publicId: String,
      description: String
    },
    B: {
      url: String,
      publicId: String,
      description: String
    },
    C: {
      url: String,
      publicId: String,
      description: String
    },
    D: {
      url: String,
      publicId: String,
      description: String
    }
  },
  correctAnswer: {
    type: String,
    required: true,
    enum: ['A', 'B', 'C', 'D']
  },
  explanation: {
    type: String,
    default: '',
    trim: true
  },
  explanationImage: {
    url: String,
    publicId: String,
    description: String
  },
  subject: {
    type: String,
    default: '',
    trim: true,
    index: true
  },
  topic: {
    type: String,
    default: '',
    trim: true,
    index: true
  },
  exam: {
    type: String,
    default: '',
    trim: true,
    index: true
  },
  year: {
    type: Number,
    default: null,
    min: 1990,
    max: 2030
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
    index: true
  },
  marks: {
    type: Number,
    default: 1,
    min: 0.25,
    max: 10,
    validate: {
      validator: function(v) {
        // Allow common mark values: 0.25, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, etc.
        return v === Math.round(v * 4) / 4; // Allows increments of 0.25
      },
      message: 'Marks must be in increments of 0.25 (e.g., 1, 1.5, 2, 2.5)'
    }
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
mcqSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.updatedAt = Date.now();
  }
  next();
});

// Indexes for better query performance
mcqSchema.index({ subject: 1 });
mcqSchema.index({ topic: 1 });
mcqSchema.index({ exam: 1 });
mcqSchema.index({ year: 1 });
mcqSchema.index({ difficulty: 1 });
mcqSchema.index({ marks: 1 });
mcqSchema.index({ createdAt: -1 });
mcqSchema.index({ subject: 1, topic: 1 });
mcqSchema.index({ exam: 1, year: 1 });
mcqSchema.index({ difficulty: 1, marks: 1 });

// Text search index
mcqSchema.index({ 
  question: 'text', 
  'options.A': 'text', 
  'options.B': 'text', 
  'options.C': 'text', 
  'options.D': 'text',
  explanation: 'text',
  subject: 'text',
  topic: 'text'
});

// Virtual for formatted question count per subject
mcqSchema.statics.getStatsBySubject = async function() {
  return await this.aggregate([
    {
      $group: {
        _id: '$subject',
        count: { $sum: 1 },
        avgYear: { $avg: '$year' },
        totalMarks: { $sum: '$marks' },
        avgMarks: { $avg: '$marks' },
        topics: { $addToSet: '$topic' }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

// Static method to get marks distribution
mcqSchema.statics.getMarkDistribution = async function() {
  return await this.aggregate([
    {
      $group: {
        _id: '$marks',
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

// Static method to get difficulty distribution
mcqSchema.statics.getDifficultyDistribution = async function() {
  return await this.aggregate([
    {
      $group: {
        _id: '$difficulty',
        count: { $sum: 1 },
        avgMarks: { $avg: '$marks' }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

module.exports = mongoose.model('MCQ', mcqSchema);