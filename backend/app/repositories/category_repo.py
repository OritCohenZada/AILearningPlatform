from sqlalchemy.orm import Session
from app.models import Category, SubCategory
from app.schemas import CategoryBase, SubCategoryBase

def get_categories(db: Session):
    return db.query(Category).all()

def get_sub_categories(db: Session, category_id: int):
    return db.query(SubCategory).filter(SubCategory.category_id == category_id).all()

def create_category(db: Session, category: CategoryBase):
    db_category = Category(name=category.name)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def create_sub_category(db: Session, sub_category: SubCategoryBase, category_id: int):
    db_sub_category = SubCategory(
        name=sub_category.name,
        category_id=category_id
    )
    db.add(db_sub_category)
    db.commit()
    db.refresh(db_sub_category)
    return db_sub_category