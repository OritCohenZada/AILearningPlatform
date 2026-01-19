from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)

    
    sub_categories = relationship("SubCategory", back_populates="category")
    prompts = relationship("Prompt", back_populates="category")

class SubCategory(Base):
    __tablename__ = "sub_categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"))

   
    category = relationship("Category", back_populates="sub_categories")
    prompts = relationship("Prompt", back_populates="sub_category")