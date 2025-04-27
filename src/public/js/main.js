document.addEventListener('DOMContentLoaded', () => {
  const chatForm = document.getElementById('chat-form');
  const messageInput = document.getElementById('message-input');
  const modelSelect = document.getElementById('model-select');
  const chatMessages = document.getElementById('chat-messages');

  // Function to add message to the chat UI
  function addMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(sender === 'user' ? 'user-message' : 'ai-message');
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    
    // Scroll to the bottom of the chat
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Function to send message to the API
  async function sendMessage(message, model) {
    try {
      // Show user message in the UI
      addMessage(message, 'user');
      
      // Clear input field
      messageInput.value = '';
      
      // Add loading indicator
      const loadingElement = document.createElement('div');
      loadingElement.classList.add('message', 'ai-message');
      loadingElement.textContent = 'Thinking...';
      chatMessages.appendChild(loadingElement);
      
      // Send message to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, model }),
      });
      
      // Remove loading indicator
      chatMessages.removeChild(loadingElement);
      
      if (!response.ok) {
        throw new Error('Failed to get response');
      }
      
      const data = await response.json();
      
      // Show AI response in the UI
      addMessage(data.message, 'ai');
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage('Sorry, something went wrong. Please try again.', 'ai');
    }
  }

  // Handle form submission
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const message = messageInput.value.trim();
    const model = modelSelect.value;
    
    if (message) {
      sendMessage(message, model);
    }
  });

  // Add a welcome message
  addMessage('Welcome to Multi-Agent Desk! How can I help you today?', 'ai');
}); 