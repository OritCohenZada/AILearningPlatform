# GenLearn - AI Learning Platform

**פלטפורמת למידה מבוססת בינה מלאכותית**

## סקירה כללית

GenLearn היא פלטפורמת למידה דיגיטלית המשלבת טכנולוגיית בינה מלאכותית לצורך יצירת חוויית למידה מותאמת אישית. המערכת מאפשרת למשתמשים לשאול שאלות בתחומים שונים ולקבל תשובות מפורטות ומותאמות מ-GPT-4o.

### תכונות עיקריות

**למידה מותאמת אישית** - המערכת מאפשרת בחירת קטגוריות ותת-קטגוריות ספציפיות לצורך קבלת תשובות ממוקדות

**ממשק משתמש מתקדם** - עיצוב רספונסיבי ומודרני המותאם לכל סוגי המכשירים

**מעקב אחר היסטוריה** - שמירה וצפייה בשאלות ותשובות קודמות

**מערכת ניהול** - פאנל ניהול למנהלים לניהול משתמשים וקטגוריות

**אבטחה** - מערכת אימות מבוססת JWT להגנה על נתוני המשתמשים

---

## ארכיטקטורה טכנית

### Frontend (Angular 21.1.0)
```
frontend/
├── src/app/
│   ├── pages/
│   │   ├── home/              # דף הבית עם עיצוב מרשים
│   │   ├── login/             # מערכת התחברות
│   │   ├── signup/            # רישום משתמשים חדשים
│   │   ├── user-dashboard/    # לוח בקרה למשתמשים
│   │   └── admin-dashboard/   # לוח בקרה למנהלים
│   ├── services/
│   │   ├── api.service.ts     # שירותי API מרכזיים
│   │   └── toast.service.ts   # הודעות למשתמש
│   ├── models/                # מודלים של TypeScript
│   └── auth.interceptor.ts    # אבטחת בקשות HTTP
```

### Backend (FastAPI + Python)
```
backend/
├── app/
│   ├── models/                # מודלי מסד נתונים
│   │   ├── user.py           # מודל משתמש
│   │   ├── category.py       # קטגוריות למידה
│   │   └── prompt.py         # שאילתות ותשובות
│   ├── routers/              # נתיבי API
│   │   ├── users.py          # ניהול משתמשים
│   │   ├── categories.py     # ניהול קטגוריות
│   │   ├── prompts.py        # שאילתות AI
│   │   └── contact.py        # טופס יצירת קשר
│   ├── services/
│   │   ├── ai_service.py     # שירות OpenAI GPT-4o
│   │   ├── learning_service.py # לוגיקת למידה
│   │   └── contact_service.py  # שירות יצירת קשר
│   ├── repositories/         # שכבת נתונים
│   └── core/
│       └── config.py         # הגדרות מערכת
```

---

## טכנולוגיות

### Frontend
- **Angular 21.1.0** - Framework לפיתוח אפליקציות web
- **TailwindCSS 4.1.12** - Framework CSS לעיצוב
- **TypeScript** - שפת תכנות מובנית
- **RxJS** - ספרייה לתכנות אסינכרוני

### Backend
- **FastAPI** - Framework Python לבניית API
- **SQLAlchemy** - ORM לניהול מסד נתונים
- **PostgreSQL** - מסד נתונים יחסי
- **OpenAI GPT-4o** - מודל בינה מלאכותית
- **Alembic** - כלי לניהול מיגרציות מסד נתונים
- **Pydantic** - ספרייה לולידציה של נתונים

---

## עיצוב ממשק המשתמש

### פלטת צבעים
- צבע ראשי: #B08D55
- צבע משני: #1a1a1a  
- רקע: #F3EFE0
- צבע הדגשה: #9A7B4F

### תכונות עיצוב
- עיצוב רספונסיבי המתאים לכל גדלי מסך
- אנימציות חלקות ומעברים
- ממשק אינטואיטיבי וידידותי למשתמש
- טעינה מהירה ואופטימיזציה לביצועים

---

## תכונות המערכת

