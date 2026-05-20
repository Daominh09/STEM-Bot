#!/usr/bin/env python3
import openai
from logger import logger
from argparse import ArgumentParser

from langchain.chat_models import AzureChatOpenAI
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS


class RAGChatbot:
    def __init__(self, chat_dep: str, embed_dep: str, top_k: int = 5):
        self.chat_dep = chat_dep
        self.embed_dep = embed_dep
        self.top_k = top_k

        self.llm = self._create_llm()
        self.prompt = self._create_prompt()

    def _create_llm(self) -> AzureChatOpenAI:
        return AzureChatOpenAI(
            deployment_name=self.chat_dep,
            openai_api_base=openai.api_base,
            openai_api_version=openai.api_version,
            openai_api_key=openai.api_key,
            openai_api_type=openai.api_type,
            temperature=0.0,
            streaming=False,
        )

    def _create_prompt(self) -> PromptTemplate:
        template = """Use the following context to answer the question. If you don't know, just say you don't know.
                      Context: {context} 
                      Question: {question}
                      Answer:
                   """
        return PromptTemplate(
            input_variables=["context", "question"],
            template=template
        )

    def _get_retriever(self, user_id: int):
        embeddings = OpenAIEmbeddings(
            deployment=self.embed_dep,
            chunk_size=1,
            openai_api_key=openai.api_key,
            openai_api_base=openai.api_base,
            openai_api_type=openai.api_type,
            openai_api_version=openai.api_version,
        )
        db = FAISS.load_local(f"../vectorstore/{user_id}/faiss_db", embeddings)
        return db.as_retriever(search_kwargs={"k": self.top_k})

    def get_chain(self, user_id: int):
        retriever = self._get_retriever(user_id)
        chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=retriever,
            return_source_documents=True,
            chain_type_kwargs={"prompt": self.prompt},
        )
        return chain

    def query_chain(self, user_input: str, user_id: int):
        chain = self.get_chain(user_id)
        try:
            logger.debug(f"Running chain for input: {user_input}")
            result = chain({"query": user_input})
            response = {
                "response": result["result"],
                "sources": [doc.metadata.get("source", "") for doc in result["source_documents"]],
            }
            logger.debug(f"Chain response: {response}")
            return response
        except Exception as e:
            logger.exception("Error in query_chain")
            raise


def main():
    from utils.load_config import load_config
    chat_dep, embed_dep = load_config()

    parser = ArgumentParser(description="Query your FAISS-backed RAG system")
    parser.add_argument("--query", "-q", type=str, required=True, help="The question to ask against the indexed documents")
    parser.add_argument("--top-k", type=int, default=5, help="Number of documents to retrieve for each query")
    args = parser.parse_args()

    chatbot = RAGChatbot(chat_dep, embed_dep, args.top_k)
    result = chatbot.run(args.query)

    print("\n=== ANSWER ===")
    print(result["result"])

    if docs := result.get("source_documents"):
        print("\n=== SOURCES ===")
        for doc in docs:
            src = doc.metadata.get("source", "<unknown>")
            print(f"- {src}")


if __name__ == "__main__":
    main()
