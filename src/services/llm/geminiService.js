const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../../config/llm');

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

/**
 * Generate a response using Gemini model
 * @param {string} message - Input message
 * @param {string} instructions - System instructions for the model
 * @returns {Promise<string>} Response from Gemini
 */
exports.generateResponse = async (message, instructions = '') => {
  try {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: config.gemini.modelName });
    
    // Prepare the content with instructions if provided
    let prompt = message;
    if (instructions) {
      prompt = `${instructions}\n\nUser: ${message}`;
    }
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Failed to generate response from Gemini');
  }
}; 