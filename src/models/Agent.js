/**
 * Agent model representing an AI agent in the system
 */
class Agent {
  /**
   * Create a new agent
   * @param {Object} agentData - The agent data
   * @param {string} agentData.id - Unique identifier for the agent
   * @param {string} agentData.name - Display name of the agent
   * @param {string} agentData.model - LLM model to use (e.g., 'gemini')
   * @param {string} agentData.description - Brief description of the agent's purpose
   * @param {string} agentData.instructions - System instructions for the agent
   * @param {Array<string>} agentData.tools - List of tools the agent can use
   * @param {string} agentData.avatarColor - Color for the agent's avatar (optional)
   */
  constructor({
    id,
    name,
    model = 'gemini',
    description = '',
    instructions = '',
    tools = [],
    avatarColor = '#' + Math.floor(Math.random()*16777215).toString(16)
  }) {
    this.id = id || `agent-${Date.now()}`;
    this.name = name;
    this.model = model;
    this.description = description;
    this.instructions = instructions;
    this.tools = tools;
    this.avatarColor = avatarColor;
    this.isActive = false;
  }

  /**
   * Toggle the active state of the agent
   * @returns {boolean} The new active state
   */
  toggleActive() {
    this.isActive = !this.isActive;
    return this.isActive;
  }

  /**
   * Set the agent as active
   */
  setActive() {
    this.isActive = true;
  }

  /**
   * Set the agent as inactive
   */
  setInactive() {
    this.isActive = false;
  }

  /**
   * Check if the agent is active
   * @returns {boolean} True if the agent is active
   */
  isActiveAgent() {
    return this.isActive;
  }

  /**
   * Update the agent's properties
   * @param {Object} updates - Properties to update
   */
  update(updates) {
    Object.assign(this, updates);
  }

  /**
   * Convert the agent to a plain object for serialization
   * @returns {Object} Plain object representation
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      model: this.model,
      description: this.description,
      instructions: this.instructions,
      tools: this.tools,
      avatarColor: this.avatarColor,
      isActive: this.isActive
    };
  }
}

module.exports = Agent; 