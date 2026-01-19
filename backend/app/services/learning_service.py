from sqlalchemy.orm import Session
from app.repositories import prompt_repo, category_repo, user_repo
from app.schemas import PromptCreate
from app.services.ai_service import ai_service
from fastapi import HTTPException

def submit_prompt(db: Session, prompt_data: PromptCreate):
    """
    Handles the full flow:
    1. Validate input
    2. Call AI Service
    3. Save to DB
    """

    categories = category_repo.get_categories(db)
    category_name = "Unknown"
    sub_category_name = "Unknown"


    for cat in categories:
        if cat.id == prompt_data.category_id:
            category_name = cat.name
            for sub in cat.sub_categories:
                if sub.id == prompt_data.sub_category_id:
                    sub_category_name = sub.name
            break

 
    ai_response = ai_service.generate_lesson(
        category=category_name,
        sub_category=sub_category_name,
        prompt=prompt_data.prompt
    )

    db_data = prompt_data.model_dump()
    db_data["response"] = ai_response


    new_prompt = prompt_repo.create_prompt(db, db_data)
    return new_prompt