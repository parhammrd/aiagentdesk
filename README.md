# Multi-Agent Desk

A Node.js application that provides a unified interface for interacting with different Language Learning Models (LLMs).

## Features

- Modular architecture for easy integration of different LLM providers
- Currently supports Google's Gemini API
- Clean, responsive chat interface
- Extensible design for adding more AI models in the future

## Prerequisites

- Node.js (v14 or higher)
- Google Gemini API key

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd multi-agent-desk
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   PORT=3000
   GEMINI_API_KEY=your-gemini-api-key-here
   ```

4. Start the application:
   ```
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── models/          # Data models
│   ├── public/          # Static assets
│   │   ├── css/         # Stylesheets
│   │   └── js/          # Client-side JavaScript
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   │   └── llm/         # LLM service implementations
│   ├── views/           # EJS templates
│   └── index.js         # Application entry point
├── .env                 # Environment variables (create this)
├── package.json         # Project metadata and dependencies
└── README.md            # Project documentation
```

## Adding New LLM Models

To add a new LLM model:

1. Create a new service file in `src/services/llm/` (e.g., `openaiService.js`)
2. Implement the `generateResponse` method
3. Add the configuration in `src/config/llm.js`
4. Update the factory function in `src/services/llm/index.js`