### דף הבית
- עמוד נחיתה עם מידע על הפלטפורמה
- סקציית תכונות המציגה את יכולות המערכת
- טופס יצירת קשר עם ולידציה ושליחה למייל מנהל האתר
- ניווט קבוע וחלק בין הסקציות

### מערכת משתמשים
- רישום והתחברות עם אימות
- ניהול פרופיל אישי
- הרשאות מבוססות תפקידים (משתמש רגיל/מנהל)
- אבטחה מבוססת JWT tokens

**הגדרת תפקידים:**
- **משתמש רגיל**: כל משתמש שנרשם רגיל מקבל תפקיד "user"
- **מנהל**: משתמש עם מספר טלפון המוגדר ב-ADMIN_PHONE מקבל תפקיד "admin" אוטומטית
- **הגדרה**: הגדר ADMIN_PHONE=0501234567 בקובץ .env

### לוח בקרה למשתמש
- בחירת קטגוריות ותת-קטגוריות למידה
- שליחת שאלות לבינה המלאכותית
- צפייה בהיסטוריית שאלות ותשובות
- קבלת תשובות מיידיות ומפורטות

### לוח בקרה למנהל
- ניהול משתמשים (הוספה, עריכה, מחיקה)
- ניהול קטגוריות ותת-קטגוריות
- צפייה בנתוני המערכת
- ממשק ניהול מתקדם

### שירות הבינה המלאכותית
- אינטגרציה עם OpenAI GPT-4o
- תשובות מותאמות לפי קטגוריה
- טיפול בשגיאות ומצבי חירום
- מהירות תגובה גבוהה

---

## מסד נתונים

### מבנה טבלאות
```sql
Users
├── id (Primary Key)
├── name
├── phone (Unique)
└── role (user/admin)

Categories
├── id (Primary Key)
├── name
└── sub_categories (One-to-Many)

SubCategories
├── id (Primary Key)
├── name
└── category_id (Foreign Key)

Prompts
├── id (Primary Key)
├── user_id (Foreign Key)
├── category_id (Foreign Key)
├── sub_category_id (Foreign Key)
├── prompt (Text)
├── response (Text)
└── created_at (Timestamp)
```

---

## התקנה והרצה

### דרישות מערכת
- Node.js גרסה 18 ומעלה
- Python גרסה 3.8 ומעלה  
- PostgreSQL גרסה 12 ומעלה
- מפתח API של OpenAI

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
ng serve
```

### Environment Variables
```env
DATABASE_URL=postgresql://user:password@localhost/dbname
OPENAI_API_KEY=your_openai_api_key
SECRET_KEY=your_secret_key
PROJECT_NAME=GenLearn AI Learning Platform
ADMIN_PHONE=0501234567
```

---

## אבטחה

- אימות משתמשים באמצעות JWT tokens
- הגנה מפני CORS attacks
- ולידציה של קלט משתמשים בכל השכבות
- הגנה מפני SQL injection באמצעות SQLAlchemy
- שמירת נתונים רגישים במשתני סביבה

---

## בדיקות (Testing)

### Backend Tests (Pytest)
```bash
cd backend
pip install -r requirements.txt
python -m pytest tests/ -v
# או הרצת הסקריפט המוכן:
run-tests.bat
```



### Frontend Tests (Vitest)
```bash
cd frontend
npm test
```



### מבנה קבצי בדיקות
```
backend/tests/
├── test_main.py           # בדיקות API בסיסיות
├── test_ai_service.py     # בדיקות שירות AI
├── test_user_model.py     # בדיקות מודל משתמש
└── test_integration.py    # בדיקות אינטגרציה

run-tests.bat              # סקריפט להרצת כל הבדיקות
```



## דפלוימנט (Deployment)

### Frontend
- **Vercel** 


### Backend
- **Render** 


### Database
- **Render PostgreSQL** 

.

**Demo URL:**
- **Frontend**:`https://genlearn-frontend.vercel.app`(האפליקציה המלאה)
- **Backend API**: `http://127.0.0.1:8000/docs` (תיעוד API)
