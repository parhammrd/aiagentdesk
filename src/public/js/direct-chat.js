document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const chatMessages = document.getElementById('chat-messages');
  const chatForm = document.getElementById('chat-form');
  const messageInput = document.getElementById('message-input');
  const instructionsInput = document.getElementById('instructions-input');
  const modelSelect = document.getElementById('model-select');
  const agentTitle = document.getElementById('agent-title');
  
  // Selection controls
  const selectionControls = document.getElementById('selection-controls');
  const selectedCountSpan = document.getElementById('selected-count');
  const selectAllBtn = document.getElementById('select-all-btn');
  const toggleSelectionBtn = document.getElementById('toggle-selection-btn');
  const clearSelectionBtn = document.getElementById('clear-selection-btn');
  
  // State 
  let selectedMessages = [];
  
  // Get agent ID from the window variable (set in the HTML)
  const currentAgentId = window.currentAgentId || '';
  
  console.log('Agent ID:', currentAgentId); // Debug line to verify the ID
  
  // Fetch agent details if we have an agent ID
  if (currentAgentId) {
    fetchAgentDetails(currentAgentId);
  }
  
  /**
   * Fetch agent details and set up the page
   */
  async function fetchAgentDetails(agentId) {
    try {
      const response = await fetch(`/api/agents/${agentId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch agent details');
      }
      
      const data = await response.json();
      const agent = data.agent;
      
      // Update page with agent info
      agentTitle.innerHTML = `Direct Chat with <span style="color: ${agent.avatarColor}">${agent.name}</span>`;
      document.title = `Chat with ${agent.name} | Multi-Agent Desk`;
      
      // Set instructions if they exist
      if (agent.instructions) {
        instructionsInput.value = agent.instructions;
      }
      
      // Set model if it exists
      if (agent.model) {
        modelSelect.value = agent.model;
      }
      
      // Add welcome message
      addMessage(`Hello! I'm ${agent.name}. ${agent.description ? agent.description : ''} How can I help you today?`, 'agent', agent);
      
    } catch (error) {
      console.error('Error fetching agent details:', error);
      addMessage('Error loading agent details. You can still chat, but agent-specific settings may not be available.', 'system');
    }
  }
  
  /**
   * Add a message to the chat
   */
  function addMessage(content, sender, agent = null) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    
    // Add selection indicator
    const selectionIndicator = document.createElement('div');
    selectionIndicator.classList.add('selection-indicator');
    messageElement.appendChild(selectionIndicator);
    
    if (sender === 'user') {
      messageElement.classList.add('user-message');
      messageElement.innerHTML = `
        <div class="selection-indicator"></div>
        <div class="message-content">${content}</div>
      `;
    } else if (sender === 'agent' && agent) {
      messageElement.classList.add('agent-message');
      const firstLetter = agent.name.charAt(0).toUpperCase();
      
      messageElement.innerHTML = `
        <div class="selection-indicator"></div>
        <div class="message-header">
          <div class="message-avatar" style="background-color: ${agent.avatarColor}">
            ${firstLetter}
          </div>
          ${agent.name}
        </div>
        <div class="message-content">${content}</div>
      `;
    } else {
      // System message
      messageElement.classList.add('agent-message');
      messageElement.innerHTML = `
        <div class="selection-indicator"></div>
        <div class="message-header">
          <div class="message-avatar" style="background-color: #FF5722">
            S
          </div>
          System
        </div>
        <div class="message-content">${content}</div>
      `;
    }
    
    // Add click event for message selection
    messageElement.addEventListener('click', (e) => {
      // If clicking on a link inside the message, don't select
      if (e.target.tagName === 'A') {
        return;
      }
      
      toggleMessageSelection(messageElement);
    });
    
    chatMessages.appendChild(messageElement);
    
    // Store message data in the element for later use
    messageElement.messageData = {
      content,
      sender,
      senderName: sender === 'agent' && agent ? agent.name : (sender === 'user' ? 'User' : 'System'),
      timestamp: new Date().toISOString()
    };
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return messageElement;
  }
  
  /**
   * Toggle message selection
   */
  function toggleMessageSelection(messageElement) {
    messageElement.classList.toggle('selected');
    
    // Update selectedMessages array
    if (messageElement.classList.contains('selected')) {
      selectedMessages.push(messageElement);
    } else {
      selectedMessages = selectedMessages.filter(msg => msg !== messageElement);
    }
    
    // Update selection count
    selectedCountSpan.textContent = selectedMessages.length;
    
    // Show/hide selection controls
    if (selectedMessages.length > 0) {
      selectionControls.classList.add('active');
    } else {
      selectionControls.classList.remove('active');
    }
  }
  
  /**
   * Send message to the agent
   */
  async function sendMessage(message, instructions) {
    // Don't do anything if there's no agent ID and no agent has been selected
    if (!currentAgentId) {
      addMessage('Please start by selecting an agent from the main chatroom.', 'system');
      return;
    }
    
    // Add user message to chat
    const messageElement = addMessage(message, 'user');
    
    // Clear input
    messageInput.value = '';
    
    // Add loading indicator
    const loadingElement = document.createElement('div');
    loadingElement.classList.add('message', 'agent-message');
    loadingElement.innerHTML = `
      <div class="selection-indicator"></div>
      <div class="message-header">
        <div class="message-avatar" style="background-color: #ccc">...</div>
        Loading
      </div>
      <div class="message-content">Thinking...</div>
    `;
    chatMessages.appendChild(loadingElement);
    
    // Prepare selected messages context if any are selected
    let context = '';
    if (selectedMessages.length > 0) {
      context = 'Previous conversation context:\n\n';
      selectedMessages.forEach(msg => {
        const data = msg.messageData;
        const sender = data.sender === 'user' ? 'User' : data.senderName;
        context += `${sender}: ${data.content}\n\n`;
      });
      context += `\nBased on the above context, please respond to: ${message}`;
      
      // Clear selection after sending
      clearSelectionBtn.click();
    }
    
    try {
      // Send the message to the agent
      const response = await fetch(`/api/agents/${currentAgentId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          message: context || message,
          instructions
        })
      });
      
      // Remove loading indicator
      chatMessages.removeChild(loadingElement);
      
      if (!response.ok) {
        throw new Error('Failed to get response');
      }
      
      const data = await response.json();
      
      // Fetch agent details to display correct agent info
      const agentResponse = await fetch(`/api/agents/${currentAgentId}`);
      const agentData = await agentResponse.json();
      
      // Display the response
      addMessage(data.message, 'agent', agentData.agent);
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Remove loading indicator if it's still there
      if (loadingElement.parentNode) {
        chatMessages.removeChild(loadingElement);
      }
      
      addMessage('Sorry, something went wrong. Please try again.', 'system');
    }
  }
  
  // Selection control event listeners
  selectAllBtn.addEventListener('click', () => {
    const allMessages = chatMessages.querySelectorAll('.message');
    allMessages.forEach(msg => {
      if (!msg.classList.contains('selected')) {
        toggleMessageSelection(msg);
      }
    });
  });
  
  toggleSelectionBtn.addEventListener('click', () => {
    const allMessages = chatMessages.querySelectorAll('.message');
    allMessages.forEach(msg => {
      toggleMessageSelection(msg);
    });
  });
  
  clearSelectionBtn.addEventListener('click', () => {
    selectedMessages.forEach(msg => {
      msg.classList.remove('selected');
    });
    selectedMessages = [];
    selectedCountSpan.textContent = '0';
    selectionControls.classList.remove('active');
  });
  
  // Handle form submission
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const message = messageInput.value.trim();
    const instructions = instructionsInput.value.trim();
    
    if (message) {
      sendMessage(message, instructions);
    }
  });
  
  // Add welcome message if no agent ID (direct visit to the page)
  if (!currentAgentId) {
    addMessage('Welcome to Direct Chat. Please select an agent from the main chatroom to begin.', 'system');
  }
}); 