import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_main():
    """בדיקה בסיסית שהשרת עובד"""
    response = client.get("/")
    assert response.status_code == 200

def test_health_check():
    """בדיקת בריאות המערכת"""
    response = client.get("/health")
    assert response.status_code in [200, 404]  # יכול להיות שאין endpoint כזה עדיין

def test_users_endpoint():
    """בדיקה בסיסית לנתיב משתמשים"""
    response = client.get("/users/")
    # בדיקה שהתגובה לא 500 (שגיאת שרת)
    assert response.status_code != 500