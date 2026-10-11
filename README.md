# 🌐 FinGraph — Autonomous Financial Event Market Impact Graph

> **Hackathon Project by Team codenovicesHack**
>
> **Status:** 🔬 Research & Documentation Phase | 🚀 MVP Implemented | 🎯 Demo & Pitch in Progress

---

## 📌 Project Status

| Phase | Status | Description |
|---|:---:|---|
| 🔬 **Research** | ✅ Complete | Research across six dimensions: NLP, knowledge graphs, financial markets, system architecture, existing solutions, and data sources. |
| 📚 **Documentation** | ✅ Complete | System architecture, API specifications, graph schema, developer guide, and financial data research. |
| ⚙️ **MVP Implementation** | ✅ Complete | FastAPI backend on port `8000` and interactive Canvas-based frontend on port `3000`. |
| 🧪 **Testing & Validation** | 🔄 In Progress | Testing financial event scenarios, impact propagation, graph relationships, and What-If simulations. |
| 🎤 **Demo & Pitch** | 🔄 In Progress | Preparing demonstrations for crude oil price shocks, semiconductor supply disruptions, and scenario-based impact analysis. |

---

## 📖 What Is FinGraph?

FinGraph is an AI-powered financial intelligence platform that analyzes financial events and visualizes how their potential effects can spread across companies, commodities, economic indicators, industries, and financial markets.

Instead of treating every news headline as an isolated event, FinGraph connects relevant information into an interactive **Financial Market Impact Graph**.

### 🎯 The Problem

Financial events rarely affect only one company or sector.

For example, a significant increase in crude oil prices can raise fuel and transportation costs. These changes may affect airlines, logistics companies, manufacturing businesses, and consumer prices. Depending on the broader economic environment, they may also influence inflation expectations, interest-rate decisions, and interest-sensitive sectors such as real estate.

However, financial news platforms often present these developments as separate headlines, making it difficult to understand the relationships between an initial event and its possible downstream effects.

**The core challenge is understanding how financial events are connected, how their effects may propagate, and what evidence supports each relationship.**

### 💡 Our Solution

FinGraph transforms financial news into an interactive knowledge graph that helps users explore potential market-impact pathways.

The platform focuses on four key questions:

1. **WHO is affected?** Identify relevant companies, sectors, commodities, economic indicators, and financial instruments.
2. **HOW might they be affected?** Analyze the direction and potential significance of each relationship.
3. **WHY might the impact occur?** Provide understandable explanations and supporting evidence for graph connections.
4. **HOW FAR could the impact spread?** Trace first-order, second-order, and further downstream relationships across the graph.

By combining AI-based event extraction, relationship analysis, graph algorithms, and financial data, FinGraph aims to make complex financial relationships easier to explore and understand.

---

## 🔍 How FinGraph Works

FinGraph follows a structured workflow to transform financial information into an explainable impact graph.

### System Workflow

1. **Financial Event Input** — The user provides a financial news article or event description.
2. **Event & Entity Extraction** — The AI identifies the event, relevant entities, and important financial context.
3. **Relationship Identification** — The system identifies potential relationships between extracted entities and evaluates their relevance.
4. **Knowledge Graph Construction** — Entities become nodes, and their relationships become connected edges.
5. **Impact Propagation** — Graph algorithms trace possible downstream pathways and identify connected entities.
6. **Evidence & Explanation** — The platform presents explanations, supporting information, and confidence indicators for relationships.
7. **Interactive Visualization** — Users explore the graph, inspect connections, and investigate alternative impact scenarios.

### Example: Crude Oil Price Shock

**Input event:**

`Crude oil prices rise by 12% following an OPEC production cut.`

**Illustrative impact pathways:**

```text
                    CRUDE OIL PRICE INCREASE
                               |
              +----------------+----------------+
              |                |                |
              v                v                v
        Higher Fuel      Higher Input      Inflationary
           Costs            Costs           Pressures
              |                |                |
              v                v                v
          Airlines       Transportation    Interest-Rate
              |           & Logistics       Expectations
              v                |                |
       Operating Costs         v                v
              |          Goods Delivery      Real Estate
              v             Costs             & Housing
       Profitability
              |
              v
       Potential Stock
        Market Impact
```

This diagram illustrates possible economic relationships, not confirmed outcomes or guaranteed market predictions. Actual effects depend on market conditions, company characteristics, policy responses, and other factors.

In the FinGraph interface, users can explore these connections interactively, inspect individual relationships, and review the evidence and reasoning behind each proposed impact pathway.

---

## ✨ Core Features

| Feature | Description |
|---|---|
| 📰 **Financial Event Analysis** | Extract important events and financial context from unstructured news and text. |
| 🧠 **AI-Powered Entity Extraction** | Identify companies, commodities, sectors, economic indicators, and financial instruments. |
| 🕸️ **Dynamic Knowledge Graph** | Represent financial entities as nodes and their relationships as edges. |
| 🔗 **Impact Path Analysis** | Trace first-order and downstream relationships using graph traversal algorithms. |
| 📊 **Market Data Integration** | Incorporate available historical price data to provide additional market context. |
| 🔎 **Explainable Relationships** | Explain why entities are connected and present available supporting evidence. |
| 🎚️ **Confidence & Uncertainty Indicators** | Communicate uncertainty in inferred relationships instead of treating every AI-generated conclusion as fact. |
| 🔮 **What-If Simulation** | Explore hypothetical scenarios and examine how changing an initial assumption could alter potential impact pathways. |
| ⚡ **Interactive Visualization** | Explore connected entities, inspect relationships, and navigate the impact graph. |

