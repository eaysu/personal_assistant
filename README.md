# 🤖 Personal Assistant Chatbot

AI-powered personal assistant chatbot for Enes Aysu, built with FastAPI backend and modern web frontend. Helps visitors learn about Enes's professional background, skills, and experience.

## ✨ Features

- 🤖 **AI-Powered**: Uses Google Gemini 2.5 Flash for intelligent responses
- 🎨 **Modern UI**: Dark blue theme with gradient transitions and glass effects
- 📱 **Responsive Design**: Optimized for mobile and desktop
- 💬 **Professional Assistant**: Represents Enes to visitors (employers, colleagues, etc.)
- 📄 **Context-Aware**: Uses complete personal data for accurate responses
- ⚡ **Fast Performance**: High-performance FastAPI backend
- 🐳 **Docker Ready**: Containerized for easy deployment
- 🚀 **Railway Deploy**: Configured for Railway platform deployment

## 📁 Project Structure

```
personal_assistant/
├── main.py              # FastAPI main application
├── llm_engine.py        # Gemini API integration engine
├── requirements.txt     # Python dependencies
├── user_data.txt        # Enes's personal information
├── Dockerfile           # Docker container configuration
├── railway.json         # Railway deployment configuration
├── static/              # Frontend files
│   ├── index.html       # Main HTML file
│   ├── style.css        # CSS styles
│   └── app.js           # JavaScript application
└── README.md            # This file
```

## 🚀 Installation and Setup

### 1. Requirements

- Python 3.11+
- Google Gemini API Key
- pip (Python package manager)

### 2. Installation

```bash
# Navigate to project directory
cd personal_assistant

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the API key

### 4. Set Environment Variable

```bash
# Set the API key as environment variable
export GEMINI_API_KEY=your_api_key_here

# For Windows:
set GEMINI_API_KEY=your_api_key_here
```

### 5. Run the Application

```bash
# Start the application
python main.py
```

The application will be available at `http://localhost:8000`.

## 🎯 Usage

After starting the application, visit `http://localhost:8000` in your browser.

The chatbot serves as Enes Aysu's professional assistant, helping visitors learn about his background. You can ask questions in English:

### 💬 Example Questions:

- "What is Enes's professional experience?"
- "Tell me about his education background"
- "What programming languages does he know?"
- "What projects has he worked on?"
- "What are his career goals?"
- "What are his technical skills?"
- "What is his experience with AI and machine learning?"

The AI assistant will provide detailed, accurate answers based on Enes's comprehensive professional profile!

## 🚀 Deployment

### Option 1: Railway (Recommended)

This project is configured for Railway deployment with Docker.

1. **Prepare Repository:**
   ```bash
   # Push your code to GitHub
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Railway:**
   - Visit [Railway](https://railway.app)
   - Connect your GitHub repository
   - Set environment variable: `GEMINI_API_KEY=your_api_key_here`
   - Railway will automatically detect the Dockerfile and deploy

3. **Access your app:**
   - Railway will provide a URL like: `https://your-app.railway.app`

### Option 2: Docker Local

```bash
# Build the Docker image
docker build -t personal-assistant .

# Run the container
docker run -p 8000:8000 -e GEMINI_API_KEY=your_api_key_here personal-assistant
```

### Option 3: Other Platforms

The application can be deployed to any platform that supports:
- Python 3.11+
- Environment variables
- Port configuration

Platforms like Render, Heroku, or DigitalOcean App Platform work well.


## 🔧 API Endpoints

### `GET /`
Serves the main frontend application

### `GET /health`
Health check endpoint
```json
{
  "status": "healthy",
  "message": "Personal Assistant Chatbot is running",
  "llm_status": true
}
```

### `POST /chat`
Main chat endpoint for interacting with the AI assistant
```json
{
  "message": "What is Enes's professional experience?"
}
```

Response:
```json
{
  "response": "Enes Aysu is an AI Engineer at NeviTech with experience in...",
  "status": "success"
}
```

### `GET /user-data`
Returns Enes's personal information data
```json
{
  "user_data": "# Personal Assistant - User Information...",
  "status": "success"
}
```

### `GET /llm-status`
Get detailed LLM engine status for debugging
```json
{
  "llm_status": {...},
  "backend": "gemini",
  "model": "gemini-2.5-flash",
  "ready": true
}
```

### `POST /test-llm`
Test endpoint for LLM functionality

## �️ Development

### Local Development

```bash
# Run in development mode with auto-reload
uvicorn main:app --reload --log-level debug --host 0.0.0.0 --port 8000
```

### Adding New Features

1. **Backend**: Add new endpoints in `main.py`
2. **LLM Engine**: Modify `llm_engine.py` for AI functionality
3. **Frontend**: Update `static/app.js` for new UI features
4. **Styling**: Enhance `static/style.css` for visual improvements

### Environment Variables

- `GEMINI_API_KEY`: Required for AI functionality
- `PORT`: Application port (default: 8000)

## 🔒 Security Features

- ✅ CORS protection enabled
- ✅ Input validation with Pydantic
- ✅ Environment variable for API key
- ✅ Professional data handling
- ✅ Secure API communication

## 🐛 Troubleshooting

### Gemini API Issues
```bash
# Check if API key is set
echo $GEMINI_API_KEY

# Verify API key validity at Google AI Studio
# https://makersuite.google.com/app/apikey
```

## 📝 License

MIT License - Free for personal and commercial use.

---

## 🎯 About This Project

This personal assistant chatbot serves as Enes Aysu's professional representative, helping visitors learn about his background, skills, and experience. Built with modern web technologies and powered by Google's Gemini AI, it provides accurate, contextual responses about Enes's professional journey.

**Perfect for**: Portfolio websites, professional networking, recruitment processes, and academic applications.
