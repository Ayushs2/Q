// const express = require('express');
// const multer = require('multer');
// const xlsx = require('xlsx');
// const bcrypt = require('bcryptjs'); // bcryptjs
// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');
// const mongoose = require('mongoose');
// const cors = require('cors');

// dotenv.config();

// /* ---------- DB ---------- */
// const connectDB = async () => {
//   try {
//     if (!process.env.MONGO_URI) {
//       console.error('❌ MONGO_URI missing in .env');
//       process.exit(1);
//     }
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log('✅ MongoDB connected');
//   } catch (err) {
//     console.error('❌ Mongo connection error:', err.message);
//     process.exit(1);
//   }
// };
// connectDB();

// /* ---------- Models ---------- */
// const MCQ = require('./models/mcq');
// const User = require('./models/user');
// const UserProgress = require('./models/userProgress');
// const Bookmark = require('./models/bookmark');

// /* ---------- App ---------- */
// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(express.json());
// app.use(cors());

// /* ---------- Upload (memory) ---------- */
// const upload = multer({ storage: multer.memoryStorage() });

// /* ---------- Auth middlewares ---------- */
// const authMiddleware = (req, res, next) => {
//   const token = req.header('x-auth-token');
//   if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded.user; // { id, isAdmin }
//     next();
//   } catch {
//     return res.status(401).json({ msg: 'Token is not valid' });
//   }
// };

// const isAdmin = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.user.id).lean();
//     if (!user || !user.isAdmin) {
//       return res.status(403).json({ msg: 'Forbidden: Not an admin' });
//     }
//     next();
//   } catch {
//     res.status(500).send('Server Error');
//   }
// };

// /* ---------- Auth routes ---------- */
// app.post('/api/auth/register', async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     let user = await User.findOne({ username });
//     if (user) return res.status(400).json({ msg: 'User already exists' });

//     // If your User model has a pre-save hook to hash, this is enough:
//     user = new User({ username, password });
//     await user.save();

//     const payload = { user: { id: user.id, isAdmin: user.isAdmin } };
//     const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
//     return res.json({ token, userId: user.id, isAdmin: user.isAdmin });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).send('Server error');
//   }
// });

// app.post('/api/auth/login', async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const user = await User.findOne({ username });
//     if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

//     // Debug logging
//     console.log('User found:', {
//       id: user._id,
//       username: user.username,
//       isAdmin: user.isAdmin
//     });

//     const payload = { 
//       user: { 
//         id: user.id, 
//         isAdmin: user.isAdmin || false  // Ensure boolean value
//       } 
//     };
    
//     const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    
//     // Debug the token payload
//     console.log('Token payload:', payload);
    
//     return res.json({ 
//       token, 
//       userId: user.id, 
//       isAdmin: user.isAdmin || false,  // Explicit boolean
//       username: user.username
//     });
//   } catch (err) {
//     console.error('Login error:', err);
//     return res.status(500).send('Server error');
//   }
// });

// // ADD THIS NEW ROUTE HERE - Admin Registration Route
// app.post('/api/auth/register-admin', async (req, res) => {
//   const { username, password, adminSecret } = req.body;
  
//   // Use a secret key to create admin users
//   if (adminSecret !== process.env.ADMIN_SECRET) {
//     return res.status(403).json({ msg: 'Invalid admin secret' });
//   }
  
//   try {
//     let user = await User.findOne({ username });
//     if (user) return res.status(400).json({ msg: 'User already exists' });

//     user = new User({ 
//       username, 
//       password,
//       isAdmin: true  // Set as admin
//     });
//     await user.save();

//     const payload = { user: { id: user.id, isAdmin: user.isAdmin } };
//     const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
//     return res.json({ 
//       token, 
//       userId: user.id, 
//       isAdmin: user.isAdmin,
//       message: 'Admin user created successfully' 
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).send('Server error');
//   }
// });

// // ALSO ADD THESE DEBUG ROUTES (temporary - remove in production)
// app.get('/api/debug/users', async (req, res) => {
//   try {
//     const users = await User.find({}).select('username isAdmin').lean();
//     return res.json(users);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).send('Server error');
//   }
// });

// app.patch('/api/debug/make-admin/:username', async (req, res) => {
//   try {
//     const { username } = req.params;
//     const user = await User.findOneAndUpdate(
//       { username }, 
//       { isAdmin: true }, 
//       { new: true }
//     );
    
//     if (!user) {
//       return res.status(404).json({ msg: 'User not found' });
//     }
    
//     return res.json({ 
//       msg: 'User updated to admin', 
//       username: user.username, 
//       isAdmin: user.isAdmin 
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).send('Server error');
//   }
// });

// /* ---------- MCQs ---------- */
// // List MCQs (optional filters: ?subject=...&topic=...)
// app.get('/api/mcqs', async (req, res) => {
//   try {
//     const { subject, topic } = req.query;
//     const filter = {};
//     if (subject) filter.subject = subject;
//     if (topic) filter.topic = topic;
//     const mcqs = await MCQ.find(filter).lean();
//     return res.json(mcqs);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).send('Server Error');
//   }
// });

// // Admin upload MCQs (Excel .xlsx)
// app.post('/api/upload-mcqs', authMiddleware, isAdmin, upload.single('mcqFile'), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).send('No file was uploaded.');

//     if (req.file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
//       return res.status(400).send('Unsupported file type. Use .xlsx');
//     }

//     const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];
//     const rows = xlsx.utils.sheet_to_json(sheet);

//     const questions = rows.map((row, idx) => {
//       const q = (row.Question || '').toString().trim();
//       const A = (row['Option A'] || '').toString().trim();
//       const B = (row['Option B'] || '').toString().trim();
//       const C = (row['Option C'] || '').toString().trim();
//       const D = (row['Option D'] || '').toString().trim();
//       const ans = (row['Correct Answer'] || '').toString().trim().toUpperCase();
//       const subject = (row.Subject || '').toString().trim();
//       const topic = (row.Topic || '').toString().trim();
//       const explanation = (row.Explanation || '').toString().trim();
//       const exam = (row.Exam || '').toString().trim();


//       if (!q || !A || !B || !C || !D || !['A','B','C','D'].includes(ans)) {
//         console.warn(`Skipping row ${idx + 2} due to missing/invalid fields`);
//         return null;
//       }

//       return {
//         question: q,
//         options: { A, B, C, D },
//         correctAnswer: ans,
//         explanation,
//         subject,
//         topic,
//         exam
        
//       };
//     }).filter(Boolean);

//     if (!questions.length) return res.status(400).send('No valid questions found in the file.');

//     await MCQ.insertMany(questions);
//     return res.status(200).send({ message: `${questions.length} questions uploaded successfully!` });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send('Server Error during file processing.');
//   }
// });

// /* ---------- Test Series ---------- */
// app.get('/api/test-series', async (req, res) => {
//   try {
//     const testSize = 20;
//     const docs = await MCQ.aggregate([{ $sample: { size: testSize } }]);
//     // sanitize: strip correctAnswer & explanation
//     const sanitized = docs.map(d => {
//       const o = { ...d };
//       delete o.correctAnswer;
//       delete o.explanation;
//       return o;
//     });
//     return res.json(sanitized);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).send('Server Error');
//   }
// });

// app.post('/api/grade-test', authMiddleware, async (req, res) => {
//   try {
//     const { submittedAnswers = {} } = req.body; // { [questionId]: 'A'|'B'|'C'|'D' }
//     const userId = req.user.id;

//     const questionIds = Object.keys(submittedAnswers);
//     if (!questionIds.length) return res.json({ score: 0, results: [] });

