from datetime import datetime
from typing import List
from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from models import Document
from deps import db_dependency, user_dependency
from modules.load_vectorstore import load_vectorstore, clear_user_vectorstore
from utils.load_config import load_config
from logger import logger

router = APIRouter(prefix='/documents', tags=['documents'])

_, embed_dep = load_config()


class DocumentOut(BaseModel):
    id: int
    filename: str
    uploaded_at: datetime

    model_config = {"from_attributes": True}


@router.post("/upload", response_model=list[DocumentOut], status_code=201)
async def upload_documents(
    db: db_dependency,
    user: user_dependency,
    files: List[UploadFile] = File(...),
):
    try:
        filenames = load_vectorstore(files, embed_dep, user['id'])
    except Exception:
        logger.exception("Error building vectorstore")
        raise HTTPException(status_code=500, detail="Failed to process documents")

    new_docs = []
    for name in filenames:
        doc = Document(user_id=user['id'], filename=name)
        db.add(doc)
        new_docs.append(doc)

    db.commit()
    for doc in new_docs:
        db.refresh(doc)

    return new_docs


@router.get("/", response_model=list[DocumentOut])
async def list_documents(db: db_dependency, user: user_dependency):
    return (
        db.query(Document)
        .filter(Document.user_id == user['id'])
        .order_by(Document.uploaded_at.desc())
        .all()
    )


@router.delete("/all", status_code=204)
async def clear_all_documents(db: db_dependency, user: user_dependency):
    db.query(Document).filter(Document.user_id == user['id']).delete()
    db.commit()
    clear_user_vectorstore(user['id'])
