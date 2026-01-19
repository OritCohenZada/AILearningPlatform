from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas import Category, SubCategory
from app.repositories import category_repo

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.get("/", response_model=List[Category])
def read_categories(db: Session = Depends(get_db)):
    return category_repo.get_categories(db)

@router.get("/{category_id}/sub-categories", response_model=List[SubCategory])
def read_sub_categories(category_id: int, db: Session = Depends(get_db)):
    return category_repo.get_sub_categories(db, category_id)