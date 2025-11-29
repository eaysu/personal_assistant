# 🤖 Personal Assistant Chatbot

Modern, offline personal assistant chatbot application built with FastAPI + HTML/CSS/JS.

## ✨ Features

- 🔒 **Fully Offline**: No API key required
- 🎨 **Modern UI**: Dark blue theme, gradient transitions, glass effect
- 📱 **Responsive**: Mobile and desktop compatible
- 🧠 **Multi-LLM Support**: GPT4All, Ollama, llama-cpp-python
- 💾 **RAG System**: Chunks personal information by headers and performs intelligent search
- 🔍 **Smart Context**: Finds most relevant personal information based on queries and sends to LLM
- 🤖 **Smart Welcome**: Welcome message on application startup
- ⚡ **Fast**: High performance with FastAPI backend
- 🚀 **Easy Deploy**: Free deployment on platforms like Netlify, Vercel

## 📁 Proje Yapısı

```
personal_assistant/
├── main.py              # FastAPI ana uygulama
├── llm_engine.py        # LLM entegrasyon motoru
├── memory.py            # Bellek ve kullanıcı veri yönetimi
├── rag_system.py        # RAG (Retrieval-Augmented Generation) sistemi
├── requirements.txt     # Python bağımlılıkları
├── user_data.txt        # Kullanıcı kişisel bilgileri
├── models/              # LLM model dosyaları
├── static/              # Frontend dosyları
│   ├── index.html       # Ana HTML dosyası
│   ├── style.css        # CSS stilleri
│   └── app.js           # JavaScript uygulaması
├── start.sh             # Başlatma scripti
├── Procfile             # Heroku deploy dosyası
├── railway.json         # Railway deploy dosyası
└── README.md            # Bu dosya
```

## 🚀 Kurulum ve Çalıştırma

### 1. Gereksinimler

- Python 3.8+
- pip (Python paket yöneticisi)

### 2. Kurulum

```bash
# Proje dizinine git
cd personal_assistant

# Sanal ortam oluştur (önerilen)
python -m venv venv

# Sanal ortamı aktifleştir
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Bağımlılıkları yükle
pip install -r requirements.txt
```

### 3. LLM Backend Kurulumu

Bu uygulama **Ollama + Gemma 3 4B** modelini kullanacak şekilde optimize edilmiştir:

#### Ollama + Gemma 3 4B Kurulumu (Önerilen)
```bash
# 1. Ollama'yı yükle: https://ollama.ai/download
# macOS için:
curl -fsSL https://ollama.ai/install.sh | sh

# 2. Gemma 3 4B modelini indir (yaklaşık 2.6GB)
ollama pull gemma3:4b-it-q4_K_M

# 3. Ollama servisini başlat
ollama serve
```

#### Alternatif Seçenekler:

**Seçenek B: GPT4All**
```bash
pip install gpt4all
```

**Seçenek C: llama-cpp-python**
```bash
pip install llama-cpp-python
```

### 4. Uygulamayı Başlat

```bash
# Proje dizininde
python main.py

# Veya başlatma scriptini kullan (macOS/Linux)
./start.sh
```

Uygulama `http://localhost:8000` adresinde çalışacak.

## 🎯 Kullanım

Uygulama başlatıldıktan sonra tarayıcınızda `http://localhost:8000` adresine gidin.

The chatbot will automatically display a welcome message. You can then ask questions about Enes in English:

### 💬 Example Questions:

- "What is Enes's professional experience?"
- "Tell me about his education background"
- "What programming languages does he know?"
- "What projects has he worked on?"
- "What are his career goals?"
- "What are his technical skills?"

The chatbot will provide detailed answers based on Enes's personal information!

## 🚀 Deployment

### Option 1: Railway (Recommended)

1. **Get Gemini API Key:**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key

2. **Deploy to Railway:**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login to Railway
   railway login
   
   # Initialize project
   railway init
   
   # Set environment variable
   railway variables set GEMINI_API_KEY=your_api_key_here
   
   # Deploy
   railway up
   ```

3. **Access your app:**
   - Railway will provide a URL like: `https://your-app.railway.app`

### Option 2: Render

1. **Connect GitHub:**
   - Push code to GitHub
   - Connect repository to Render

2. **Set Environment Variables:**
   - `GEMINI_API_KEY`: Your Gemini API key
   - `PORT`: 8000 (auto-set by Render)

3. **Deploy:**
   - Render will automatically build and deploy

