from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random
from models.phishing_detector import PhishingDetector
from models.deepfake_analyzer import DeepfakeAnalyzer

app = FastAPI(title="AegisX Threat Detection API")

# Allow CORS for dashboard and extension
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextPayload(BaseModel):
    text: str

class UrlPayload(BaseModel):
    url: str

class ImagePayload(BaseModel):
    image_url: str

# Mock Phishing Detection Endpoint
@app.post("/api/analyze/text")
async def analyze_text(payload: TextPayload):
    return PhishingDetector.analyze_text(payload.text)

# Mock URL Scan Endpoint
@app.post("/api/analyze/url")
async def analyze_url(payload: UrlPayload):
    return PhishingDetector.analyze_url(payload.url)

# Mock Deepfake Detection Endpoint
@app.post("/api/analyze/media")
async def analyze_media(payload: ImagePayload):
    return DeepfakeAnalyzer.analyze_media(payload.image_url)

# Mock Dark Web Monitoring Stats
@app.get("/api/dashboard/stats")
async def get_dashboard_stats():
    return {
        "digital_twin_risk_score": random.randint(15, 45),
        "threats_blocked_today": random.randint(5, 20),
        "dark_web_leaks_found": random.randint(0, 2),
        "active_protections": 4
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
