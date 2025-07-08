// Interview Question Routes
const express = require('express');
const router = express.Router();
const  interviewQuestionContoller  = require('../controllers/interviewQuestionContoller');

// POST /api/interview/custom-question
router.post('/custom-question', interviewQuestionContoller.getAnswerOfQuestion);

module.exports = router;
