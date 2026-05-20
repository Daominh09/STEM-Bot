from datetime import datetime
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from models import Chat, Message
from deps import db_dependency, user_dependency
from logger import logger
import app_state

router = APIRouter(prefix='/chats', tags=['chats'])


# ── Pydantic schemas ──────────────────────────────────────────────────────────

class ChatOut(BaseModel):
    id: int
    user_id: int
    title: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class MessageOut(BaseModel):
    id: int
    chat_id: int
    sender: str
    content: str
    created_at: datetime

    model_config = {"from_attributes": True}


class AskRequest(BaseModel):
    question: str


class AskResponse(BaseModel):
    response: str
    sources: list[str]
    message_id: int


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/", response_model=ChatOut)
async def create_chat(db: db_dependency, user: user_dependency):
    chat = Chat(user_id=user['id'], title='New Chat')
    db.add(chat)
    db.commit()
    db.refresh(chat)
    return chat


@router.get("/", response_model=list[ChatOut])
async def list_chats(db: db_dependency, user: user_dependency):
    return (
        db.query(Chat)
        .filter(Chat.user_id == user['id'])
        .order_by(Chat.created_at.desc())
        .all()
    )


@router.delete("/{chat_id}", status_code=204)
async def delete_chat(chat_id: int, db: db_dependency, user: user_dependency):
    chat = db.query(Chat).filter(Chat.id == chat_id, Chat.user_id == user['id']).first()
    if not chat:
        raise HTTPException(status_code=404, detail='Chat not found')
    db.delete(chat)
    db.commit()


@router.get("/{chat_id}/messages", response_model=list[MessageOut])
async def get_messages(chat_id: int, db: db_dependency, user: user_dependency):
    chat = db.query(Chat).filter(Chat.id == chat_id, Chat.user_id == user['id']).first()
    if not chat:
        raise HTTPException(status_code=404, detail='Chat not found')
    return chat.messages


@router.post("/{chat_id}/ask", response_model=AskResponse)
async def ask(chat_id: int, body: AskRequest, db: db_dependency, user: user_dependency):
    chat = db.query(Chat).filter(Chat.id == chat_id, Chat.user_id == user['id']).first()
    if not chat:
        raise HTTPException(status_code=404, detail='Chat not found')

    # Save user message
    user_msg = Message(chat_id=chat_id, sender='user', content=body.question)
    db.add(user_msg)

    # Auto-title from first message
    if not chat.title or chat.title == 'New Chat':
        chat.title = body.question[:60]

    db.commit()

    # Query RAG chatbot
    try:
        logger.info(f"[chat {chat_id}] query: {body.question}")
        result = app_state.chatbot.query_chain(body.question, user['id'])
        bot_content = result['response']
        sources = result.get('sources', [])
    except Exception:
        logger.exception(f"[chat {chat_id}] chatbot error")
        bot_content = "I'm sorry, I couldn't process your question. Make sure documents have been uploaded."
        sources = []

    # Save bot response
    bot_msg = Message(chat_id=chat_id, sender='bot', content=bot_content)
    db.add(bot_msg)
    db.commit()
    db.refresh(bot_msg)

    return AskResponse(response=bot_content, sources=sources, message_id=bot_msg.id)
