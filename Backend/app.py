from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
import os
from src.helper import download_hugging_face_embeddings
from dotenv import load_dotenv 
from langchain_pinecone import PineconeVectorStore
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
import os
from src.prompt import *
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()

PINECONE_API_KEY=os.environ.get('PINECONE_API_KEY')
GEMINI_API_KEY=os.environ.get('GEMINI_API_KEY')

os.environ["PINECONE_API_KEY"] = PINECONE_API_KEY
os.environ["GEMINI_API_KEY"] = GEMINI_API_KEY

embeddings = download_hugging_face_embeddings()

index_name = "drchat"

# Embed each chunk and upsert the embeddings into your Pinecone index.
docsearch = PineconeVectorStore.from_existing_index(
    index_name=index_name,
    embedding=embeddings
)

retriever = docsearch.as_retriever(search_type="similarity", search_kwargs={"k":3})

llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0.4,
    max_output_tokens=500,
    google_api_key=os.environ["GEMINI_API_KEY"]
)

prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    ("human", "{input}"),
])

# Create chain
question_answer_chain = create_stuff_documents_chain(llm, prompt)
rag_chain = create_retrieval_chain(retriever, question_answer_chain)

# sample check
# response = rag_chain.invoke({"input": "what is acne?"})
# print(response["answer"])


# Load environment variables
load_dotenv()

# FastAPI app
app = FastAPI()

# CORS (allow frontend to access)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class QueryRequest(BaseModel):
    query: str

@app.post("/chat")
async def chat_endpoint(request: QueryRequest):
    query = request.query
    response = rag_chain.invoke({"input": query})
    return {"response": response["answer"]}