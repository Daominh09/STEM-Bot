from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, chats, documents
from modules.chatbot import RAGChatbot
from utils.load_config import load_config
from logger import logger
from database import Base, engine
import app_state


chat_dep, embed_dep = load_config()
app_state.chatbot = RAGChatbot(chat_dep, embed_dep)

app = FastAPI()
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

@app.middleware("http")
async def catch_exception_middleware(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as exc:
        logger.exception("UNHANDLE EXCEPTION")
        return JSONResponse(status_code=500, content={"error": str(exc)})

@app.get("/")
def health_check() -> str:
    return 'Health check complete'

app.include_router(auth.router)
app.include_router(chats.router)
app.include_router(documents.router)
