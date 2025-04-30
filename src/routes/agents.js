const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');

// Get all agents
router.get('/', agentController.getAllAgents);

// Create a new agent
router.post('/', agentController.createAgent);

// Get an agent by ID
router.get('/:id', agentController.getAgentById);

// Update an agent
router.put('/:id', agentController.updateAgent);

// Delete an agent
router.delete('/:id', agentController.deleteAgent);

// Toggle agent active state
router.post('/:id/toggle-active', agentController.toggleAgentActive);

// Send a message to an agent
router.post('/:id/chat', agentController.sendMessageToAgent);

module.exports = router; 