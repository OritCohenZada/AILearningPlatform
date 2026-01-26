from app.database import get_db
from app.models.user import User

# קבלת חיבור למסד נתונים
db = next(get_db())

# שליפת כל המשתמשים
users = db.query(User).all()

print("=== כל המשתמשים ב-DB ===")
for user in users:
    print(f"ID: {user.id}")
    print(f"שם: {user.name}")
    print(f"טלפון: {user.phone}")
    print(f"תפקיד: {user.role}")
    print("-" * 30)

print(f"סה\"כ משתמשים: {len(users)}")

# סגירת החיבור
db.close()