from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Prompt(Base):
    __tablename__ = "prompts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    category_id = Column(Integer, ForeignKey("categories.id"))
    sub_category_id = Column(Integer, ForeignKey("sub_categories.id"))
    prompt = Column(Text)
    response = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


    user = relationship("User", back_populates="prompts")
    category = relationship("Category", back_populates="prompts")
    sub_category = relationship("SubCategory", back_populates="prompts")