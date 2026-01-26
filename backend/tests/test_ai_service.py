import pytest
from unittest.mock import Mock, patch
from app.services.ai_service import AIService

class TestAIService:
    """בדיקות יחידה לשירות הבינה המלאכותית"""
    
    def test_generate_lesson_success(self):
        """בדיקה שהשירות מחזיר תשובה תקינה"""
        ai_service = AIService()
        
        with patch('app.services.ai_service.client.chat.completions.create') as mock_openai:
            mock_response = Mock()
            mock_response.choices = [Mock()]
            mock_response.choices[0].message.content = "תשובה מבינה מלאכותית"
            mock_openai.return_value = mock_response
            
            result = ai_service.generate_lesson("מתמטיקה", "אלגברה", "שאלה לדוגמה")
            assert result == "תשובה מבינה מלאכותית"
    
    def test_generate_lesson_error_handling(self):
        """בדיקה שהשירות מטפל בשגיאות"""
        ai_service = AIService()
        
        with patch('app.services.ai_service.client.chat.completions.create') as mock_openai:
            mock_openai.side_effect = Exception("API Error")
            
            result = ai_service.generate_lesson("מתמטיקה", "אלגברה", "שאלה")
            assert "Error generating lesson" in result