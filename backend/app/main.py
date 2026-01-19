from fastapi import FastAPI
from sqlalchemy import text
from app.database import engine
from app.core.config import settings

app = FastAPI(title=settings.PROJECT_NAME)

@app.get("/")
def read_root():
    return {"message": "Welcome to AI Learning Platform API"}

@app.get("/health")
def health_check():
   
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "error", "database": str(e)}