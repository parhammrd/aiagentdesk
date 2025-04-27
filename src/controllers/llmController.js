const llmService = require('../services/llm');

/**
 * Process chat request
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.processChat = async (req, res) => {
  try {
    const { message, model = 'gemini' } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    const response = await llmService.generateResponse(message, model);
    
    return res.status(200).json({
      message: response,
      model: model
    });
  } catch (error) {
    console.error('Error processing chat:', error);
    return res.status(500).json({ error: 'Failed to process your request' });
  }
}; 