import os
import shutil
import openai
from pathlib import Path
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS


def _user_paths(user_id: int):
    persist_dir = f"../vectorstore/{user_id}/faiss_db"
    upload_dir = f"../data/uploads/{user_id}"
    return persist_dir, upload_dir


def load_vectorstore(uploaded_files, deployment_name, user_id: int) -> list[str]:
    persist_dir, upload_dir = _user_paths(user_id)
    os.makedirs(upload_dir, exist_ok=True)
    os.makedirs(persist_dir, exist_ok=True)

    file_paths = []
    filenames = []
    for file in uploaded_files:
        save_path = Path(upload_dir) / file.filename
        with open(save_path, "wb") as f:
            f.write(file.file.read())
        file_paths.append(str(save_path))
        filenames.append(file.filename)

    docs = []
    for path in file_paths:
        loader = PyPDFLoader(path)
        docs.extend(loader.load())

    splitter = RecursiveCharacterTextSplitter(chunk_size=512, chunk_overlap=50)
    chunks = splitter.split_documents(docs)

    embeddings = OpenAIEmbeddings(
        deployment=deployment_name,
        chunk_size=1,
        openai_api_key=openai.api_key,
        openai_api_base=openai.api_base,
        openai_api_type=openai.api_type,
        openai_api_version=openai.api_version,
    )

    if os.path.exists(persist_dir) and os.listdir(persist_dir):
        vectorstore = FAISS.load_local(persist_dir, embeddings)
        vectorstore.add_documents(chunks)
    else:
        vectorstore = FAISS.from_documents(documents=chunks, embedding=embeddings)
    vectorstore.save_local(persist_dir)

    return filenames


def clear_user_vectorstore(user_id: int):
    persist_dir, upload_dir = _user_paths(user_id)
    if os.path.exists(persist_dir):
        shutil.rmtree(persist_dir)
    if os.path.exists(upload_dir):
        shutil.rmtree(upload_dir)