import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str
    DATABASE_URL: str
    OPENAI_API_KEY: str  

    mail_username: str
    mail_password: str
    admin_email: str
    mail_server: str
    mail_port: int

    class Config:
        env_file = ".env"
        extra = "ignore" 

settings = Settings()