//     const questions = await MCQ.find({ _id: { $in: questionIds } }).lean();
//     let score = 0;
//     const results = questions.map(q => {
//       const userAnswer = (submittedAnswers[q._id.toString()] || '').toUpperCase();
//       const correct = userAnswer === q.correctAnswer;
//       if (correct) score += 1;
//       return {
//         id: q._id,
//         userAnswer,
//         correctAnswer: q.correctAnswer,
//         correct
//       };
//     });

//     await new UserProgress({
//       userId,
//       score,
//       totalQuestions: questions.length,
//       date: new Date()
//     }).save();

//     return res.json({ score, results });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).send('Server Error');
//   }
// });

// /* ---------- Dashboard ---------- */
// app.get('/api/user/progress', authMiddleware, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const progress = await UserProgress.find({ userId }).sort({ date: -1 }).lean();
//     return res.json(progress);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).send('Server Error');
//   }
// });

// app.get('/api/leaderboard', async (req, res) => {
//   try {
//     const leaderboard = await UserProgress.aggregate([
//       { $group: { _id: '$userId', totalScore: { $sum: '$score' }, totalTests: { $sum: 1 } } },
//       { $sort: { totalScore: -1 } },
//       { $limit: 10 }
//     ]);
//     return res.json(leaderboard);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).send('Server Error');
//   }
// });

// /* ---------- Bookmarks ---------- */
// app.post('/api/bookmarks', authMiddleware, async (req, res) => {
//   try {
//     const { mcqId } = req.body;
//     const userId = req.user.id;

//     const exists = await Bookmark.findOne({ userId, mcqId });
//     if (exists) return res.status(409).json({ message: 'Question already bookmarked' });

//     await new Bookmark({ userId, mcqId }).save();
//     return res.status(201).json({ message: 'Question bookmarked successfully' });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send('Server error');
//   }
// });

// app.get('/api/bookmarks', authMiddleware, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const bookmarks = await Bookmark.find({ userId })
//       .populate('mcqId') // assumes mcqId is ref: 'MCQ'
//       .lean();
//     return res.json(bookmarks);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send('Server error');
//   }
// });

// /* ---------- Start ---------- */
// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// });

const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;


dotenv.config();

// Configure Cloudinary (add these to your .env file)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* ---------- DB ---------- */
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI missing in .env');
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ Mongo connection error:', err.message);
    process.exit(1);
  }
};
connectDB();

/* ---------- Models ---------- */
const MCQ = require('./models/mcq');
const User = require('./models/user');
const UserProgress = require('./models/userProgress');
const Bookmark = require('./models/bookmark');

/* ---------- Cloudinary Helper Functions ---------- */
const uploadImageToCloudinary = async (imageBuffer, folder = 'mcq-images') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'image',
        transformation: [
          { quality: 'auto', fetch_format: 'auto' },
          { width: 800, height: 600, crop: 'limit' }
        ]
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id
          });
        }
      }
    );
    
    uploadStream.end(imageBuffer);
  });
};

const deleteImageFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
    throw error;
  }
};

