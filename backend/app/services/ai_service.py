from openai import OpenAI
from app.core.config import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)

class AIService:
    def generate_lesson(self, category: str, sub_category: str, prompt: str) -> str:
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",  
                messages=[
                    {"role": "system", "content": "You are a helpful tutor generating concise lessons."},
                    {"role": "user", "content": f"Create a lesson about {sub_category} (in category {category}). The user asked: {prompt}"}
                ]
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Error generating lesson: {str(e)}"

ai_service = AIService()