from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas import Category, SubCategory, CategoryBase, SubCategoryBase
from app.repositories import category_repo
from app import models, auth 

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.get("/", response_model=List[Category])
def read_categories(db: Session = Depends(get_db)):
    return category_repo.get_categories(db)

@router.get("/{category_id}/sub-categories", response_model=List[SubCategory])
def read_sub_categories(category_id: int, db: Session = Depends(get_db)):
    return category_repo.get_sub_categories(db, category_id)

@router.post("/", response_model=Category)
def create_new_category(category: CategoryBase, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_admin)):
    return category_repo.create_category(db, category)

@router.post("/{category_id}/sub-categories", response_model=SubCategory)
def create_new_sub_category(category_id: int, sub_category: SubCategoryBase, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_admin)):
    return category_repo.create_sub_category(db, sub_category, category_id)


@router.put("/{category_id}", response_model=Category)
def update_category(category_id: int, category: CategoryBase, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_admin)):
    db_cat = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not db_cat:
        raise HTTPException(status_code=404, detail="Category not found")
    db_cat.name = category.name
    db.commit()
    db.refresh(db_cat)
    return db_cat

@router.delete("/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_admin)):
    db_cat = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not db_cat:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(db_cat)
    db.commit()
    return {"message": "Category deleted"}

@router.delete("/sub-categories/{sub_id}")
def delete_sub_category(sub_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_admin)):
    db_sub = db.query(models.SubCategory).filter(models.SubCategory.id == sub_id).first()
    if not db_sub:
        raise HTTPException(status_code=404, detail="SubCategory not found")
    db.delete(db_sub)
    db.commit()
    return {"message": "SubCategory deleted"}

@router.put("/sub-categories/{sub_id}", response_model=SubCategory)
def update_sub_category(sub_id: int, sub_category: SubCategoryBase, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_admin)):

    db_sub = db.query(models.SubCategory).filter(models.SubCategory.id == sub_id).first()
    

    if not db_sub:
        raise HTTPException(status_code=404, detail="SubCategory not found")

    db_sub.name = sub_category.name
    db.commit()
    db.refresh(db_sub)
    
    return db_sub