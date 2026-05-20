#!/usr/bin/env python3
import sys
import openai
from utils.load_config import load_config
from argparse import ArgumentParser
from openai.error import InvalidRequestError
from langchain.document_loaders import DirectoryLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS


def create_faiss_index(
    pdf_folder: str,
    index_folder: str,
    deployment_name: str,
    chunk_size: int = 512,
    chunk_overlap: int = 50,
) -> FAISS:
    print(f"Loading PDFs from '{pdf_folder}'...")
    loader = DirectoryLoader(pdf_folder, glob="*.pdf", loader_cls=PyPDFLoader)
    docs = loader.load()
    print(f"Loaded {len(docs)} documents.")

    print(f"Splitting documents into chunks (size={chunk_size}, overlap={chunk_overlap})...")
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
    )
    chunks = splitter.split_documents(docs)
    print(f"Generated {len(chunks)} chunks.")

    print(f"Initializing embeddings with deployment '{deployment_name}'...")
    embeddings = OpenAIEmbeddings(
        deployment=deployment_name,
        chunk_size=1,
        openai_api_key=openai.api_key,
        openai_api_base=openai.api_base,
        openai_api_type=openai.api_type,
        openai_api_version=openai.api_version
    )

    print("Building FAISS index from chunks...")
    try:
        db = FAISS.from_documents(chunks, embeddings)
        print(f"Built FAISS index with {db.index.ntotal} vectors.")
    except InvalidRequestError as e:
        print(
            f"InvalidRequestError when embedding with deployment '{deployment_name}': {e}",
            file=sys.stderr,
        )
        print(
            "Please verify that the deployment name matches exactly and is in a 'Succeeded' state.",
            file=sys.stderr,
        )
        sys.exit(1)

    print(f"Saving FAISS index to '{index_folder}'...")
    db.save_local(index_folder)
    print("FAISS index saved.")
    return db


def main():
    _, deployment = load_config()

    parser = ArgumentParser(description="Build FAISS index from PDFs.")
    parser.add_argument("--pdf-dir",      default="data",                  help="Folder containing PDF files")
    parser.add_argument("--index-dir",    default="vectorstore/faiss_db", help="Output FAISS folder")
    parser.add_argument("--chunk-size",   type=int, default=512)
    parser.add_argument("--chunk-overlap",type=int, default=50)
    args = parser.parse_args()

    print(f"Indexing PDFs from '{args.pdf_dir}' into '{args.index_dir}' using deployment '{deployment}'...")
    db = create_faiss_index(
        pdf_folder      = args.pdf_dir,
        index_folder    = args.index_dir,
        deployment_name = deployment,
        chunk_size      = args.chunk_size,
        chunk_overlap   = args.chunk_overlap,
    )
    print(f"Done: {db.index.ntotal} vectors saved to '{args.index_dir}'.")


if __name__ == "__main__":
    main()
