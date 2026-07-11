from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel
import random

from database import engine, SessionLocal, Base
from models.db_models import AnalysisLog, User, SystemSettings
from models.phishing_detector import PhishingDetector
from models.deepfake_analyzer import DeepfakeAnalyzer
import auth

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AegisX Threat Detection API")

# Allow CORS for dashboard and extension
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Ensure default settings exist
def get_settings(db: Session):
    settings = db.query(SystemSettings).first()
    if not settings:
        settings = SystemSettings()
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

# --- Pydantic Models ---
class TextPayload(BaseModel):
    text: str

class UrlPayload(BaseModel):
    url: str

class ImagePayload(BaseModel):
    image_url: str

class UserCreate(BaseModel):
    username: str
    password: str

class SettingsUpdate(BaseModel):
    strict_mode: bool
    auto_block: bool
    alert_threshold: int

# --- Auth Endpoints ---
@app.post("/api/auth/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = auth.get_password_hash(user.password)
    new_user = User(username=user.username, password_hash=hashed_password)
    db.add(new_user)
    db.commit()
    return {"message": "User created successfully"}

@app.post("/api/auth/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

# --- Analysis Endpoints ---
@app.post("/api/analyze/text")
async def analyze_text(payload: TextPayload, db: Session = Depends(get_db)):
    settings = get_settings(db)
    result = PhishingDetector.analyze_text(payload.text)
    
    # Apply strict mode logic (example override)
    if settings.strict_mode and result.get("risk_score", 0) > settings.alert_threshold:
        result["is_threat"] = True

    log_entry = AnalysisLog(
        content_type="text",
        content=payload.text,
        is_threat=result.get("is_threat"),
        risk_score=result.get("risk_score"),
        threat_type=result.get("threat_type"),
        message=result.get("message")
    )
    db.add(log_entry)
    db.commit()
    return result

@app.post("/api/analyze/url")
async def analyze_url(payload: UrlPayload, db: Session = Depends(get_db)):
    settings = get_settings(db)
    result = PhishingDetector.analyze_url(payload.url)
    
    if settings.strict_mode and result.get("risk_score", 0) > settings.alert_threshold:
        result["is_threat"] = True

    log_entry = AnalysisLog(
        content_type="url",
        content=payload.url,
        is_threat=result.get("is_threat"),
        risk_score=result.get("risk_score"),
        threat_type=result.get("threat_type"),
        message=result.get("message")
    )
    db.add(log_entry)
    db.commit()
    return result

@app.post("/api/analyze/image")
async def analyze_image(payload: ImagePayload, db: Session = Depends(get_db)):
    settings = get_settings(db)
    result = DeepfakeAnalyzer.analyze_image(payload.image_url)
    
    if settings.strict_mode and result.get("risk_score", 0) > settings.alert_threshold:
        result["is_threat"] = True

    log_entry = AnalysisLog(
        content_type="image",
        content=payload.image_url,
        is_threat=result.get("is_threat"),
        risk_score=result.get("risk_score"),
        threat_type=result.get("threat_type", "deepfake"),
        message=result.get("message")
    )
    db.add(log_entry)
    db.commit()
    return result

# --- Dashboard & Settings (Protected) ---
@app.get("/api/history")
async def get_history(db: Session = Depends(get_db), username: str = Depends(auth.verify_token)):
    logs = db.query(AnalysisLog).order_by(AnalysisLog.timestamp.desc()).limit(20).all()
    formatted_logs = []
    for log in logs:
        if not log.is_threat:
            t_type = "safe"
        elif log.risk_score and log.risk_score > 75:
            t_type = "danger"
        else:
            t_type = "warning"
            
        formatted_logs.append({
            "id": log.id,
            "type": t_type,
            "title": "Threat Detected" if log.is_threat else "Scan Clean",
            "desc": log.message,
            "time": log.timestamp.strftime("%H:%M:%S") if log.timestamp else ""
        })
    return formatted_logs

@app.get("/api/dashboard/stats")
async def get_dashboard_stats(db: Session = Depends(get_db), username: str = Depends(auth.verify_token)):
    threats_blocked_today = db.query(AnalysisLog).filter(AnalysisLog.is_threat == True).count()
    return {
        "digital_twin_risk_score": random.randint(15, 45),
        "threats_blocked_today": threats_blocked_today,
        "dark_web_leaks_found": random.randint(0, 2),
        "active_protections": 4
    }

@app.get("/api/settings")
async def get_api_settings(db: Session = Depends(get_db), username: str = Depends(auth.verify_token)):
    settings = get_settings(db)
    return {
        "strict_mode": settings.strict_mode,
        "auto_block": settings.auto_block,
        "alert_threshold": settings.alert_threshold
    }

@app.put("/api/settings")
async def update_api_settings(update: SettingsUpdate, db: Session = Depends(get_db), username: str = Depends(auth.verify_token)):
    settings = get_settings(db)
    settings.strict_mode = update.strict_mode
    settings.auto_block = update.auto_block
    settings.alert_threshold = update.alert_threshold
    db.commit()
    return {"message": "Settings updated"}

if __name__ == "__main__":
    # pyrefly: ignore [missing-import]
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
