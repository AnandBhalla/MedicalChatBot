# 🧠 Medical Chatbot 
### (RAG with Gemini + Pinecone)

An AI-powered Medical Chatbot built with:
- ⚡ **FastAPI** backend
- 🔗 **LangChain** + **Gemini (Google Generative AI)** + **Pinecone** for RAG
- 🧾 **HTML + JavaScript** frontend

---

### ✅ Prerequisites
- Pinecone API key
- Gemini API key (Google Generative AI)

### 🔐 Set Environment Variables (Backend/.env)
- PINECONE_API_KEY=your_pinecone_key
- GEMINI_API_KEY=your_gemini_key


---
---

- Connects to Pinecone to retrieve context
- Uses Gemini model to generate responses
- Sends user queries via HTTP POST to the FastAPI backend
- Displays AI-generated answers dynamically