### Option 3: Local with Gemini API

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set environment variable:**
   ```bash
   export GEMINI_API_KEY=your_api_key_here
   ```

3. **Run:**
   ```bash
   python main.py
   ```

### Kişisel Bilgileri Düzenleme

`user_data.txt` dosyasını düzenleyerek asistanınızın sizi daha iyi tanımasını sağlayın:

```txt
# Kişisel Asistan - Kullanıcı Bilgileri

## Temel Bilgiler
- İsim: [Adınız]
- Yaş: [Yaşınız]
- Meslek: [Mesleğiniz]
- Konum: [Şehir/Ülke]

## İlgi Alanları
- [İlgi alanlarınız]
- [Hobiler]

## Tercihler
- Dil: Türkçe
- İletişim Tarzı: Samimi
- Zaman Dilimi: UTC+3
```

### Chat Özellikleri

- **Hızlı Eylemler**: Önceden tanımlı mesajlar için butonlar
- **Otomatik Scroll**: Yeni mesajlarda otomatik kaydırma
- **Karakter Sayacı**: 1000 karakter limiti ile
- **Typing Indicator**: Asistan yazarken animasyon
- **Ses Bildirimleri**: Yeni mesaj geldiğinde ses
- **Tema Seçenekleri**: Koyu/Açık tema
- **Responsive Tasarım**: Tüm cihazlarda uyumlu

## 🔧 API Endpoints

### `GET /`
Ana sayfa (frontend)

### `GET /health`
Sistem durumu kontrolü
```json
{
  "status": "healthy",
  "message": "Personal Assistant Chatbot is running",
  "llm_status": true
}
```

### `POST /chat`
Chat mesajı gönderme
```json
{
  "message": "Merhaba, nasılsın?"
}
```

Yanıt:
```json
{
  "response": "Merhaba! Ben iyiyim, teşekkür ederim. Size nasıl yardımcı olabilirim?",
  "status": "success"
}
```

### `GET /user-data`
Kullanıcı verilerini görüntüleme

## 🚀 Deploy Seçenekleri

### 1. Yerel Network
```bash
# Tüm IP'lerden erişim için
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 2. Heroku
```bash
# Procfile oluştur
echo "web: uvicorn main:app --host 0.0.0.0 --port \$PORT" > Procfile

# Git ile deploy
git init
git add .
git commit -m "Initial commit"
heroku create your-app-name
git push heroku main
```

### 3. Railway
```bash
# railway.json oluştur
echo '{"build": {"builder": "NIXPACKS"}, "deploy": {"startCommand": "uvicorn main:app --host 0.0.0.0 --port $PORT"}}' > railway.json
```

### 4. Render
- GitHub repo'yu Render'a bağla
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

## 🛠️ Geliştirme

### Yeni Özellik Ekleme

1. **Backend**: `main.py`'ye yeni endpoint ekle
2. **LLM**: `llm_engine.py`'de model ayarlarını düzenle
3. **Frontend**: `app.js`'de yeni fonksiyon ekle
4. **Stil**: `style.css`'de görsel düzenlemeler yap

### Debug Modu

```bash
# Debug modunda çalıştır
uvicorn main:app --reload --log-level debug
```

### Loglama

Loglar konsola yazdırılır. Dosyaya kaydetmek için:

```python
import logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)
```

## 🔒 Güvenlik

- ✅ CORS koruması aktif
- ✅ Input validation (Pydantic)
- ✅ Rate limiting (isteğe bağlı)
- ✅ Offline çalışma (API anahtarı yok)
- ✅ Kişisel veriler yerel

## 🐛 Sorun Giderme

### LLM Yüklenmiyor
```bash
# Model dosyalarını kontrol et
ls backend/models/

# GPT4All için
pip install --upgrade gpt4all

# Ollama için
ollama list
```

### Port Çakışması
```bash
# Farklı port kullan
uvicorn main:app --port 8001
```

### Bellek Sorunu
- Daha küçük model kullan
- `n_ctx` parametresini azalt
- RAM kullanımını kontrol et

## 📝 Lisans

MIT License - Kişisel ve ticari kullanım için ücretsiz.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📞 Destek

- 🐛 **Bug Report**: GitHub Issues
- 💡 **Feature Request**: GitHub Discussions
- 📧 **İletişim**: [email@example.com]

---

**Not**: Bu uygulama tamamen offline çalışır ve kişisel verileriniz hiçbir yere gönderilmez. Tüm işlemler yerel bilgisayarınızda gerçekleşir.
