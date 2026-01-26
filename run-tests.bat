@echo off
echo ========================================
echo Running GenLearn Backend Tests
echo ========================================

echo.
echo Running Backend Tests...
cd backend
python -m pytest tests/ -v --tb=short
if %errorlevel% neq 0 (
    echo Backend tests FAILED!
    pause
    exit /b 1
)

echo.
echo ========================================
echo All Backend tests PASSED! ✅
echo ========================================
pause