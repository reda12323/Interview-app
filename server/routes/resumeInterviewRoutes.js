const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const Resume = require('../models/Resume');


const resumeInterviewController = require('../controllers/resumeInterviewController');

// Configure file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Upload resume and generate questions
router.post('/upload-resume', upload.single('resume'), async (req, res) => {

  try {
    const { uid } = req.body;
    if (!uid) return res.status(400).json({ error: 'User ID (uid) is required' });
    const filePath = req.file.path;
    const ext = path.extname(filePath).toLowerCase();

    let resumeText = '';

    if (ext === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const parsed = await pdfParse(dataBuffer);
      resumeText = parsed.text;
    } else if (ext === '.docx') {
      const data = fs.readFileSync(filePath);
      const result = await mammoth.extractRawText({ buffer: data });
      resumeText = result.value;
    } else {
      return res.status(400).json({ error: 'Unsupported file format' });
    }

    const savedResume = await Resume.create({ uid, filePath });

    const sessionId = await resumeInterviewController.generateResumeQuestionsDirect(resumeText);

    res.json({ sessionId, resumeText });
  } catch (err) {
    console.error('Resume upload failed:', err.message);
    res.status(500).json({ error: 'Resume processing failed' });
  }
});

// Existing endpoints
// Optionally, wrap in an express-style handler
router.post('/generate-resume-questions', async (req, res) => {
  const { resumeText } = req.body;
  if (!resumeText) return res.status(400).json({ error: 'Missing resumeText' });

  try {
    const sessionId = await resumeInterviewController.generateResumeQuestionsDirect(resumeText);
    res.json({ sessionId });
  } catch (err) {
    console.error('Error generating resume questions:', err.message);
    res.status(500).json({ error: 'Failed to generate questions' });
  }
});
router.get('/resume-interview/:sessionId', resumeInterviewController.getResumeInterviewSession);
router.post('/evaluate-resume-answers', resumeInterviewController.evaluateResumeAnswers);

module.exports = router;
