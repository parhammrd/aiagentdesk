const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
const apiRoutes = require('./routes/api');
const agentRoutes = require('./routes/agents');

app.use('/api', apiRoutes);
app.use('/api/agents', agentRoutes);

app.get('/', (req, res) => {
  res.render('index', { title: 'Multi-Agent Chatroom' });
});

// Direct chat with a specific agent
app.get('/chat/:agentId', (req, res) => {
  res.render('message', { 
    title: 'Direct Chat',
    agentId: req.params.agentId 
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 