/* ---------- LaTeX Validation Helpers ---------- */
function validateAndCleanLatex(text) {
  if (!text || typeof text !== 'string') return { cleanText: '', errors: [] };
  
  let cleanText = text.toString().trim();
  const errors = [];
  
  // Clean common Excel artifacts
  cleanText = cleanText
    .replace(/^'/, '') // Remove leading quote Excel adds for text format
    .replace(/"/g, '"') // Fix smart quotes
    .replace(/"/g, '"')
    .replace(/'/g, "'") // Fix smart apostrophes
    .replace(/'/g, "'");
  
  // Validate LaTeX syntax
  const dollarCount = (cleanText.match(/\$/g) || []).length;
  if (dollarCount > 0 && dollarCount % 2 !== 0) {
    errors.push('Unmatched $ signs in LaTeX');
  }
  
  // Check for unmatched braces (excluding escaped braces)
  const openBraces = (cleanText.match(/(?<!\\)\{/g) || []).length;
  const closeBraces = (cleanText.match(/(?<!\\)\}/g) || []).length;
  if (openBraces !== closeBraces) {
    errors.push('Mismatched braces {} in LaTeX');
  }
  
  // Check for common LaTeX command errors
  const incompleteCommands = [
    /\\frac\{[^}]*$/,  // Incomplete fraction
    /\\sqrt\{[^}]*$/,  // Incomplete square root
    /\\int[^$]*$/      // Incomplete integral without closing
  ];
  
  incompleteCommands.forEach(pattern => {
    if (pattern.test(cleanText)) {
      errors.push('Incomplete LaTeX command detected');
    }
  });
  
  // Check for common mistakes
  if (cleanText.includes('\\') && !cleanText.includes('$')) {
    errors.push('LaTeX commands found but not wrapped in $ signs');
  }
  
  return { cleanText, errors };
}

function validateMCQRowWithImages(row, rowIndex) {
  const { cleanedRow, errors, warnings } = validateMCQRow(row, rowIndex);
  
  // Add image URL validation if provided
  const imageFields = [
    'questionImageUrl',
    'optionAImageUrl', 'optionBImageUrl', 'optionCImageUrl', 'optionDImageUrl',
    'explanationImageUrl'
  ];
  
  imageFields.forEach(field => {
    const imageUrl = row[field];
    if (imageUrl && typeof imageUrl === 'string') {
      // Basic URL validation
      const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i;
      if (!urlPattern.test(imageUrl.trim())) {
        warnings.push(`Row ${rowIndex + 2}: Invalid image URL format for ${field}`);
      }
    }
  });
  
  // Add image data to cleaned row if URLs are provided
  if (row.questionImageUrl) {
    cleanedRow.questionImage = {
      url: row.questionImageUrl.trim(),
      description: row.questionImageDescription || ''
    };
  }
  
  // Handle option images
  ['A', 'B', 'C', 'D'].forEach(option => {
    const urlField = `option${option}ImageUrl`;
    const descField = `option${option}ImageDescription`;
    
    if (row[urlField]) {
      if (!cleanedRow.optionImages) cleanedRow.optionImages = {};
      cleanedRow.optionImages[option] = {
        url: row[urlField].trim(),
        description: row[descField] || ''
      };
    }
  });
  
  if (row.explanationImageUrl) {
    cleanedRow.explanationImage = {
      url: row.explanationImageUrl.trim(),
      description: row.explanationImageDescription || ''
    };
  }

   // NEW: Ensure difficulty and marks are preserved in the cleaned row
  // (They should already be added by validateMCQRow, but let's be explicit)
  if (!cleanedRow.difficulty) {
    cleanedRow.difficulty = 'medium';
  }
  if (!cleanedRow.marks) {
    cleanedRow.marks = 1;
  }
  
  return { cleanedRow, errors, warnings };
}


function validateMCQRow(row, rowIndex) {
  const errors = [];
  const warnings = [];
  const rowNum = rowIndex + 2; // Excel row number (accounting for header)
  
  // Extract and clean data with multiple possible column names
  const question = (row.Question || row.question || '').toString().trim();
  const optionA = (row['Option A'] || row.A || row.optionA || '').toString().trim();
  const optionB = (row['Option B'] || row.B || row.optionB || '').toString().trim();
  const optionC = (row['Option C'] || row.C || row.optionC || '').toString().trim();
  const optionD = (row['Option D'] || row.D || row.optionD || '').toString().trim();
  const correctAnswer = (row['Correct Answer'] || row.Answer || row.answer || '').toString().trim().toUpperCase();
  const explanation = (row.Explanation || row.explanation || '').toString().trim();
  const subject = (row.Subject || row.subject || '').toString().trim();
  const topic = (row.Topic || row.topic || '').toString().trim();
  const exam = (row.Exam || row.exam || '').toString().trim();
  const year = row.Year || row.year;
  
  // NEW: Extract difficulty and marks
  const difficulty = (row.Difficulty || row.difficulty || 'medium').toString().trim().toLowerCase();
  const marks = row.Marks || row.marks;
  
  // Required field validation
  if (!question) errors.push(`Row ${rowNum}: Missing question text`);
  if (!optionA) errors.push(`Row ${rowNum}: Missing Option A`);
  if (!optionB) errors.push(`Row ${rowNum}: Missing Option B`);
  if (!optionC) errors.push(`Row ${rowNum}: Missing Option C`);
  if (!optionD) errors.push(`Row ${rowNum}: Missing Option D`);
  if (!['A', 'B', 'C', 'D'].includes(correctAnswer)) {
    errors.push(`Row ${rowNum}: Invalid correct answer "${correctAnswer}". Must be A, B, C, or D`);
  }
  if (!subject) warnings.push(`Row ${rowNum}: Missing subject`);
  if (!topic) warnings.push(`Row ${rowNum}: Missing topic`);
  if (!exam) warnings.push(`Row ${rowNum}: Missing exam name`);
  
  // NEW: Validate difficulty
  if (difficulty && !['easy', 'medium', 'hard'].includes(difficulty)) {
    errors.push(`Row ${rowNum}: Invalid difficulty "${difficulty}". Must be easy, medium, or hard`);
  }
  
  // NEW: Validate marks
  let parsedMarks = 1; // default
  if (marks !== undefined && marks !== null && marks !== '') {
    parsedMarks = parseFloat(marks);
    if (isNaN(parsedMarks) || parsedMarks < 0.25 || parsedMarks > 10 || parsedMarks !== Math.round(parsedMarks * 4) / 4) {
      errors.push(`Row ${rowNum}: Invalid marks "${marks}". Must be between 0.25 and 10 in increments of 0.25`);
    }
  }

  // LaTeX validation for each field
  const fieldsToValidate = {
    'Question': question,
    'Option A': optionA,
    'Option B': optionB,
    'Option C': optionC,
    'Option D': optionD,
    'Explanation': explanation
  };
  
  Object.entries(fieldsToValidate).forEach(([fieldName, fieldValue]) => {
    if (fieldValue) {
      const { cleanText, errors: latexErrors } = validateAndCleanLatex(fieldValue);
      if (latexErrors.length > 0) {
        errors.push(`Row ${rowNum} ${fieldName}: ${latexErrors.join(', ')}`);
      }
    }
  });
  
  // Year validation and parsing
  let parsedYear = null;
  if (year !== undefined && year !== null && year !== '') {
    if (!isNaN(year)) {
      parsedYear = parseInt(year, 10);
      if (parsedYear < 1990 || parsedYear > 2030) {
        warnings.push(`Row ${rowNum}: Year ${parsedYear} seems unusual (expected 1990-2030)`);
      }
    } else {
      warnings.push(`Row ${rowNum}: Invalid year format "${year}"`);
    }
  }
  
  // If no explicit year column, try to extract from exam field
  if (!parsedYear && exam) {
    const examParts = exam.split(' ').filter(Boolean);
    if (examParts.length > 1) {
      const lastPart = examParts[examParts.length - 1];
      if (!isNaN(lastPart)) {
        parsedYear = parseInt(lastPart, 10);
        // Remove year from exam name
        examParts.pop();
        const cleanExam = examParts.join(' ');
        warnings.push(`Row ${rowNum}: Extracted year ${parsedYear} from exam field. Consider using separate Year column.`);
        
        // Return with cleaned exam name
        const cleanedRow = {
          question: validateAndCleanLatex(question).cleanText,
          options: {
            A: validateAndCleanLatex(optionA).cleanText,
            B: validateAndCleanLatex(optionB).cleanText,
            C: validateAndCleanLatex(optionC).cleanText,
            D: validateAndCleanLatex(optionD).cleanText
          },
          correctAnswer,
          explanation: validateAndCleanLatex(explanation).cleanText,
          subject,
          topic,
          exam: cleanExam,
          year: parsedYear,
          difficulty: difficulty || 'medium',  // NEW: Add difficulty
          marks: parsedMarks                   // NEW: Add marks
        };
        
        return { cleanedRow, errors, warnings };
      }
    }
  }
  
  // Return cleaned data
  const cleanedRow = {
    question: validateAndCleanLatex(question).cleanText,
    options: {
      A: validateAndCleanLatex(optionA).cleanText,
      B: validateAndCleanLatex(optionB).cleanText,
      C: validateAndCleanLatex(optionC).cleanText,
      D: validateAndCleanLatex(optionD).cleanText
    },
    correctAnswer,
    explanation: validateAndCleanLatex(explanation).cleanText,
    subject,
    topic,
    exam,
    year: parsedYear,
    difficulty: difficulty || 'medium',  // NEW: Add difficulty
    marks: parsedMarks                   // NEW: Add marks
  };
  
  return { cleanedRow, errors, warnings };
}



/* ---------- App ---------- */
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '5mb' }));



// Enhanced CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com'] 
    : [
        'http://localhost:3001', 
        'http://127.0.0.1:3000', 
        'http://localhost:5500', 
        'http://127.0.0.1:5500',  // This should handle your current setup
        'http://localhost:3001'
      ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

// Add request logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

/* ---------- Upload (memory) ---------- */
const upload = multer({ storage: multer.memoryStorage() });

/* ---------- Auth middlewares ---------- */
const authMiddleware = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // { id, isAdmin }
    next();
  } catch {
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user || !user.isAdmin) {
      return res.status(403).json({ msg: 'Forbidden: Not an admin' });
    }
    next();
  } catch {
    res.status(500).send('Server Error');
  }
};

/* ---------- FIXED AUTH ROUTES ---------- */

// Fixed registration route
app.post('/api/auth/register', async (req, res) => {
  console.log('Registration attempt:', req.body);
  
  const { username, password, firstName, lastName, email } = req.body;
  
  // Enhanced validation
  if (!username || !password || !firstName || !lastName) {
    return res.status(400).json({ 
      msg: 'Username, password, first name, and last name are required' 
    });
  }

  if (username.length < 3) {
    return res.status(400).json({ msg: 'Username must be at least 3 characters long' });
  }

  if (password.length < 6) {
    return res.status(400).json({ msg: 'Password must be at least 6 characters long' });
  }
  
  try {
    // Check if user already exists
    let user = await User.findOne({ username: username.toLowerCase().trim() });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Check if email exists (if provided)
    if (email && email.trim()) {
      const emailExists = await User.findOne({ email: email.toLowerCase().trim() });
      if (emailExists) {
        return res.status(400).json({ msg: 'Email already registered' });
      }
    }

    // Create new user
    user = new User({ 
      username: username.toLowerCase().trim(), 
      password, 
      firstName: firstName.trim(), 
      lastName: lastName.trim(), 
      email: email ? email.toLowerCase().trim() : undefined 
    });
    
    await user.save();
    console.log('User created successfully:', user.username);

    // Create JWT payload
    const payload = { user: { id: user.id, isAdmin: user.isAdmin } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    // Send response with user details
    return res.status(201).json({ 
      token, 
      userId: user.id, 
      isAdmin: user.isAdmin,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      username: user.username,
      email: user.email
    });
  } catch (err) {
    console.error('Registration error:', err);
    
    // Handle specific MongoDB errors
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({ msg: `${field} already exists` });
    }
    
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ msg: messages.join(', ') });
    }
    
    return res.status(500).json({ msg: 'Server error during registration' });
  }
});

