from app.core.config import settings

print("=== DEBUG INFO ===")
print(f"ADMIN_PHONE from .env: {settings.admin_phone}")
print(f"Type: {type(settings.admin_phone)}")
print("==================")

# סימולציה של הבדיקה
test_phone = "0512345678"
result = "admin" if test_phone == settings.admin_phone else "user"
print(f"Test phone: {test_phone}")
print(f"Result role: {result}")
print(f"Match: {test_phone == settings.admin_phone}")