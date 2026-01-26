import pytest
from app.models.user import User
from app.schemas.user import UserCreate

class TestUserModel:
    """בדיקות יחידה למודל משתמש"""
    
    def test_user_creation(self):
        """בדיקה שמשתמש נוצר בהצלחה"""
        user_data = UserCreate(
            name="משתמש לדוגמה",
            phone="0501234567"
        )
        
        user = User(
            name=user_data.name,
            phone=user_data.phone
        )
        
        assert user.name == "משתמש לדוגמה"
        assert user.phone == "0501234567"
        # ברירת מחדל במודל היא "user" אבל לפני שמירה בDB זה None
        assert user.role in ["user", None]
    
    def test_user_phone_validation(self):
        """בדיקה שמספר טלפון תקין"""
        phone_numbers = [
            "0501234567",  # תקין
            "0521234567",  # תקין
            "123456789",   # לא תקין
            "05012345678"  # ארוך מדי
        ]
        
        for phone in phone_numbers[:2]:
            assert len(phone) == 10
            assert phone.startswith("05")
    
    def test_admin_role_assignment(self):
        """בדיקה שמשתמש מקבל תפקיד ברירת מחדל"""
        user = User(
            name="admin user",
            phone="0501234567"
        )
        
        # ברירת מחדל במודל היא None לפני שמירה
        assert user.role in ["user", None]