// Fixed login route  
app.post('/api/auth/login', async (req, res) => {
  console.log('Login attempt:', { username: req.body.username });
  
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ msg: 'Username and password are required' });
  }
  
  try {
    const user = await User.findOne({ 
      username: username.toLowerCase().trim(),
      isActive: true 
    });
    
    if (!user) {
      console.log('User not found:', username);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for user:', username);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    user.loginCount += 1;
    await user.save();

    console.log('User logged in successfully:', user.username);

    const payload = {
      user: {
        id: user.id,
        isAdmin: user.isAdmin || false
      }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      token,
      userId: user.id,
      isAdmin: user.isAdmin || false,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.email
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ msg: 'Server error during login' });
  }
});

// Fixed admin registration route
app.post('/api/auth/register-admin', async (req, res) => {
  console.log('Admin registration attempt:', { username: req.body.username });
  
  const { username, password, firstName, lastName, adminSecret } = req.body;

  if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ msg: 'Invalid admin secret' });
  }

  if (!username || !password || !firstName || !lastName) {
    return res.status(400).json({ msg: 'All fields are required for admin registration' });
  }

  try {
    let user = await User.findOne({ username: username.toLowerCase().trim() });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      username: username.toLowerCase().trim(),
      password,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      isAdmin: true
    });
    
    await user.save();
    console.log('Admin user created successfully:', user.username);

    const payload = { user: { id: user.id, isAdmin: user.isAdmin } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    return res.status(201).json({
      token,
      userId: user.id,
      isAdmin: user.isAdmin,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      username: user.username,
      message: 'Admin user created successfully'
    });
  } catch (err) {
    console.error('Admin registration error:', err);
    
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'Username already exists' });
    }
    
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ msg: messages.join(', ') });
    }
    
    return res.status(500).json({ msg: 'Server error during admin registration' });
  }
});

/* ---------- Debug routes (remove in prod) ---------- */
app.get('/api/debug/users', async (req, res) => {
  try {
    const users = await User.find({}).select('username isAdmin').lean();
    return res.json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  }
});

app.patch('/api/debug/make-admin/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOneAndUpdate(
      { username },
      { isAdmin: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    return res.json({
      msg: 'User updated to admin',
      username: user.username,
      isAdmin: user.isAdmin
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  }
});

/* ---------- Image Upload Routes ---------- */

// Upload single image for question/explanation/option
app.post('/api/upload-image', authMiddleware, isAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        message: 'No image file uploaded',
        success: false 
      });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        message: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.',
        success: false
      });
    }

    // Check file size (5MB limit)
    if (req.file.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        message: 'File size too large. Maximum 5MB allowed.',
        success: false
      });
    }

    const { folder = 'mcq-images', description = '' } = req.body;

    // Upload to Cloudinary
    const uploadResult = await uploadImageToCloudinary(req.file.buffer, folder);

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: uploadResult.url,
        publicId: uploadResult.publicId,
        description: description
      }
    });

  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      message: 'Failed to upload image',
      success: false,
      error: error.message
    });
  }
});

// Delete image from Cloudinary
app.delete('/api/delete-image', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { publicId } = req.query;
    
    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required as query parameter'
      });
    }
    
    const decodedPublicId = decodeURIComponent(publicId);
    const result = await deleteImageFromCloudinary(decodedPublicId);
    
    if (result.result === 'ok') {
      res.json({
        success: true,
        message: 'Image deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Image not found or already deleted'
      });
    }
  } catch (error) {
    console.error('Image deletion error:', error);
    res.status(500).json({
      message: 'Failed to delete image',
      success: false,
      error: error.message
    });
  }
});

/* ---------- Enhanced MCQ Routes with Image Support ---------- */

// Create MCQ with image support
// Create MCQ with image support
app.post('/api/mcqs', authMiddleware, isAdmin, async (req, res) => {
  try {
    const {
      question,
      questionImage,
      options,
      optionImages,
      correctAnswer,
      explanation,
      explanationImage,
      subject,
      topic,
      exam,
      year,
      difficulty,  // NEW: Accept difficulty
      marks       // NEW: Accept marks
    } = req.body;

    // Validate required fields
    if (!question || !options || !correctAnswer) {
      return res.status(400).json({
        message: 'Question, options, and correct answer are required',
        success: false
      });
    }

    if (!options.A || !options.B || !options.C || !options.D) {
      return res.status(400).json({
        message: 'All four options (A, B, C, D) are required',
        success: false
      });
    }

    if (!['A', 'B', 'C', 'D'].includes(correctAnswer)) {
      return res.status(400).json({
        message: 'Correct answer must be A, B, C, or D',
        success: false
      });
    }

    // NEW: Validate difficulty
    const validDifficulties = ['easy', 'medium', 'hard'];
    const mcqDifficulty = difficulty || 'medium';
    if (!validDifficulties.includes(mcqDifficulty)) {
      return res.status(400).json({
        message: 'Difficulty must be easy, medium, or hard',
        success: false
      });
    }

    // NEW: Validate marks
    const mcqMarks = marks || 1;
    if (typeof mcqMarks !== 'number' || mcqMarks < 0.25 || mcqMarks > 10 || mcqMarks !== Math.round(mcqMarks * 4) / 4) {
      return res.status(400).json({
        message: 'Marks must be between 0.25 and 10, in increments of 0.25',
        success: false
      });
    }

    // Create new MCQ
    const newMCQ = new MCQ({
      question,
      questionImage: questionImage || {},
      options,
      optionImages: optionImages || {},
      correctAnswer,
      explanation: explanation || '',
      explanationImage: explanationImage || {},
      subject: subject || '',
      topic: topic || '',
      exam: exam || '',
      year: year || null,
      difficulty: mcqDifficulty,  // NEW: Add difficulty
      marks: mcqMarks            // NEW: Add marks
    });

    await newMCQ.save();

    res.status(201).json({
      success: true,
      message: 'MCQ created successfully',
      data: newMCQ
    });

  } catch (error) {
    console.error('MCQ creation error:', error);
    res.status(500).json({
      message: 'Failed to create MCQ',
      success: false,
      error: error.message
    });
  }
});

// Update MCQ with image support
app.put('/api/mcqs/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const existingMCQ = await MCQ.findById(id);
    if (!existingMCQ) {
      return res.status(404).json({
        message: 'MCQ not found',
        success: false
      });
    }

    // Handle image deletions if images are being replaced
    const imagesToDelete = [];

    // Check for question image replacement
    if (updateData.questionImage && updateData.questionImage.publicId !== existingMCQ.questionImage?.publicId) {
      if (existingMCQ.questionImage?.publicId) {
        imagesToDelete.push(existingMCQ.questionImage.publicId);
      }
    }

    // Check for option image replacements
    if (updateData.optionImages) {
      ['A', 'B', 'C', 'D'].forEach(option => {
        if (updateData.optionImages[option] && 
            updateData.optionImages[option].publicId !== existingMCQ.optionImages?.[option]?.publicId) {
          if (existingMCQ.optionImages?.[option]?.publicId) {
            imagesToDelete.push(existingMCQ.optionImages[option].publicId);
          }
        }
      });
    }

    // Check for explanation image replacement
    if (updateData.explanationImage && updateData.explanationImage.publicId !== existingMCQ.explanationImage?.publicId) {
      if (existingMCQ.explanationImage?.publicId) {
        imagesToDelete.push(existingMCQ.explanationImage.publicId);
      }
    }

    // Delete old images from Cloudinary
    for (const publicId of imagesToDelete) {
      try {
        await deleteImageFromCloudinary(publicId);
      } catch (error) {
        console.warn(`Failed to delete image ${publicId}:`, error.message);
      }
    }

    // Update the MCQ
    const updatedMCQ = await MCQ.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'MCQ updated successfully',
      data: updatedMCQ
    });

  } catch (error) {
    console.error('MCQ update error:', error);
    res.status(500).json({
      message: 'Failed to update MCQ',
      success: false,
      error: error.message
    });
  }
});

