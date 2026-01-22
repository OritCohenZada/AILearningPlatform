from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from .. import models, database, auth  # הוספנו את auth

router = APIRouter(prefix="/users", tags=["users"])
get_db = database.get_db



class UserBase(BaseModel):
    name: str
    phone: str

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int
    role: str  
    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user_name: str
    user_role: str


@router.post("/signup", response_model=User)
def create_user(user: UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(models.User).filter(models.User.phone == user.phone).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Phone already registered")


    role = "admin" if "admin" in user.name.lower() else "user"

    new_user = models.User(name=user.name, phone=user.phone, role=role)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post("/login", response_model=Token)
def login(request: UserCreate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(
        models.User.phone == request.phone,
        models.User.name == request.name
    ).first()

    if not user:
        raise HTTPException(status_code=404, detail="Invalid credentials")
    

    access_token = auth.create_access_token(data={"sub": user.phone})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_name": user.name,
        "user_role": user.role
    }


@router.get("/me", response_model=User)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@router.get("/", response_model=List[User])
def read_users(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),

    current_user: models.User = Depends(auth.get_current_admin) 
):
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users


@router.delete("/{user_id}")
def delete_user(
    user_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}


@router.put("/{user_id}", response_model=User)
def update_user(
    user_id: int, 
    user_update: UserCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_admin)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.name = user_update.name
    user.phone = user_update.phone
    
    db.commit()
    db.refresh(user)
    return user