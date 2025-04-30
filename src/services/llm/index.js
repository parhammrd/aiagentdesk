const geminiService = require('./geminiService');

/**
 * Factory to get the appropriate LLM service
 * @param {string} model - LLM model name
 * @returns {Object} LLM service
 */
const getLLMService = (model) => {
  switch (model.toLowerCase()) {
    case 'gemini':
      return geminiService;
    // Add more models here in the future
    default:
      return geminiService; // Default to Gemini
  }
};

/**
 * Generate a response from an LLM
 * @param {string} message - Input message
 * @param {string} model - LLM model to use
 * @param {string} instructions - System instructions for the model
 * @returns {Promise<string>} Response from the LLM
 */
exports.generateResponse = async (message, model = 'gemini', instructions = '') => {
  const service = getLLMService(model);
  return await service.generateResponse(message, instructions);
}; 