// Get individual MCQ for editing
app.get('/api/mcqs/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const mcq = await MCQ.findById(id);
    
    if (!mcq) {
      return res.status(404).json({
        message: 'MCQ not found',
        success: false
      });
    }

    res.json(mcq);
  } catch (error) {
    console.error('MCQ fetch error:', error);
    res.status(500).json({
      message: 'Failed to fetch MCQ',
      success: false,
      error: error.message
    });
  }
});

// Delete MCQ with image cleanup
app.delete('/api/mcqs/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const mcq = await MCQ.findById(id);
    if (!mcq) {
      return res.status(404).json({
        message: 'MCQ not found',
        success: false
      });
    }

    // Collect all image public IDs for deletion
    const imagesToDelete = [];

    if (mcq.questionImage?.publicId) {
      imagesToDelete.push(mcq.questionImage.publicId);
    }

    if (mcq.optionImages) {
      ['A', 'B', 'C', 'D'].forEach(option => {
        if (mcq.optionImages[option]?.publicId) {
          imagesToDelete.push(mcq.optionImages[option].publicId);
        }
      });
    }

    if (mcq.explanationImage?.publicId) {
      imagesToDelete.push(mcq.explanationImage.publicId);
    }

    // Delete images from Cloudinary
    for (const publicId of imagesToDelete) {
      try {
        await deleteImageFromCloudinary(publicId);
      } catch (error) {
        console.warn(`Failed to delete image ${publicId}:`, error.message);
      }
    }

    // Delete MCQ from database
    await MCQ.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'MCQ and associated images deleted successfully'
    });

  } catch (error) {
    console.error('MCQ deletion error:', error);
    res.status(500).json({
      message: 'Failed to delete MCQ',
      success: false,
      error: error.message
    });
  }
});

/* ---------- MCQs ---------- */
/**
 * GET /api/mcqs
 * Query params:
 *  - subject, topic, exam
 *  - yearMin, yearMax (numbers)
 *  - search (matches question/options/subject/topic/exam)
 *  - sort: e.g. "year:desc" or "year:asc"
 */

// Get topics for a specific subject
app.get('/api/mcqs/topics', async (req, res) => {
  try {
    const { subject } = req.query;
    
    if (!subject) {
      return res.status(400).json({ message: 'Subject parameter is required' });
    }
    
    const topics = await MCQ.distinct('topic', { 
      subject: subject,
      topic: { $ne: '', $exists: true }
    });
    
    return res.json(topics.filter(Boolean)); // Remove empty topics
  } catch (err) {
    console.error('Error fetching topics:', err);
    return res.status(500).json({ message: 'Server Error' });
  }
});

app.get('/api/mcqs', async (req, res) => {
  try {
    const { 
      subject, 
      topic, 
      exam, 
      subjects, 
      topics, 
      yearMin, 
      yearMax, 
      search, 
      sort, 
      limit, 
      difficulty 
    } = req.query;
    
    const filter = {};

    // Handle single or multiple subjects
    if (subject) {
      filter.subject = subject;
    } else if (subjects) {
      const subjectList = subjects.split(',').map(s => s.trim()).filter(Boolean);
      if (subjectList.length > 0) {
        filter.subject = { $in: subjectList };
      }
    }

    // Handle single or multiple topics
    if (topic) {
      filter.topic = topic;
    } else if (topics) {
      const topicList = topics.split(',').map(t => t.trim()).filter(Boolean);
      if (topicList.length > 0) {
        filter.topic = { $in: topicList };
      }
    }

    if (exam) filter.exam = exam;
    if (difficulty && difficulty !== 'mixed') filter.difficulty = difficulty;

    // Year range
    if (yearMin || yearMax) {
      filter.year = {};
      if (yearMin) filter.year.$gte = parseInt(yearMin, 10);
      if (yearMax) filter.year.$lte = parseInt(yearMax, 10);
    }

    // Search across fields
    if (search) {
      const regex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [
        { question: regex },
        { 'options.A': regex },
        { 'options.B': regex },
        { 'options.C': regex },
        { 'options.D': regex },
        { subject: regex },
        { topic: regex },
        { exam: regex },
        { explanation: regex }
      ];
    }

    // Sorting
    let sortObj = { _id: -1 }; // default newest
    if (sort) {
      const [field, dir = 'asc'] = sort.split(':');
      const allowed = new Set(['year', 'subject', 'topic', 'exam', 'createdAt', '_id']);
      if (allowed.has(field)) {
        sortObj = { [field]: dir.toLowerCase() === 'desc' ? -1 : 1 };
      }
    }

      // Apply limit
    const queryLimit = limit ? Math.min(parseInt(limit, 10), 1000) : 1000;

    const mcqs = await MCQ.find(filter)
      .sort(sortObj)
      .limit(queryLimit)
      .lean();
      
    return res.json(mcqs);
  } catch (err) {
    console.error('Error fetching MCQs:', err);
    return res.status(500).json({ message: 'Server Error' });
  }
});

//     const mcqs = await MCQ.find(filter).sort(sortObj).lean();
//     return res.json(mcqs);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).send('Server Error');
//   }
// });

/**
 * GET /api/exams-meta
 * Returns:
 *  - exams: distinct exam names
 *  - yearMin, yearMax: bounds of available years
 */
