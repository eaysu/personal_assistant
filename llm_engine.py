import os
import logging
import asyncio
from typing import Optional, Dict, Any

# Try to import Gemini
try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class LLMEngine:
    """
    LLM Engine with Gemini API support only
    """
    
    def __init__(self):
        self.backend = None
        self.model = None
        self.gemini_model = None
        self.is_ready_flag = False
        
        # Initialize Gemini API
        self._initialize_llm()
    
    def _initialize_llm(self):
        """Initialize Gemini API only"""
        
        logger.info("🚀 Initializing LLM Engine - Gemini API only mode")
        
        # Try Gemini API
        if self._try_gemini():
            logger.info("✅ LLM Engine successfully initialized with Gemini API")
            return
        
        # Fallback to mock mode if Gemini fails
        logger.error("❌ Gemini API initialization failed")
        logger.warning("⚠️ Using mock responses as fallback")
        logger.info("💡 To use Gemini API:")
        logger.info("1. Get API key from: https://makersuite.google.com/app/apikey")
        logger.info("2. Set environment variable: GEMINI_API_KEY=your_key")
        logger.info("3. Restart the application")
        self.backend = "mock"
    
    def _try_gemini(self) -> bool:
        """Try to initialize Gemini API with detailed logging"""
        logger.info("🔍 Checking Gemini API availability...")
        
        if not GEMINI_AVAILABLE:
            logger.error("❌ Gemini library not installed")
            logger.info("💡 Install with: pip install google-generativeai")
            return False
        
        logger.info("✅ Gemini library is available")
        
        try:
            # Get API key from environment
            logger.info("🔑 Checking for GEMINI_API_KEY environment variable...")
            api_key = os.getenv('GEMINI_API_KEY')
            
            if not api_key:
                logger.error("❌ GEMINI_API_KEY not found in environment variables")
                logger.info("💡 Set it with: export GEMINI_API_KEY=your_key")
                return False
            
            logger.info(f"✅ API key found (length: {len(api_key)} chars)")
            
            # Configure Gemini
            logger.info("🔧 Configuring Gemini API...")
            genai.configure(api_key=api_key)
            
            # Initialize model
            logger.info("🤖 Initializing Gemini 2.5 Flash model...")
            self.gemini_model = genai.GenerativeModel('gemini-2.5-flash')
            
            # Test the connection
            logger.info("🧪 Testing Gemini API connection...")
            test_response = self.gemini_model.generate_content("Hello, respond with just 'OK'")
            
            if test_response and test_response.text:
                logger.info(f"✅ Gemini API test successful! Response: '{test_response.text.strip()}'")
                
                self.backend = "gemini"
                self.model = "gemini-2.5-flash"
                self.is_ready_flag = True
                
                logger.info("🎉 Gemini API fully initialized and ready!")
                return True
            else:
                logger.error("❌ Gemini API test failed - empty response")
                return False
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize Gemini API: {e}")
            logger.error(f"Error type: {type(e).__name__}")
            return False
    
    def is_ready(self) -> bool:
        """Check if LLM is ready"""
        return self.backend is not None and self.backend != "mock"
    
    async def generate_response(self, prompt: str) -> str:
        """Generate response using Gemini API only"""
        
        logger.info(f"📝 Generating response with backend: {self.backend}")
        
        if self.backend == "gemini":
            return await self._generate_gemini(prompt)
        else:
            logger.warning("⚠️ Gemini API not available, using mock response")
            return await self._generate_mock(prompt)
    
    async def _generate_gemini(self, prompt: str) -> str:
        """Generate response using Gemini API with detailed logging"""
        try:
            logger.info("🤖 Using Gemini API to generate response")
            logger.info(f"📤 Prompt length: {len(prompt)} characters")
            
            # Run in thread pool to avoid blocking
            loop = asyncio.get_event_loop()
            
            logger.info("⏳ Sending request to Gemini API...")
            response = await loop.run_in_executor(
                None,
                lambda: self.gemini_model.generate_content(prompt)
            )
            
            if response and response.text:
                generated_text = response.text.strip()
                logger.info(f"✅ Gemini API response received!")
                logger.info(f"📥 Response length: {len(generated_text)} characters")
                logger.info(f"📄 Response preview: {generated_text[:100]}...")
                
                return generated_text
            else:
                logger.error("❌ Gemini API returned empty response")
                return "I apologize, I couldn't generate a response. Please try again."
            
        except Exception as e:
            logger.error(f"❌ Gemini generation error: {e}")
            logger.error(f"Error type: {type(e).__name__}")
            return "I apologize, I'm experiencing technical difficulties. Please try again."
    
    async def _generate_mock(self, prompt: str) -> str:
        """Generate mock response when Gemini API is not available"""
        logger.info("🎭 Using mock response generator")
        await asyncio.sleep(1)  # Simulate processing time
        
        # Simple keyword-based responses in English
        prompt_lower = prompt.lower()
        
        if "hello" in prompt_lower or "hi" in prompt_lower:
            return "Hello! I'm Enes Aysu's personal assistant. How can I help you today?"
        elif "experience" in prompt_lower or "work" in prompt_lower:
            return "Enes is an AI Engineer at NeviTech, working on LLM platforms, OCR systems, and speaker recognition. He has experience in computer vision and industrial automation."
        elif "education" in prompt_lower or "university" in prompt_lower:
            return "Enes graduated from Gebze Technical University with a Computer Engineering degree. He's planning to pursue an AI Master's program at FAU."
        elif "skills" in prompt_lower or "programming" in prompt_lower:
            return "Enes is skilled in Python, AI/ML frameworks like PyTorch and TensorFlow, NLP tools, computer vision, and web development with FastAPI and React."
        elif "projects" in prompt_lower:
            return "Enes has worked on manipulative social media detection, financial document Q&A systems, and various AI projects involving RAG and LLM integration."
        elif "thank" in prompt_lower:
            return "You're welcome! Is there anything else you'd like to know about Enes?"
        else:
            return f"I understand you're asking about '{prompt[:50]}...'. I'm currently in demo mode. Please set up Gemini API for full functionality by setting GEMINI_API_KEY environment variable."
    
    def get_status(self) -> dict:
        """Get current LLM status"""
        return {
            "backend": self.backend,
            "model": self.model,
            "ready": self.is_ready(),
            "gemini_available": GEMINI_AVAILABLE
        }
