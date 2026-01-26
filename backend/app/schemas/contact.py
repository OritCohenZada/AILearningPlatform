from pydantic import BaseModel, EmailStr, Field


class ContactCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, description="Name must be between 2-100 characters")
    email: EmailStr = Field(..., description="Valid email address required")
    message: str = Field(..., min_length=10, max_length=1000, description="Message must be between 10-1000 characters")