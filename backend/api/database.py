import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

URL_DATABASE = os.getenv('DATABASE_URL', 'postgresql://postgres:1Qa2ws3ed4rf5tg@127.0.0.1:5432/ChatbotApp')

engine = create_engine(URL_DATABASE)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()