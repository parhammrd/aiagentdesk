document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const agentList = document.getElementById('agent-list');
  const chatMessages = document.getElementById('chat-messages');
  const chatForm = document.getElementById('chat-form');
  const messageInput = document.getElementById('message-input');
  const addAgentBtn = document.getElementById('add-agent-btn');
  const deleteAgentBtn = document.getElementById('delete-agent-btn');
  const agentModal = document.getElementById('agent-modal');
  const closeModal = document.querySelector('.close');
  const agentForm = document.getElementById('agent-form');
  
  // Agent form elements
  const agentIdInput = document.getElementById('agent-id');
  const agentNameInput = document.getElementById('agent-name');
  const agentModelInput = document.getElementById('agent-model');
  const agentDescriptionInput = document.getElementById('agent-description');
  const agentInstructionsInput = document.getElementById('agent-instructions');
  const agentToolsInput = document.getElementById('agent-tools');
  const agentColorInput = document.getElementById('agent-color');
  
  // State
  let agents = [];
  let activeAgents = [];
  
  // Fetch all agents
  async function fetchAgents() {
    try {
      const response = await fetch('/api/agents');
      const data = await response.json();
      agents = data.agents;
      renderAgentList();
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  }
  
  // Render the agent list
  function renderAgentList() {
    agentList.innerHTML = '';
    
    agents.forEach(agent => {
      const agentElement = document.createElement('div');
      agentElement.classList.add('agent-item');
      if (agent.isActive) {
        agentElement.classList.add('active');
        if (!activeAgents.includes(agent.id)) {
          activeAgents.push(agent.id);
        }
      }
      
      const firstLetter = agent.name.charAt(0).toUpperCase();
      
      agentElement.innerHTML = `
        <div class="agent-avatar" style="background-color: ${agent.avatarColor}">
          ${firstLetter}
        </div>
        <div class="agent-info">
          <div class="agent-name">${agent.name}</div>
          <div class="agent-description">${agent.description}</div>
        </div>
        <div class="agent-actions">
          <a href="/chat/${agent.id}" class="agent-direct-link" title="Direct chat">↗</a>
        </div>
        `;
      
      
      agentElement.addEventListener('click', (e) => {
        // If clicking on the direct link, don't toggle agent
        if (e.target.classList.contains('agent-direct-link')) {
          return;
        }
        toggleAgentActive(agent.id);
      });
      
      agentElement.addEventListener('dblclick', (e) => {
        // If double clicking on the direct link, don't open modal
        if (e.target.classList.contains('agent-direct-link')) {
          return;
        }
        openEditAgentModal(agent);
      });
      
      agentList.appendChild(agentElement);
    });
  }
  
  // Toggle agent active state
  async function toggleAgentActive(agentId) {
    try {
      const response = await fetch(`/api/agents/${agentId}/toggle-active`, {
        method: 'POST'
      });
      
      const data = await response.json();
      
      // Update local agents array
      const agentIndex = agents.findIndex(a => a.id === agentId);
      if (agentIndex !== -1) {
        agents[agentIndex].isActive = data.isActive;
        
        if (data.isActive) {
          if (!activeAgents.includes(agentId)) {
            activeAgents.push(agentId);
          }
        } else {
          activeAgents = activeAgents.filter(id => id !== agentId);
        }
      }
      
      renderAgentList();
    } catch (error) {
      console.error('Error toggling agent active state:', error);
    }
  }
  
  // Add message to chat
  function addMessage(content, sender, senderName, avatarColor) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    
    // Add appropriate class based on sender
    if (sender === 'user') {
      messageElement.classList.add('user-message');
      messageElement.innerHTML = `<div class="message-content">${content}</div>`;
    } else {
      messageElement.classList.add('agent-message');
      
      const firstLetter = senderName.charAt(0).toUpperCase();
      
      messageElement.innerHTML = `
        <div class="message-header">
          <div class="message-avatar" style="background-color: ${avatarColor}">
            ${firstLetter}
          </div>
          ${senderName}
        </div>
        <div class="message-content">${content}</div>
      `;
    }
    
    chatMessages.appendChild(messageElement);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  // Send message to all active agents
  async function sendMessageToAgents(message) {
    // Add user message to chat
    addMessage(message, 'user');
    
    // Clear input
    messageInput.value = '';
    
    // Get active agents
    const targetAgents = agents.filter(agent => agent.isActive);
    
    // If no agents are active, show a message
    if (targetAgents.length === 0) {
      addMessage('No agents are active. Please select at least one agent from the sidebar.', 'system', 'System', '#FF5722');
      return;
    }
    
    // Create loading messages for each agent
    const loadingElements = {};
    
    targetAgents.forEach(agent => {
      const loadingElement = document.createElement('div');
      loadingElement.classList.add('message', 'agent-message');
      
      const firstLetter = agent.name.charAt(0).toUpperCase();
      
      loadingElement.innerHTML = `
        <div class="message-header">
          <div class="message-avatar" style="background-color: ${agent.avatarColor}">
            ${firstLetter}
          </div>
          ${agent.name}
        </div>
        <div class="message-content">Thinking...</div>
      `;
      
      chatMessages.appendChild(loadingElement);
      loadingElements[agent.id] = loadingElement;
    });
    
    // Send message to each target agent
    const promises = targetAgents.map(async (agent) => {
      try {
        const response = await fetch(`/api/agents/${agent.id}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message })
        });
        
        if (!response.ok) {
          throw new Error('Failed to get response');
        }
        
        const data = await response.json();
        return {
          ...data
        };
      } catch (error) {
        console.error(`Error sending message to agent ${agent.id}:`, error);
        return {
          agentId: agent.id,
          agentName: agent.name,
          message: 'Sorry, I encountered an error processing your request.',
          error: true
        };
      }
    });
    
    // Wait for all responses
    const responses = await Promise.all(promises);
    
    // Remove loading elements and add actual responses
    responses.forEach(response => {
      const agent = agents.find(a => a.id === response.agentId);
      if (agent && loadingElements[agent.id]) {
        chatMessages.removeChild(loadingElements[agent.id]);
        addMessage(response.message, 'agent', response.agentName, agent.avatarColor);
      }
    });
  }
  
  // Open modal to add a new agent
  function openAddAgentModal() {
    // Clear form
    agentForm.reset();
    agentIdInput.value = '';
    agentColorInput.value = '#' + Math.floor(Math.random()*16777215).toString(16);
    
    // Show modal
    agentModal.style.display = 'block';
  }
  
  // Open modal to edit an existing agent
  function openEditAgentModal(agent) {
    // Fill form with agent data
    agentIdInput.value = agent.id;
    agentNameInput.value = agent.name;
    agentModelInput.value = agent.model;
    agentDescriptionInput.value = agent.description;
    agentInstructionsInput.value = agent.instructions;
    agentToolsInput.value = agent.tools.join(', ');
    agentColorInput.value = agent.avatarColor;
    
    // Show modal
    agentModal.style.display = 'block';
  }
  
  // Close modal
  function closeAgentModal() {
    agentModal.style.display = 'none';
  }
  
  // Save agent (create or update)
  async function saveAgent(event) {
    event.preventDefault();
    
    const agentId = agentIdInput.value;
    const agentData = {
      name: agentNameInput.value,
      model: agentModelInput.value,
      description: agentDescriptionInput.value,
      instructions: agentInstructionsInput.value,
      tools: agentToolsInput.value.split(',').map(tool => tool.trim()).filter(Boolean),
      avatarColor: agentColorInput.value
    };
    
    try {
      let response;
      
      if (agentId) {
        // Update existing agent
        response = await fetch(`/api/agents/${agentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(agentData)
        });
      } else {
        // Create new agent
        response = await fetch('/api/agents', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(agentData)
        });
      }
      
      if (!response.ok) {
        throw new Error('Failed to save agent');
      }
      
      // Refresh agent list
      await fetchAgents();
      
      // Close modal
      closeAgentModal();
    } catch (error) {
      console.error('Error saving agent:', error);
      alert('Failed to save agent. Please try again.');
    }
  }

  // Delete agent
  deleteAgentBtn.addEventListener('click', async () => {
    const agentId = agentIdInput.value; // Get the agent ID from the hidden input
    if (agentId) {
      const confirmDelete = confirm('Are you sure you want to delete this agent?');
      if (confirmDelete) {
        try {
          const response = await fetch(`/api/agents/${agentId}`, {
            method: 'DELETE'
          });
          if (response.ok) {
            alert('Agent deleted successfully.');
            await fetchAgents(); // Refresh the agent list
            closeAgentModal(); // Close the modal
          } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.error}`);
          }
        } catch (error) {
          console.error('Error deleting agent:', error);
          alert('Failed to delete agent. Please try again.');
        }
      }
    } else {
      alert('No agent selected for deletion.');
    }
  });
  
  // Event Listeners
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const message = messageInput.value.trim();
    if (message) {
      sendMessageToAgents(message);
    }
  });
  
  addAgentBtn.addEventListener('click', openAddAgentModal);
  closeModal.addEventListener('click', closeAgentModal);
  agentForm.addEventListener('submit', saveAgent);
  
  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === agentModal) {
      closeAgentModal();
    }
  });
  
  // Initialize
  fetchAgents();
  
  // Add welcome message
  addMessage('Welcome to the Multi-Agent Chatroom! Select agents from the sidebar to start chatting.', 'system', 'System', '#FF5722');
}); 