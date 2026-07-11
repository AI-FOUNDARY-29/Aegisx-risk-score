import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from database import Base
from main import app, get_settings, get_db
import models.db_models

from sqlalchemy.pool import StaticPool

# Setup an in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override the database dependency
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    # Create the tables before each test
    Base.metadata.create_all(bind=engine)
    yield
    # Drop the tables after each test
    Base.metadata.drop_all(bind=engine)

def test_register_user():
    response = client.post(
        "/api/auth/register",
        json={"username": "testuser", "password": "testpassword"}
    )
    assert response.status_code == 200
    assert response.json() == {"message": "User created successfully"}

def test_register_duplicate_user():
    # First registration
    client.post(
        "/api/auth/register",
        json={"username": "testuser", "password": "testpassword"}
    )
    # Second registration should fail
    response = client.post(
        "/api/auth/register",
        json={"username": "testuser", "password": "testpassword"}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Username already registered"

def test_login_user():
    # Register first
    client.post(
        "/api/auth/register",
        json={"username": "testuser", "password": "testpassword"}
    )
    # Login
    response = client.post(
        "/api/auth/login",
        data={"username": "testuser", "password": "testpassword"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_get_settings():
    # Register & Login to get token
    client.post("/api/auth/register", json={"username": "testuser", "password": "testpassword"})
    login_res = client.post("/api/auth/login", data={"username": "testuser", "password": "testpassword"})
    token = login_res.json()["access_token"]
    
    response = client.get(
        "/api/settings",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    # Check default settings (from SystemSettings model defaults)
    assert "strict_mode" in data
    assert "auto_block" in data
    assert "alert_threshold" in data

def test_update_settings():
    client.post("/api/auth/register", json={"username": "testuser", "password": "testpassword"})
    login_res = client.post("/api/auth/login", data={"username": "testuser", "password": "testpassword"})
    token = login_res.json()["access_token"]
    
    # Update settings
    update_data = {
        "strict_mode": True,
        "auto_block": False,
        "alert_threshold": 80
    }
    update_res = client.put(
        "/api/settings",
        headers={"Authorization": f"Bearer {token}"},
        json=update_data
    )
    assert update_res.status_code == 200
    assert update_res.json() == {"message": "Settings updated"}
    
    # Verify update
    get_res = client.get("/api/settings", headers={"Authorization": f"Bearer {token}"})
    assert get_res.json() == update_data
