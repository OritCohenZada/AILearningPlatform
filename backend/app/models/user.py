from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base



class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    phone = Column(String, unique=True, index=True) 
    role = Column(String, default="user") 

    prompts = relationship("Prompt", back_populates="user")
