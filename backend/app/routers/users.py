from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from .. import models, database


class UserBase(BaseModel):
    name: str
    phone: str

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int
    class Config:
        from_attributes = True


router = APIRouter(prefix="/users", tags=["users"])
get_db = database.get_db


@router.post("/", response_model=User)
def create_user(user: UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(models.User).filter(models.User.phone == user.phone).first()
    if existing_user:

        return existing_user
    

    new_user = models.User(name=user.name, phone=user.phone)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post("/login", response_model=User)
def login(request: UserCreate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(
        models.User.phone == request.phone,
        models.User.name == request.name
    ).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user


@router.get("/", response_model=List[User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users