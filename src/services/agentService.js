const Agent = require('../models/Agent');

class AgentService {
  constructor() {
    // Default agents
    this.agents = [
      new Agent({
        id: 'agent-1',
        name: 'Director',
        model: 'gemini',
        description: 'Provides high-level strategy, planning, and team guidance',
        instructions: 'You are a director and team leader. Focus on vision, prioritization, and guiding others toward aligned goals. Communicate with authority and empathy.',
        tools: ['calendar', 'project_board'],
        avatarColor: '#F4B400'
      }),
      new Agent({
        id: 'agent-2',
        name: 'Ethos',
        model: 'gemini',
        description: 'Ensures ethical integrity and values alignment in decision-making',
        instructions: 'You are an ethics advisor. Evaluate ideas and actions based on fairness, societal impact, and long-term consequences. Promote responsibility and inclusivity.',
        tools: ['web_search'],
        avatarColor: '#DB4437'
      }),
      new Agent({
        id: 'agent-3',
        name: 'Research Assistant',
        model: 'gemini',
        description: 'Helps with research and information gathering',
        instructions: 'You are a helpful research assistant. Provide thorough, accurate information with citations when possible.',
        tools: ['web_search', 'calculator'],
        avatarColor: '#4285F4'
      }),
      new Agent({
        id: 'agent-4',
        name: 'Code Helper',
        model: 'gemini',
        description: 'Assists with coding and development tasks',
        instructions: 'You are a coding assistant. Help write clean, efficient code and debug issues. Explain your solutions clearly.',
        tools: ['code_execution', 'file_browser'],
        avatarColor: '#34A853'
      }),
      // new Agent({
      //   id: 'agent-5',
      //   name: 'Science Expert',
      //   model: 'gemini',
      //   description: 'Explains and explores scientific concepts in depth',
      //   instructions: 'You are a science expert. Provide detailed, accurate explanations grounded in scientific method and peer-reviewed literature.',
      //   tools: ['web_search', 'calculator'],
      //   avatarColor: '#9C27B0'
      // }),
      // new Agent({
      //   id: 'agent-6',
      //   name: 'Creative Writer',
      //   model: 'gemini',
      //   description: 'Creates engaging, imaginative, and stylistically diverse writing',
      //   instructions: 'You are a creative writer. Craft compelling stories, poems, and content in various tones and styles. Emphasize originality and emotional resonance.',
      //   tools: ['file_browser'],
      //   avatarColor: '#FF7043'
      // }),
      // new Agent({
      //   id: 'agent-7',
      //   name: 'Math Tutor',
      //   model: 'gemini',
      //   description: 'Helps explain mathematical concepts and solve problems step-by-step',
      //   instructions: 'You are a math tutor. Explain math clearly with examples and walk through problem-solving steps at the student’s level.',
      //   tools: ['calculator', 'whiteboard'],
      //   avatarColor: '#00ACC1'
      // })
    ];
  }

  /**
   * Get all agents
   * @returns {Array<Agent>} List of all agents
   */
  getAllAgents() {
    return this.agents;
  }

  /**
   * Get an agent by ID
   * @param {string} id - Agent ID
   * @returns {Agent|null} The agent or null if not found
   */
  getAgentById(id) {
    return this.agents.find(agent => agent.id === id) || null;
  }

  /**
   * Add a new agent
   * @param {Object} agentData - Agent data
   * @returns {Agent} The created agent
   */
  addAgent(agentData) {
    const agent = new Agent(agentData);
    this.agents.push(agent);
    return agent;
  }

  /**
   * Update an agent
   * @param {string} id - Agent ID
   * @param {Object} updates - Properties to update
   * @returns {Agent|null} The updated agent or null if not found
   */
  updateAgent(id, updates) {
    const agent = this.getAgentById(id);
    if (agent) {
      agent.update(updates);
      return agent;
    }
    return null;
  }

  /**
   * Delete an agent
   * @param {string} id - Agent ID
   * @returns {boolean} True if the agent was deleted
   */
  deleteAgent(id) {
    const initialLength = this.agents.length;
    this.agents = this.agents.filter(agent => agent.id !== id);
    return initialLength > this.agents.length;
  }

  /**
   * Get active agents
   * @returns {Array<Agent>} List of active agents
   */
  getActiveAgents() {
    return this.agents.filter(agent => agent.isActive);
  }

  /**
   * Toggle an agent's active state
   * @param {string} id - Agent ID
   * @returns {boolean} The new active state or null if agent not found
   */
  toggleAgentActive(id) {
    const agent = this.getAgentById(id);
    return agent ? agent.toggleActive() : null;
  }
}

// Create a singleton instance
const agentService = new AgentService();

module.exports = agentService; 