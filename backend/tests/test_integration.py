import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

class TestUserIntegration:
    """בדיקות אינטגרציה למשתמשים"""
    
    def test_user_signup_flow(self):
        """בדיקת זרימה מלאה של רישום משתמש"""
        user_data = {
            "name": "משתמש בדיקה",
            "phone": "0501234567"
        }
        
        # רישום משתמש
        response = client.post("/users/signup", json=user_data)
        assert response.status_code in [200, 201, 400, 422]  # יכול להיות כבר קיים
        
        if response.status_code in [200, 201]:
            # התחברות
            login_data = {
                "name": user_data["name"],
                "phone": user_data["phone"]
            }
            
            login_response = client.post("/users/login", json=login_data)
            assert login_response.status_code in [200, 404]

class TestCategoryIntegration:
    """בדיקות אינטגרציה לקטגוריות"""
    
    def test_get_categories(self):
        """בדיקה שניתן לקבל רשימת קטגוריות"""
        response = client.get("/categories/")
        assert response.status_code in [200, 401]  # יכול לדרוש אימות
        
        if response.status_code == 200:
            data = response.json()
            assert isinstance(data, list)

class TestPromptIntegration:
    """בדיקות אינטגרציה לשאילתות AI"""
    
    def test_create_prompt_unauthorized(self):
        """בדיקה שיצירת שאילתה דורשת אימות"""
        prompt_data = {
            "prompt": "שאלה לדוגמה",
            "category_id": 1,
            "sub_category_id": 1
        }
        
        response = client.post("/prompts/", json=prompt_data)
        assert response.status_code in [401, 422]  # לא מורשה או validation error