app.get('/api/exams-meta', async (req, res) => {
  try {
    const exams = await MCQ.distinct('exam', { exam: { $ne: '' } });
    const years = await MCQ.find({ year: { $ne: null } }).select('year -_id').lean();

    let yearMin = null;
    let yearMax = null;
    if (years.length) {
      const ys = years.map(y => y.year);
      yearMin = Math.min(...ys);
      yearMax = Math.max(...ys);
    }

    return res.json({ exams, yearMin, yearMax });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
});

// Enhanced Admin upload MCQs with robust LaTeX validation and image support
app.post('/api/upload-mcqs', authMiddleware, isAdmin, upload.single('mcqFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        message: 'No file was uploaded.',
        success: false 
      });
    }

    if (req.file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      return res.status(400).json({ 
        message: 'Unsupported file type. Please upload .xlsx files only.',
        success: false 
      });
    }

    console.log(`📁 Processing Excel file: ${req.file.originalname} (${req.file.size} bytes)`);

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet);

    if (!rows.length) {
      return res.status(400).json({ 
        message: 'Excel file is empty or has no data rows.',
        success: false 
      });
    }

    console.log(`📊 Processing ${rows.length} rows from Excel sheet: ${sheetName}`);

    const validQuestions = [];
    const allErrors = [];
    const allWarnings = [];
    const skippedRows = [];

    // Process each row with enhanced validation (including image support)
    rows.forEach((row, index) => {
      const { cleanedRow, errors, warnings } = validateMCQRowWithImages(row, index);
      
      if (errors.length > 0) {
        allErrors.push(...errors);
        skippedRows.push(index + 2); // Excel row number
      } else {
        validQuestions.push(cleanedRow);
      }
      
      if (warnings.length > 0) {
        allWarnings.push(...warnings);
      }
    });

    // Summary for logging
    console.log(`✅ Valid questions: ${validQuestions.length}`);
    console.log(`⚠️  Warnings: ${allWarnings.length}`);
    console.log(`❌ Errors: ${allErrors.length}`);
    console.log(`🚫 Skipped rows: ${skippedRows.length}`);

    // Return validation results if there are critical errors
    if (allErrors.length > 0) {
      return res.status(400).json({
        message: 'Validation errors found in Excel file. Please fix these issues and try again.',
        success: false,
        errors: allErrors,
        warnings: allWarnings,
        validQuestions: validQuestions.length,
        totalRows: rows.length,
        skippedRows: skippedRows,
        details: {
          processed: rows.length,
          valid: validQuestions.length,
          invalid: skippedRows.length,
          errorCount: allErrors.length,
          warningCount: allWarnings.length
        }
      });
    }

    // If no critical errors, save to database
    if (validQuestions.length > 0) {
      try {
        await MCQ.insertMany(validQuestions);
        console.log(`💾 Successfully saved ${validQuestions.length} questions to database`);
        
        let responseMessage = `Successfully uploaded ${validQuestions.length} questions!`;
        if (allWarnings.length > 0) {
          responseMessage += ` Note: ${allWarnings.length} warnings were found (see details).`;
        }
        
        return res.status(200).json({
          message: responseMessage,
          success: true,
          uploadedQuestions: validQuestions.length,
          warnings: allWarnings,
          details: {
            processed: rows.length,
            uploaded: validQuestions.length,
            warningCount: allWarnings.length,
            filename: req.file.originalname
          }
        });
      } catch (dbError) {
        console.error('Database insertion error:', dbError);
        return res.status(500).json({
          message: 'Questions validated successfully but failed to save to database.',
          success: false,
          error: dbError.message
        });
      }
    } else {
      return res.status(400).json({
        message: 'No valid questions found in the Excel file after validation.',
        success: false,
        errors: allErrors,
        warnings: allWarnings,
        details: {
          processed: rows.length,
          valid: 0,
          invalid: rows.length
        }
      });
    }

  } catch (error) {
    console.error('Excel processing error:', error);
    return res.status(500).json({
      message: 'Server error during file processing.',
      success: false,
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// /* ---------- Test Series ---------- */
// app.get('/api/test-series', async (req, res) => {
//   try {
//     const testSize = 20;
//     const docs = await MCQ.aggregate([{ $sample: { size: testSize } }]);
//     // sanitize: strip correctAnswer & explanation
//     const sanitized = docs.map(d => {
//       const { correctAnswer, explanation, ...rest } = d;
//       return rest;
//     });
//     return res.json(sanitized);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).send('Server Error');
//   }
// });

// app.post('/api/grade-test', authMiddleware, async (req, res) => {
//   try {
//     const { submittedAnswers = {} } = req.body; // { [questionId]: 'A'|'B'|'C'|'D' }
//     const userId = req.user.id;

//     const questionIds = Object.keys(submittedAnswers);
//     if (!questionIds.length) return res.json({ score: 0, results: [] });

//     const questions = await MCQ.find({ _id: { $in: questionIds } }).lean();
//     let score = 0;
//     const results = questions.map(q => {
//       const userAnswer = (submittedAnswers[q._id.toString()] || '').toUpperCase();
//       const correct = userAnswer === q.correctAnswer;
//       if (correct) score += 1;
//       return {
//         id: q._id,
//         userAnswer,
//         correctAnswer: q.correctAnswer,
//         correct
//       };
//     });

//     await new UserProgress({
//       userId,
//       score,
//       totalQuestions: questions.length,
//       date: new Date()
//     }).save();

//     return res.json({ score, results });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).send('Server Error');
//   }
// });


/* ---------- ADMIN TEST MANAGEMENT ENDPOINTS ---------- */

// Upload test via JSON
app.post('/api/admin/upload-test', authMiddleware, isAdmin, async (req, res) => {
  try {
    const testData = req.body;
    
    if (!testData.title || !testData.questions || !Array.isArray(testData.questions)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid test data format. Title and questions array are required.'
      });
    }

    // Validate each question
    const validatedQuestions = [];
    const errors = [];

    testData.questions.forEach((question, index) => {
      const rowNum = index + 1;
      
      if (!question.question || !question.options || !question.correctAnswer) {
        errors.push(`Question ${rowNum}: Missing required fields`);
        return;
      }

      if (!question.options.A || !question.options.B || !question.options.C || !question.options.D) {
        errors.push(`Question ${rowNum}: All four options (A, B, C, D) are required`);
        return;
      }

      if (!['A', 'B', 'C', 'D'].includes(question.correctAnswer)) {
        errors.push(`Question ${rowNum}: Correct answer must be A, B, C, or D`);
        return;
      }

      validatedQuestions.push({
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation || '',
        subject: question.subject || 'General',
        topic: question.topic || 'General',
        exam: question.examType || question.exam || 'General',
        difficulty: question.difficulty || 'medium',
        year: question.year || null
      });
    });

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors found',
        errors: errors
      });
    }

    // Save questions to database
    await MCQ.insertMany(validatedQuestions);

    res.json({
      success: true,
      message: `Test "${testData.title}" uploaded successfully`,
      questionsUploaded: validatedQuestions.length
    });

  } catch (error) {
    console.error('Test upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload test',
      error: error.message
    });
  }
});

// Upload MCQs via CSV/JSON
app.post('/api/admin/upload-mcqs', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { mcqs } = req.body;
    
    if (!mcqs || !Array.isArray(mcqs)) {
      return res.status(400).json({
        success: false,
        message: 'MCQs array is required'
      });
    }

    const validatedMCQs = [];
    const errors = [];

    mcqs.forEach((mcq, index) => {
      const rowNum = index + 1;
      
      // Validate required fields
      if (!mcq.question || !mcq.options || !mcq.correctAnswer) {
        errors.push(`MCQ ${rowNum}: Missing required fields`);
        return;
      }

      if (!mcq.options.A || !mcq.options.B || !mcq.options.C || !mcq.options.D) {
        errors.push(`MCQ ${rowNum}: All four options are required`);
        return;
      }

      if (!['A', 'B', 'C', 'D'].includes(mcq.correctAnswer)) {
        errors.push(`MCQ ${rowNum}: Invalid correct answer`);
        return;
      }

      validatedMCQs.push(mcq);
    });

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors found',
        errors: errors
      });
    }

    await MCQ.insertMany(validatedMCQs);

    res.json({
      success: true,
      message: `${validatedMCQs.length} MCQs uploaded successfully`,
      uploadedCount: validatedMCQs.length
    });

  } catch (error) {
    console.error('MCQs upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload MCQs',
      error: error.message
    });
  }
});

// Get admin tests for management
app.get('/api/admin/tests', authMiddleware, isAdmin, async (req, res) => {
  try {
    // Since you don't have a separate Tests collection yet,
    // return aggregated data about MCQs by subject/exam
    const testGroups = await MCQ.aggregate([
      {
        $group: {
          _id: {
            exam: '$exam',
            subject: '$subject'
          },
          questionCount: { $sum: 1 },
          topics: { $addToSet: '$topic' },
          years: { $addToSet: '$year' }
        }
      },
      {
        $project: {
          _id: { $toString: '$_id' },
          title: {
            $concat: [
              { $ifNull: ['$_id.exam', 'General'] },
              ' - ',
              { $ifNull: ['$_id.subject', 'General'] }
            ]
          },
          exam: '$_id.exam',
          subject: '$_id.subject',
          questionCount: '$questionCount',
          topics: '$topics',
          years: '$years',
          duration: { $multiply: ['$questionCount', 1.5] } // 1.5 min per question
        }
      },
      { $sort: { title: 1 } }
    ]);

    res.json(testGroups);
  } catch (error) {
    console.error('Error fetching admin tests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tests',
      error: error.message
    });
  }
});

