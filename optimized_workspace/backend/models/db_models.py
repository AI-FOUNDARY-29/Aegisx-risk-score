from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime, timezone
from database import Base

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)

class SystemSettings(Base):
    __tablename__ = 'system_settings'
    id = Column(Integer, primary_key=True, index=True)
    strict_mode = Column(Boolean, default=False)
    auto_block = Column(Boolean, default=True)
    alert_threshold = Column(Integer, default=70)

class AnalysisLog(Base):
    __tablename__ = 'analysis_logs'
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    content_type = Column(String, index=True)
    content = Column(String)
    is_threat = Column(Boolean)
    risk_score = Column(Integer)
    threat_type = Column(String)
    message = Column(String)