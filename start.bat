@echo off
echo 🔖 Waking up Bookmark Saver Workspace...

:: Launch Window 1: Django Backend Server Setup
echo 🐍 Spinning up Python Virtual Environment and Django Backend...
start cmd /k "venv\Scripts\activate.bat && python manage.py runserver"

:: Launch Window 2: Vite React Frontend Setup
echo ⚛️ Navigating to Frontend and starting Vite Hot-Reloads...
start cmd /k "cd frontend && npm run dev"

echo 🚀 Done! Close this window, but keep the server windows active while coding.
