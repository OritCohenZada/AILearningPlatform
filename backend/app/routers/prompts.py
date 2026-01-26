from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from openai import OpenAI

from app.database import get_db
from app.schemas import PromptCreate, PromptResponse
from app import models
from app.repositories import prompt_repo
from app.core.config import settings

router = APIRouter(prefix="/prompts", tags=["Prompts"])


client = OpenAI(api_key=settings.OPENAI_API_KEY)

@router.post("/", response_model=PromptResponse)
def create_learning_session(prompt_req: PromptCreate, db: Session = Depends(get_db)):

    category = db.query(models.Category).filter(models.Category.id == prompt_req.category_id).first()
    sub_category = db.query(models.SubCategory).filter(models.SubCategory.id == prompt_req.sub_category_id).first()

    if not category or not sub_category:
        raise HTTPException(status_code=404, detail="Category or SubCategory not found")


    system_instruction = f"""
    You are an expert tutor specializing in '{category.name}' and specifically in '{sub_category.name}'.
    
    Rules:
    1. RELEVANCE: Ensure the question is about '{sub_category.name}'. If not, politely refuse.
    2. LENGTH: Keep your answer concise (max 100 words).
    3. TONE: Professional and helpful.
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": prompt_req.prompt}
            ],
            max_tokens=150,
            temperature=0.7
        )
        
        ai_answer = response.choices[0].message.content
        
        if not ai_answer or ai_answer.strip() == "":
            raise HTTPException(status_code=500, detail="AI returned empty response")

    except Exception as e:
        error_msg = str(e).lower()
        
        if "api key" in error_msg or "unauthorized" in error_msg:
            raise HTTPException(status_code=500, detail="AI service configuration error")
        elif "quota" in error_msg or "rate limit" in error_msg:
            raise HTTPException(status_code=500, detail="AI service temporarily unavailable due to high demand")
        elif "network" in error_msg or "connection" in error_msg:
            raise HTTPException(status_code=500, detail="Network connection error. Please try again")
        else:
            raise HTTPException(status_code=500, detail="AI service error. Please try again later")


    new_prompt = models.Prompt(
        user_id=prompt_req.user_id,
        category_id=prompt_req.category_id,
        sub_category_id=prompt_req.sub_category_id,
        prompt=prompt_req.prompt,
        response=ai_answer
    )
    
    db.add(new_prompt)
    db.commit()
    db.refresh(new_prompt)
    
    return new_prompt

@router.get("/user/{user_id}", response_model=List[PromptResponse])
def read_user_history(user_id: int, db: Session = Depends(get_db)):
    return prompt_repo.get_prompts_by_user(db, user_id)