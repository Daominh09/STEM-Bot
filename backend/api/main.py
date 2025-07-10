from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth
from database import Base, engine
app = FastAPI()
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

# # Pydantic schemas
# class UserBase(BaseModel):
#     name: Optional[str]
#     email: EmailStr
#     password: str

# class ChatBase(BaseModel):
#     user_id: int
#     # Optional: title or metadata
#     title: Optional[str] = None

# class MessageBase(BaseModel):
#     chat_id: int
#     sender: str  # 'user' or 'bot'
#     content: str

# def get_db():
#     db = Session()
#     try:
#         yield db
#     finally:
#         db.close()


# db_dependency = Annotated(Session, Depends(get_db))
# Health check endpoint
@app.get("/")
def health_check() -> str:
    return 'Health check complete'

app.include_router(auth.router)