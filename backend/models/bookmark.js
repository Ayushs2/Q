// const mongoose = require('mongoose');

// const bookmarkSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   mcqId: { type: mongoose.Schema.Types.ObjectId, ref: 'MCQ', required: true }
// });

// module.exports = mongoose.model('Bookmark', bookmarkSchema);

const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  mcqId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MCQ',
    required: true,
    index: true
  },
  note: {
    type: String,
    trim: true,
    maxlength: 500
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure a user can't bookmark the same question twice
bookmarkSchema.index({ userId: 1, mcqId: 1 }, { unique: true });

// Index for sorting and filtering
bookmarkSchema.index({ userId: 1, createdAt: -1 });
bookmarkSchema.index({ userId: 1, lastAccessed: -1 });

// Update lastAccessed when bookmark is retrieved
bookmarkSchema.methods.updateLastAccessed = function() {
  this.lastAccessed = new Date();
  return this.save();
};

// Static method to get user's bookmarks with populated MCQ data
bookmarkSchema.statics.getUserBookmarks = async function(userId, options = {}) {
  const {
    page = 1,
    limit = 20,
    sortBy = 'createdAt',
    sortOrder = -1,
    subject,
    topic
  } = options;

  const skip = (page - 1) * limit;
  
  let matchFilter = { userId: mongoose.Types.ObjectId(userId) };
  
  const pipeline = [
    { $match: matchFilter },
    {
      $lookup: {
        from: 'mcqs',
        localField: 'mcqId',
        foreignField: '_id',
        as: 'mcq'
      }
    },
    { $unwind: '$mcq' }
  ];

  // Add subject/topic filtering if provided
  if (subject || topic) {
    const mcqFilter = {};
    if (subject) mcqFilter['mcq.subject'] = subject;
    if (topic) mcqFilter['mcq.topic'] = topic;
    pipeline.push({ $match: mcqFilter });
  }

  // Add sorting
  pipeline.push({ $sort: { [sortBy]: sortOrder } });
  
  // Add pagination
  pipeline.push({ $skip: skip }, { $limit: limit });

  // Project the fields we want
  pipeline.push({
    $project: {
      _id: 1,
      userId: 1,
      mcqId: 1,
      note: 1,
      tags: 1,
      createdAt: 1,
      lastAccessed: 1,
      mcq: 1
    }
  });

  return await this.aggregate(pipeline);
};

// Static method to get bookmark count for a user
bookmarkSchema.statics.getUserBookmarkCount = async function(userId, subject = null, topic = null) {
  const pipeline = [
    { $match: { userId: mongoose.Types.ObjectId(userId) } }
  ];

  if (subject || topic) {
    pipeline.push(
      {
        $lookup: {
          from: 'mcqs',
          localField: 'mcqId',
          foreignField: '_id',
          as: 'mcq'
        }
      },
      { $unwind: '$mcq' }
    );

    const mcqFilter = {};
    if (subject) mcqFilter['mcq.subject'] = subject;
    if (topic) mcqFilter['mcq.topic'] = topic;
    pipeline.push({ $match: mcqFilter });
  }

  pipeline.push({ $count: 'total' });

  const result = await this.aggregate(pipeline);
  return result[0]?.total || 0;
};

// Static method to check if a question is bookmarked by user
bookmarkSchema.statics.isBookmarked = async function(userId, mcqId) {
  const bookmark = await this.findOne({ userId, mcqId });
  return !!bookmark;
};

// Static method to get bookmark statistics for a user
bookmarkSchema.statics.getUserBookmarkStats = async function(userId) {
  return await this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $lookup: {
        from: 'mcqs',
        localField: 'mcqId',
        foreignField: '_id',
        as: 'mcq'
      }
    },
    { $unwind: '$mcq' },
    {
      $group: {
        _id: null,
        totalBookmarks: { $sum: 1 },
        subjectCounts: {
          $push: {
            subject: '$mcq.subject',
            topic: '$mcq.topic'
          }
        },
        oldestBookmark: { $min: '$createdAt' },
        newestBookmark: { $max: '$createdAt' }
      }
    },
    {
      $project: {
        totalBookmarks: 1,
        subjectCounts: 1,
        oldestBookmark: 1,
        newestBookmark: 1,
        subjectBreakdown: {
          $reduce: {
            input: '$subjectCounts',
            initialValue: {},
            in: {
              $mergeObjects: [
                '$$value',
                {
                  $arrayToObject: [
                    [{
                      k: '$$this.subject',
                      v: {
                        $add: [
                          { $ifNull: [{ $getField: { field: '$$this.subject', input: '$$value' } }, 0] },
                          1
                        ]
                      }
                    }]
                  ]
                }
              ]
            }
          }
        }
      }
    }
  ]);
};

// Pre-remove hook to clean up any references
bookmarkSchema.pre('deleteOne', { document: true, query: false }, function(next) {
  // You could add cleanup logic here if needed
  next();
});

module.exports = mongoose.model('Bookmark', bookmarkSchema);