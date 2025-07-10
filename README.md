# STEM Chatbot

A full-stack web application that provides a STEM-focused chatbot experience. Built with a Next.js/React frontend and a Python FastAPI backend, it features user authentication, document ingestion, and semantic search using FAISS.

## Features
- **User Authentication**: Sign up, log in, and manage sessions securely.
- **Chatbot Interface**: Interact with a STEM-focused AI assistant.
- **Document Ingestion**: Upload and index documents for retrieval-augmented generation (RAG).
- **Semantic Search**: Uses FAISS for fast vector-based search.
- **Modern UI**: Responsive, clean interface built with Tailwind CSS.

## Tech Stack
- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: FastAPI, Python
- **Database**: (Specify your DB, e.g., SQLite, PostgreSQL)
- **Vector Store**: FAISS
- **Containerization**: Docker

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- Python 3.10+
- Docker (optional, for containerized deployment)

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. (Optional) Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the FastAPI server:
   ```bash
   uvicorn api.main:app --reload
   ```
   The API will be available at `http://localhost:8000`.

### Docker (Optional)
You can use Docker to run the backend:
```bash
cd backend
docker build -t stem-chatbot-backend .
docker run -p 8000:8000 stem-chatbot-backend
```

## Project Structure
```
backend/
  api/           # FastAPI app (main, models, routers)
  app/           # RAG, database, schemas
  data_ingest/   # Document ingestion scripts
  faiss_index/   # Vector store
frontend/
  src/           # React components, pages, context
  public/        # Static assets
```

## Customization
- Update environment variables and configuration as needed for your deployment.
- Extend the chatbot logic or add new features in the backend or frontend.

## License
MIT License

---

*Created by Minh Dao and contributors.*
