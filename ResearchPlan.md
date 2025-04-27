# Multi-Agent Desk: Research Plan

## Introduction

Multi-Agent Desk is a platform enabling simultaneous interaction with multiple specialized LLM agents. Each agent holds a unique domain expertise (e.g., mathematics tutor, history scholar), allowing the system to pool diverse knowledge and tackle complex queries more effectively [{1}]. By facilitating parallel dialogues, the platform leverages multi-agent collaboration to enhance learning outcomes, akin to how LLM-powered classroom simulations have shown improved educational engagement [{2}]. This project can be enhanced through the integration of two methods: Retrieval-Augmented Generation (RAG) for grounding agent responses in real-time information, and Model Collaboration Protocols (MCP) for structured inter-agent communication.

##### Key objectives include:

* **Prototype Development**: Build a web-based Multi-Agent Desk interface that supports concurrent chat with multiple LLM agents.
* **LLM Integration**: Connect heterogeneous LLM backends (via APIs like OpenAI/Anthropic and local models like LLaMA and DeepSeek) and equip each agent with specialized knowledge.
* **User Evaluation**: Conduct user studies comparing multi-agent interactions vs. single-agent baselines in educational tasks, measuring learning gains and user preferences.
* **RAG and MCP Integration**: Create retrieval pipelines for agents to access updated knowledge and establish a collaboration protocol for requesting help or refining for requesting help or refining each other's answers.

## Related Work

### LLM Benchmarking Platforms

* **Chatbot Arena (LLMSYS)**: An open, crowdsourced platform for LLM evaluation [{3}]. Users engage in anonymous, randomized pairwise battles between chatbots, yielding Elo-style rankings based on human preferences. This design emphasizes live human evaluation of LLMs in open-ended dialogue tasks.
* **Clarifai LLM Battleground**: A side-by-side comparison module for multiple LLMs [{4}]. Given a user prompt, it runs numerous models concurrently, simplifying the selection of the best model through centralized, real-time testing and communal insights. Its interface highlights differences in style and accuracy among models.
* **Multi-Modality Arena (OpenGVLab)**: This platform extends comparative evaluation to vision-language models [{5}]. Two multimodal LLMs are benchmarked in parallel on visual question-answering tasks by supplying image inputs. This platform focuses on side-by-side performance in handling multimodal inputs.

## Multi-Agent LLM Systems

Multi-agent LLM research shows that specialized agents can collectively share knowledge and solve tasks. For instance, pooling expertise via different prompts/personas allows addressing diverse problems more effectively than a single model [{1}]. Educationally, SimClass demonstrated that multiple LLM agents (playing teacher, students, and other related characters) can simulate classroom interaction and enhance the learning experience [{2}]. These studies inform our design of distinct-agent roles and collaborative workflows in the Multi-Agent Desk.

## Methods

### System Prototyping

* **Architecture Design**: Develop modular components using API-based and locally deployed LLM instances. Implement a web framework with Node.js to handle simultaneous chats.
* **Iterative Implementation**: Begin with a minimal prototype (e.g., two agents) and incrementally add features. Establish containerization or virtual environments to manage dependencies.
* **User Interface**: Create a chat interface showing multiple chat windows for each agent or _use traditional chat rooms_. Clearly label agent identities and provide controls for targeting messages to specific agents or broadcasting to all.

### Agent Roles and Expertise

### User Study Design

### RAG Integration

### MCP Integration

## Expected Outcomes



## References

[{1}]: https://arxiv.org/html/2501.06322v1
[{2}]: https://arxiv.org/html/2406.19226v1
[{3}]: https://arxiv.org/html/2403.04132v1
[{4}]: https://www.clarifai.com/blog/compare-top-llms-with-llm-battleground
[{5}]: https://github.com/OpenGVLab/Multi-Modality-Arena
