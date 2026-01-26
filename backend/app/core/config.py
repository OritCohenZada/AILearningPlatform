import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str
    DATABASE_URL: str
    OPENAI_API_KEY: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    mail_username: str
    mail_password: str
    admin_email: str
    admin_phone: str 
    mail_server: str
    mail_port: int

    class Config:
        env_file = ".env"
        extra = "ignore" 

settings = Settings()