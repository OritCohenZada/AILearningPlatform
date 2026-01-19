from pydantic import BaseModel
from typing import List


class SubCategoryBase(BaseModel):
    name: str


class SubCategory(SubCategoryBase):
    id: int
    category_id: int

    class Config:
        from_attributes = True 


class CategoryBase(BaseModel):
    name: str


class Category(CategoryBase):
    id: int
    sub_categories: List[SubCategory] = []

    class Config:
        from_attributes = True