// Delete test (delete MCQs by filter)
app.delete('/api/admin/tests', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Test ID is required as query parameter'
      });
    }
    
    const filterData = JSON.parse(id);
    const filter = {};
    
    if (filterData.exam && filterData.exam !== 'General') {
      filter.exam = filterData.exam;
    }
    if (filterData.subject && filterData.subject !== 'General') {
      filter.subject = filterData.subject;
    }

    const result = await MCQ.deleteMany(filter);
    
    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} questions`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting test:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete test',
      error: error.message
    });
  }
});

// Export test data
app.get('/api/admin/tests/export', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Test ID is required as query parameter'
      });
    }
    
    const filterData = JSON.parse(id);
    const filter = {};
    
    if (filterData.exam && filterData.exam !== 'General') {
      filter.exam = filterData.exam;
    }
    if (filterData.subject && filterData.subject !== 'General') {
      filter.subject = filterData.subject;
    }

    const questions = await MCQ.find(filter).lean();
    
    const exportData = {
      title: `${filterData.exam || 'General'} - ${filterData.subject || 'General'}`,
      description: `Exported test data for ${filterData.subject || 'General'}`,
      duration: questions.length * 1.5,
      questions: questions.map(q => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        subject: q.subject,
        topic: q.topic,
        exam: q.exam,
        year: q.year,
        difficulty: q.difficulty
      }))
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="test-${Date.now()}.json"`);
    res.json(exportData);
  } catch (error) {
    console.error('Error exporting test:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export test',
      error: error.message
    });
  }
});
// Export all tests
app.get('/api/admin/export-tests', authMiddleware, isAdmin, async (req, res) => {
  try {
    const allMCQs = await MCQ.find({}).lean();
    
    const exportData = {
      exportDate: new Date().toISOString(),
      totalQuestions: allMCQs.length,
      questions: allMCQs
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="all-tests-${Date.now()}.json"`);
    res.json(exportData);
  } catch (error) {
    console.error('Error exporting all tests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export tests',
      error: error.message
    });
  }
});

// Generate test report
app.get('/api/admin/test-report', authMiddleware, isAdmin, async (req, res) => {
  try {
    const [mcqStats, userStats, progressStats] = await Promise.all([
      // MCQ statistics
      MCQ.aggregate([
        {
          $group: {
            _id: null,
            totalQuestions: { $sum: 1 },
            subjects: { $addToSet: '$subject' },
            exams: { $addToSet: '$exam' },
            topics: { $addToSet: '$topic' }
          }
        }
      ]),
      
      // User statistics
      User.aggregate([
        {
          $group: {
            _id: null,
            totalUsers: { $sum: 1 },
            activeUsers: {
              $sum: {
                $cond: [
                  { $gte: ['$lastLogin', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)] },
                  1,
                  0
                ]
              }
            },
            adminUsers: {
              $sum: {
                $cond: ['$isAdmin', 1, 0]
              }
            }
          }
        }
      ]),
      
      // Test progress statistics
      UserProgress.aggregate([
        {
          $group: {
            _id: null,
            totalTests: { $sum: 1 },
            averageScore: { $avg: '$score' },
            totalQuestions: { $sum: '$totalQuestions' }
          }
        }
      ])
    ]);

    const report = {
      totalTests: mcqStats[0]?.subjects?.length || 0,
      totalQuestions: mcqStats[0]?.totalQuestions || 0,
      totalSubjects: mcqStats[0]?.subjects?.length || 0,
      totalExams: mcqStats[0]?.exams?.length || 0,
      totalTopics: mcqStats[0]?.topics?.length || 0,
      totalUsers: userStats[0]?.totalUsers || 0,
      activeUsers: userStats[0]?.activeUsers || 0,
      adminUsers: userStats[0]?.adminUsers || 0,
      testsCompleted: progressStats[0]?.totalTests || 0,
      averageScore: Math.round(progressStats[0]?.averageScore || 0),
      generatedAt: new Date().toISOString()
    };

    res.json(report);
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate report',
      error: error.message
    });
  }
});




/* ---------- ADDITIONAL HELPER ENDPOINTS ---------- */

// Get unique exam types
app.get('/api/mcqs/exams', async (req, res) => {
  try {
    const exams = await MCQ.distinct('exam', { exam: { $ne: '', $exists: true } });
    return res.json(exams.filter(Boolean));
  } catch (err) {
    console.error('Error fetching exams:', err);
    return res.status(500).json({ message: 'Server Error' });
  }
});

// Get MCQ statistics for dashboard
app.get('/api/mcqs/stats', async (req, res) => {
  try {
    const stats = await MCQ.aggregate([
      {
        $group: {
          _id: null,
          totalQuestions: { $sum: 1 },
          subjectCount: { $addToSet: '$subject' },
          examCount: { $addToSet: '$exam' },
          topicCount: { $addToSet: '$topic' },
          yearRange: { 
            $push: {
              $cond: [
                { $ne: ['$year', null] },
                '$year',
                '$$REMOVE'
              ]
            }
          }
        }
      },
      {
        $project: {
          totalQuestions: 1,
          totalSubjects: { $size: '$subjectCount' },
          totalExams: { $size: '$examCount' },
          totalTopics: { $size: '$topicCount' },
          yearMin: { $min: '$yearRange' },
          yearMax: { $max: '$yearRange' }
        }
      }
    ]);

    return res.json(stats[0] || {
      totalQuestions: 0,
      totalSubjects: 0,
      totalExams: 0,
      totalTopics: 0,
      yearMin: null,
      yearMax: null
    });
  } catch (err) {
    console.error('Error fetching MCQ stats:', err);
    return res.status(500).json({ message: 'Server Error' });
  }
});




/* ---------- Dashboard ---------- */
app.get('/api/user/progress', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const progress = await UserProgress.find({ userId }).sort({ date: -1 }).lean();
    return res.json(progress);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const leaderboard = await UserProgress.getLeaderboard(limit);
    return res.json(leaderboard);
  } catch (err) {
    console.error('Leaderboard error:', err);
    return res.status(500).send('Server Error');
  }
});

// Get detailed test results for review
app.get('/api/user/test-details/:testId', authMiddleware, async (req, res) => {
  try {
    const { testId } = req.params;
    const userId = req.user.id;
    
    const testProgress = await UserProgress.findOne({ 
      _id: testId, 
      userId 
    }).populate('detailedResults.questionId').lean();
    
    if (!testProgress) {
      return res.status(404).json({ message: 'Test not found' });
    }
    
    return res.json(testProgress);
  } catch (err) {
    console.error('Test details error:', err);
    return res.status(500).send('Server Error');
  }
});

// Get user performance analytics
app.get('/api/user/analytics', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const analytics = await UserProgress.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalTests: { $sum: 1 },
          avgAccuracy: { $avg: '$accuracy' },
          totalTimeTaken: { $sum: '$timeTaken' },
          subjectPerformance: {
            $push: {
              subjects: '$subjects',
              accuracy: '$accuracy',
              score: '$score',
              totalQuestions: '$totalQuestions'
            }
          },
          recentTrend: {
            $push: {
              date: '$date',
              accuracy: '$accuracy',
              testName: '$testName'
            }
          }
        }
      }
    ]);
    
    return res.json(analytics[0] || {});
  } catch (err) {
    console.error('Analytics error:', err);
    return res.status(500).send('Server Error');
  }
});


/* ---------- Bookmarks ---------- */
app.post('/api/bookmarks', authMiddleware, async (req, res) => {
  try {
    const { mcqId } = req.body;
    const userId = req.user.id;

    const exists = await Bookmark.findOne({ userId, mcqId });
    if (exists) return res.status(409).json({ message: 'Question already bookmarked' });

    await new Bookmark({ userId, mcqId }).save();
    return res.status(201).json({ message: 'Question bookmarked successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server error');
  }
});

app.get('/api/bookmarks', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const bookmarks = await Bookmark.find({ userId })
      .populate('mcqId')
      .lean();
    return res.json(bookmarks);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server error');
  }
});

app.delete('/api/bookmarks/:mcqId', authMiddleware, async (req, res) => {
  try {
    const { mcqId } = req.params;
    const userId = req.user.id;

    console.log('Deleting bookmark:', { userId, mcqId }); // Debug log

    const bookmark = await Bookmark.findOneAndDelete({ userId, mcqId });
    
    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    console.log('Bookmark deleted:', bookmark); // Debug log

    res.json({ message: 'Bookmark removed successfully' });

  } catch (error) {
    console.error('Bookmark deletion error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/* ---------- New Test Management Routes ---------- */

// Get available subjects for test creation
app.get('/api/mcqs/subjects', async (req, res) => {
  try {
    const subjects = await MCQ.distinct('subject', { subject: { $ne: '' } });
    return res.json(subjects);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
});

// Enhanced test-series route with filters
app.get('/api/test-series', async (req, res) => {
  try {
    const { count = 20, exam, subjects } = req.query;
    const testSize = Math.min(parseInt(count), 100); // Max 100 questions
    
    let filter = {};
    
    // Add filters
    if (exam && exam !== 'All') {
      filter.exam = exam;
    }
    
    if (subjects) {
      const subjectList = subjects.split(',').map(s => s.trim());
      filter.subject = { $in: subjectList };
    }
    
    const docs = await MCQ.aggregate([
      { $match: filter },
      { $sample: { size: testSize } }
    ]);
    
    // Remove correct answers and explanations for test
    const sanitized = docs.map(d => {
      const { correctAnswer, explanation, ...rest } = d;
      return rest;
    });
    
    return res.json(sanitized);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
});

// Enhanced grade-test route with analytics
app.post('/api/grade-test', authMiddleware, async (req, res) => {
  try {
    const { submittedAnswers = {}, testConfig = {}, timeTaken = 0 } = req.body;
    const userId = req.user.id;

    const questionIds = Object.keys(submittedAnswers);
    if (!questionIds.length) return res.json({ score: 0, results: [] });

    const questions = await MCQ.find({ _id: { $in: questionIds } }).lean();
    let score = 0;
    const results = [];
    const detailedResults = [];
    const subjectsSet = new Set();

    // Process each question
    questions.forEach(q => {
      const userAnswer = (submittedAnswers[q._id.toString()] || '').toUpperCase();
      const correct = userAnswer === q.correctAnswer;
      if (correct) score += 1;
      
      // Add to subjects set
      if (q.subject) subjectsSet.add(q.subject);
      
      // Result for frontend response
      results.push({
        id: q._id,
        questionId: q._id,
        userAnswer,
        yourAnswer: userAnswer,
        correctAnswer: q.correctAnswer,
        correct,
        explanation: q.explanation || '',
        subject: q.subject
      });

      // Detailed result for database storage
      detailedResults.push({
        questionId: q._id,
        userAnswer: userAnswer || '',
        correctAnswer: q.correctAnswer,
        isCorrect: correct,
        timeTakenForQuestion: Math.round(timeTaken / questions.length), // Estimate per question
        subject: q.subject || ''
      });
    });

    // Calculate accuracy
    const accuracy = Math.round((score / questions.length) * 100);

    // Enhanced UserProgress data matching your schema
    const progressData = {
      userId,
      score,
      totalQuestions: questions.length,
      testName: testConfig.testName || testConfig.title || 'Practice Test',
      testType: testConfig.type || 'practice',
      timeTaken,
      accuracy, // Will be recalculated by pre-save hook anyway
      subjects: Array.from(subjectsSet),
      difficulty: testConfig.difficulty || 'mixed',
      detailedResults,
      date: new Date(),
      completedAt: new Date()
    };


    // Save enhanced progress with test details
//     await new UserProgress({
//       userId,
//       score,
//       totalQuestions: questions.length,
//       testName: testConfig.testName || testConfig.title || 'Practice Test',
//       testType: testConfig.type || 'practice',
//       timeTaken,
//       accuracy: Math.round((score / questions.length) * 100),
//       date: new Date()
//     }).save();

//     return res.json({ score, results, totalQuestions: questions.length });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).send('Server Error');
//   }
// });

// Save enhanced progress
    const userProgress = new UserProgress(progressData);
    await userProgress.save();

    return res.json({ 
      score, 
      results, 
      totalQuestions: questions.length,
      accuracy,
      timeTaken,
      testId: userProgress._id // Return the saved test ID for future reference
    });
  } catch (err) {
    console.error('Grade test error:', err);
    return res.status(500).json({ 
      message: 'Server Error', 
      error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  }
});


// Also add this enhanced user progress endpoint to leverage your model's capabilities
app.get('/api/user/progress', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get recent progress with all fields
    const progress = await UserProgress.find({ userId })
      .sort({ date: -1 })
      .limit(50)
      .lean();
    
    return res.json(progress);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
});

// Add user statistics endpoint using your model's static method
app.get('/api/user/stats', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Use your model's static method for user stats
    const stats = await UserProgress.getUserStats(userId);
    
    if (stats.length === 0) {
      return res.json({
        totalTests: 0,
        totalQuestions: 0,
        totalCorrect: 0,
        avgAccuracy: 0,
        bestScore: 0,
        totalTimeTaken: 0,
        recentTests: []
      });
    }
    
    return res.json(stats[0]);
  } catch (err) {
    console.error('User stats error:', err);
    return res.status(500).send('Server Error');
  }
});


// Get user test history
app.get('/api/user/test-history', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await UserProgress.find({ userId })
      .sort({ date: -1 })
      .limit(50)
      .lean();
    
    const formattedHistory = history.map(test => ({
      _id: test._id,
      testName: test.testName || 'Practice Test',
      score: test.score,
      totalQuestions: test.totalQuestions,
      accuracy: test.accuracy || Math.round((test.score / test.totalQuestions) * 100),
      timeTaken: test.timeTaken || 0,
      completedAt: test.date,
      testType: test.testType || 'practice'
    }));
    
    return res.json(formattedHistory);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
});

// Get available tests (predefined)
app.get('/api/tests', authMiddleware, async (req, res) => {
  try {
    // This would eventually come from a Tests collection
    // For now, return default tests
    const meta = await MCQ.aggregate([
      {
        $group: {
          _id: null,
          subjects: { $addToSet: '$subject' },
          exams: { $addToSet: '$exam' },
          totalQuestions: { $sum: 1 }
        }
      }
    ]);
    
    const { subjects = [], exams = [], totalQuestions = 0 } = meta[0] || {};
    
    const defaultTests = [
      {
        _id: 'quick-test',
        title: 'Quick Practice Test',
        description: 'Random 20 questions from all subjects',
        questionCount: 20,
        duration: 30,
        type: 'predefined',
        subjects: 'All',
        difficulty: 'mixed'
      },
      {
        _id: 'comprehensive-test',
        title: 'Comprehensive Test',
        description: 'Complete 50-question test covering all topics',
        questionCount: Math.min(50, totalQuestions),
        duration: 75,
        type: 'predefined',
        subjects: 'All',
        difficulty: 'mixed'
      }
    ];
    
    // Add exam-specific tests
    exams.filter(Boolean).forEach(exam => {
      defaultTests.push({
        _id: `exam-${exam.toLowerCase().replace(/\s+/g, '-')}`,
        title: `${exam} Mock Test`,
        description: `Practice test based on ${exam} pattern`,
        questionCount: 30,
        duration: 45,
        type: 'predefined',
        subjects: exam,
        difficulty: 'mixed'
      });
    });
    
    return res.json(defaultTests);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
});


/* ---------- Start ---------- */
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


