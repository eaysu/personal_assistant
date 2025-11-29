from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import uvicorn
import logging
import re
import os
from llm_engine import LLMEngine

app = FastAPI(title="Personal Assistant Chatbot", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Initialize LLM
llm_engine = LLMEngine()


class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    status: str

@app.get("/")
async def serve_frontend():
    """Serve the main frontend page"""
    return FileResponse("static/index.html")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "message": "Personal Assistant Chatbot is running",
        "llm_status": llm_engine.is_ready()
    }


@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """Main chat endpoint with direct user data context"""
    try:
        # Get full user data as context (no RAG needed with Gemini)
        user_data_file = os.path.join(os.path.dirname(__file__), "user_data.txt")
        try:
            with open(user_data_file, 'r', encoding='utf-8') as f:
                user_data = f.read()
        except FileNotFoundError:
            user_data = "No personal information available."
        
        # Create focused prompt for Gemini
        system_prompt = f"""You are Enes Aysu's personal assistant chatbot.

Here is Enes's complete personal information:

{user_data}

Based ONLY on the information provided above, please answer the following question about Enes in a friendly and informative way. If the information is not available in the provided data, please say so clearly.

Question: {request.message}

Answer:"""
        
        # Get response from Gemini
        response = await llm_engine.generate_response(system_prompt)
        
        return ChatResponse(
            response=response,
            status="success"
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")

@app.get("/user-data")
async def get_user_data():
    """Get current user data"""
    try:
        user_data_file = os.path.join(os.path.dirname(__file__), "user_data.txt")
        with open(user_data_file, 'r', encoding='utf-8') as f:
            user_data = f.read()
        return {"user_data": user_data, "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading user data: {str(e)}")

@app.get("/llm-status")
async def get_llm_status():
    """Get detailed LLM status for debugging"""
    try:
        status = llm_engine.get_status()
        return {
            "llm_status": status,
            "backend": llm_engine.backend,
            "model": llm_engine.model,
            "ready": llm_engine.is_ready()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting LLM status: {str(e)}")

@app.post("/test-llm")
async def test_llm():
    """Test LLM with a simple prompt"""
    try:
        test_prompt = "SYSTEM:\nSen Türkçe konuşan yardımcı bir asistansın.\n\nUSER:\nMerhaba, nasılsın?"
        response = await llm_engine.generate_response(test_prompt)
        return {
            "test_prompt": test_prompt,
            "response": response,
            "backend": llm_engine.backend,
            "model": llm_engine.model,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error testing LLM: {str(e)}")



if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
