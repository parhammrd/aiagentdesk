const agentService = require('../services/agentService');
const llmService = require('../services/llm');

/**
 * Get all agents
 */
exports.getAllAgents = (req, res) => {
  const agents = agentService.getAllAgents();
  res.status(200).json({ agents });
};

/**
 * Get an agent by ID
 */
exports.getAgentById = (req, res) => {
  const { id } = req.params;
  const agent = agentService.getAgentById(id);
  
  if (!agent) {
    return res.status(404).json({ error: `Agent with ID ${id} not found` });
  }
  
  res.status(200).json({ agent });
};

/**
 * Create a new agent
 */
exports.createAgent = (req, res) => {
  const agentData = req.body;
  
  if (!agentData.name) {
    return res.status(400).json({ error: 'Agent name is required' });
  }
  
  const agent = agentService.addAgent(agentData);
  res.status(201).json({ agent });
};

/**
 * Update an agent
 */
exports.updateAgent = (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  const agent = agentService.updateAgent(id, updates);
  
  if (!agent) {
    return res.status(404).json({ error: `Agent with ID ${id} not found` });
  }
  
  res.status(200).json({ agent });
};

/**
 * Delete an agent
 */
exports.deleteAgent = (req, res) => {
  const { id } = req.params;
  const deleted = agentService.deleteAgent(id);
  
  if (!deleted) {
    return res.status(404).json({ error: `Agent with ID ${id} not found` });
  }
  
  res.status(204).send();
};

/**
 * Toggle an agent's active state
 */
exports.toggleAgentActive = (req, res) => {
  const { id } = req.params;
  const isActive = agentService.toggleAgentActive(id);
  
  if (isActive === null) {
    return res.status(404).json({ error: `Agent with ID ${id} not found` });
  }
  
  res.status(200).json({ id, isActive });
};

/**
 * Send a message to an agent
 */
exports.sendMessageToAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const { message, instructions } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    const agent = agentService.getAgentById(id);
    
    if (!agent) {
      return res.status(404).json({ error: `Agent with ID ${id} not found` });
    }
    
    // Determine which instructions to use (custom ones passed in request or agent's default)
    const finalInstructions = instructions || agent.instructions;
    
    // Get the response from the LLM service using the agent's model and instructions
    const response = await llmService.generateResponse(
      message, 
      agent.model,
      finalInstructions
    );
    
    res.status(200).json({
      agentId: id,
      agentName: agent.name,
      message: response
    });
  } catch (error) {
    console.error(`Error sending message to agent ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to process your request' });
  }
}; 