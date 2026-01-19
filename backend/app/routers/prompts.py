from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas import PromptCreate, PromptResponse
from app.services import learning_service
from app.repositories import prompt_repo

router = APIRouter(prefix="/prompts", tags=["Prompts"])

@router.post("/", response_model=PromptResponse)
def create_learning_session(prompt: PromptCreate, db: Session = Depends(get_db)):
    return learning_service.submit_prompt(db, prompt)

@router.get("/user/{user_id}", response_model=List[PromptResponse])
def read_user_history(user_id: int, db: Session = Depends(get_db)):
    return prompt_repo.get_prompts_by_user(db, user_id)