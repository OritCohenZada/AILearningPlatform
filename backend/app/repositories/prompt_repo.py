from sqlalchemy.orm import Session
from app.models import Prompt

def create_prompt(db: Session, prompt_data: dict):
    db_prompt = Prompt(**prompt_data)
    db.add(db_prompt)
    db.commit()
    db.refresh(db_prompt)
    return db_prompt

def get_prompts_by_user(db: Session, user_id: int):
    return db.query(Prompt).filter(Prompt.user_id == user_id).all()

def get_all_prompts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Prompt).offset(skip).limit(limit).all()