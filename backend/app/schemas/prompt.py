from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class PromptCreate(BaseModel):
    user_id: int
    category_id: int
    sub_category_id: int
    prompt: str


class PromptResponse(PromptCreate):
    id: int
    response: Optional[str] = None 
    created_at: datetime

    class Config:
        from_attributes = True