> **Note:** Feature descriptions represent the intended product capabilities. The availability and maturity of each feature should be verified against the current implementation.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Backend** | Python + FastAPI | API development, event processing, and application logic. |
| **AI / LLM** | OpenRouter (Claude / GPT-4o, depending on model availability) | Extracting entities, identifying candidate relationships, and generating explanations. |
| **Graph Engine** | NetworkX | In-memory graph processing, traversal, and graph analysis. |
| **Frontend** | Next.js + TypeScript | Building a responsive, component-based web application. |
| **Graph Visualization** | `react-force-graph-3d` | Interactive 3D graph rendering and navigation. |
| **Market Data** | `yfinance` | Accessing available historical market-price information for supported symbols. |

### Why This Stack?

- **FastAPI** provides a lightweight backend for exposing analysis and graph-processing endpoints.
- **LLMs** help interpret unstructured financial text and propose relationships that can be validated.
- **NetworkX** supports graph traversal and algorithms for exploring connected entities.
- **Next.js and TypeScript** support a structured, maintainable frontend.
- **3D graph visualization** helps users explore complex relationships interactively.
- **Historical market data** provides context for examining financial events over time.

The system should distinguish between observed data, established relationships, and AI-inferred connections. LLM-generated relationships should not automatically be treated as verified financial facts.

---

## 📚 Documentation

The following documents provide additional information about the project architecture, APIs, graph design, and development workflow.

| Document | Description | Intended Audience |
|---|---|---|
| 📊 [ARCHITECTURE.md](docs/ARCHITECTURE.md) | System architecture, data flow, and component responsibilities. | All team members |
| 🔌 [API.md](docs/API.md) | API endpoints with request and response examples. | Backend and frontend developers |
| 🕸️ [GRAPH-SCHEMA.md](docs/GRAPH-SCHEMA.md) | Graph node types, edge types, and propagation algorithms. | Data and algorithm developers |
| 👩‍💻 [DEV-GUIDE.md](docs/DEV-GUIDE.md) | Setup instructions, Git workflow, coding conventions, and team responsibilities. | All team members |
| 🔬 [Financial Impact Graph Research](docs/research/financial-impact-graph-research.md) | Research covering financial impact graphs, relevant data, and supporting technical concepts. | All team members |

**Getting started:** Team members should read `DEV-GUIDE.md` first, followed by `ARCHITECTURE.md` and the documentation relevant to their assigned responsibilities.

---

## 📁 Project Structure

```text
codenovicesHack/
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── GRAPH-SCHEMA.md
│   ├── DEV-GUIDE.md
│   └── research/
│       └── financial-impact-graph-research.md
├── backend/
│   └── FastAPI application
├── frontend/
│   └── Next.js application
├── financial-impact-graph.md
├── .env.example
├── .gitignore
└── README.md
```

> **Repository note:** This structure describes the intended organization. Update the tree to match the actual files and directories in the repository.

---

## 👥 Team

**Team:** codenovicesHack

**GitHub Repository:** [nishchaydev/codenovicesHack](https://github.com/nishchaydev/codenovicesHack)

### Team Responsibilities

| Role | Responsibilities |
|---|---|
| **Backend + LLM** | FastAPI services, LLM integration, event-processing workflows, and caching. |
| **Frontend + Visualization** | Next.js interface, interactive graph components, visualization, and animations. |
| **Data + Algorithms** | Financial data preparation, graph schema, relationship modeling, and impact propagation algorithms. |
| **Integration + Demo** | Frontend-backend integration, end-to-end testing, demo scenarios, and presentation preparation. |

Team responsibilities may overlap depending on implementation needs and individual contributions.

---

## 🔬 Research & Validation Principles

FinGraph is designed to make financial event analysis more transparent and useful.

- **Evidence over unsupported claims:** Provide supporting information for important graph relationships whenever available.
- **Facts versus inferences:** Distinguish observed events and data from AI-generated hypotheses.
- **Uncertainty awareness:** Confidence scores should communicate uncertainty and must not be presented as guaranteed probabilities of market outcomes unless appropriately calibrated.
- **Traceable impact pathways:** Make it possible to inspect the connections between an initial event and downstream entities.
- **Responsible financial interpretation:** Present potential market effects as analytical scenarios, not guaranteed predictions or personalized investment advice.
- **Validation:** Where historical data is available, compare relevant market movements with event timelines without assuming that an event alone caused the observed changes.

---

## 🚀 Project Vision

Our vision is to make complex financial relationships easier to understand by connecting isolated events into an explainable, interactive network of potential market impacts.

FinGraph aims to help users move beyond the headline and explore the wider financial context behind an event.

**From financial news to connected insights. From isolated headlines to explainable impact pathways.**

---

## 📄 License

This project is intended to be released under the [MIT License](LICENSE), subject to the presence of the corresponding license file in the repository.
