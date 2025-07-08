const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');

router.post('/generate-questions', interviewController.generateQuestions);
router.get('/interview/:sessionId', interviewController.getInterviewSession);
router.post('/evaluate-answers', interviewController.evaluateAnswers);

module.exports = router;
