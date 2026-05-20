# STEM Bot

An AI-powered chatbot for Science, Technology, Engineering, and Mathematics. Upload your own documents and ask questions — answers are grounded in your material using Retrieval-Augmented Generation (RAG).

![Demo](demo.gif)

---

## Features

- **User accounts** — Sign up, log in, JWT-based sessions
- **Multi-chat history** — Create, switch between, and delete conversations
- **RAG answers** — Responses are generated from your uploaded documents using FAISS vector search + Azure OpenAI
- **Per-user document storage** — Each user's uploaded PDFs are indexed in their own isolated vector store
- **Document management** — View uploaded files and clear your entire knowledge base
- **Fully containerised** — One command to start the whole stack with Docker

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, Tailwind CSS |
| Backend | FastAPI, Python 3.11 |
| Database | PostgreSQL 16, SQLAlchemy 2.0 |
| Vector store | FAISS (per-user) |
| LLM | Azure OpenAI — GPT-3.5 Turbo (`llm-stem-chatbot`) |
| Embeddings | Azure OpenAI — text-embedding-ada-002 (`embedding-stem-chatbot`) |
| Auth | JWT (python-jose), bcrypt |
| Containerisation | Docker + Docker Compose |

---

## Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Compose v2)
- An Azure OpenAI resource with a chat model and an embedding model deployed

### 1. Clone the repository

```bash
git clone <repo-url>
cd stem-chatbot
```

### 2. Configure environment variables

Edit `backend/.env` with your Azure OpenAI credentials:

```env
# Authentication
AUTH_SECRET_KEY=your-secret-key-here
AUTH_ALGORITHM=HS256

# Azure OpenAI
OPENAI_API_BASE=https://<your-resource>.openai.azure.com/
OPENAI_API_KEY=<your-api-key>
OPENAI_API_VERSION=2024-12-01-preview
EMBEDDING_MODEL_NAME=<your-embedding-deployment>
CHAT_MODEL_NAME=<your-chat-deployment>
```

### 3. Run with Docker

```bash
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |

### Useful commands

```bash
# Run in background
docker compose up -d

# View logs
docker compose logs -f backend

# Stop all services
docker compose down

# Stop and delete all data (database, uploads, vector store)
docker compose down -v
```

---

## Local Development (without Docker)

### Backend

Requires Python 3.11 and a running PostgreSQL instance.

```bash
cd backend
pip install -r requirements.txt
bash run.sh
```

The backend starts at `http://localhost:8000`.

### Frontend

Requires Node.js 18+.

```bash
cd frontend
npm install
npm run dev
```

The frontend starts at `http://localhost:3000`.

---

## Project Structure

```
stem-chatbot/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── run.sh                  # Local dev entrypoint
│   ├── api/
│   │   ├── main.py             # FastAPI app, startup
│   │   ├── models.py           # SQLAlchemy models (User, Chat, Message, Document)
│   │   ├── deps.py             # Auth dependencies
│   │   ├── database.py         # DB engine / session
│   │   ├── app_state.py        # Chatbot singleton
│   │   ├── routers/
│   │   │   ├── auth.py         # POST /auth/, POST /auth/token
│   │   │   ├── chats.py        # CRUD + RAG ask endpoint
│   │   │   └── documents.py    # Upload, list, clear-all
│   │   └── modules/
│   │       ├── chatbot.py      # RAGChatbot — LangChain RetrievalQA
│   │       └── load_vectorstore.py  # FAISS indexing per user
│   ├── vectorstore/            # Per-user FAISS indexes (volume-mounted)
│   └── data/uploads/           # Per-user uploaded PDFs (volume-mounted)
└── frontend/
    ├── Dockerfile
    └── src/
        ├── pages/
        │   ├── index.tsx       # Landing page
        │   ├── login.tsx
        │   ├── signup.tsx
        │   └── chat.tsx        # Main chat interface
        ├── components/
        │   ├── ChatBox.tsx     # Message thread + RAG query
        │   ├── PDFUpload.tsx   # Document manager (upload + clear all)
        │   ├── Header.tsx
        │   └── ...
        └── context/
            └── AuthContext.tsx
```

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/` | Create account |
| POST | `/auth/token` | Login — returns JWT |
| GET | `/chats/` | List user's chats |
| POST | `/chats/` | Create new chat |
| DELETE | `/chats/{id}` | Delete a chat |
| GET | `/chats/{id}/messages` | Get chat history |
| POST | `/chats/{id}/ask` | Send a question (RAG) |
| POST | `/documents/upload` | Upload PDFs |
| GET | `/documents/` | List uploaded documents |
| DELETE | `/documents/all` | Clear all documents and vector store |

Full interactive docs available at `http://localhost:8000/docs` when running.

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

*Built by Minh Dao*
