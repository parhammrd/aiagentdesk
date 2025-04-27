const express = require('express');
const router = express.Router();
const llmController = require('../controllers/llmController');

// LLM API route
router.post('/chat', llmController.processChat);

module.exports = router; 