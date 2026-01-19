from sqlalchemy.orm import Session
from app.models import Category, SubCategory

def get_categories(db: Session):
    return db.query(Category).all()

def get_sub_categories(db: Session, category_id: int):
    return db.query(SubCategory).filter(SubCategory.category_id == category_id).all()