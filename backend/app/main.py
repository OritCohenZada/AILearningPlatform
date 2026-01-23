from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import users, categories, prompts
from app.database import engine, Base 
from app import models
from app.routers import contact


Base.metadata.create_all(bind=engine)


app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(categories.router)
app.include_router(prompts.router)
app.include_router(contact.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to AI Learning Platform API"}