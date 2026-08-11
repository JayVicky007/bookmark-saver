# 🔖 Bookmark Saver (Full-Stack Link Scraper)

A streamlined, full-stack web application designed to archive web bookmarks. Paste a URL, and the system automatically wakes up a backend crawler to parse, extract, and index web page metadata titles into a localized database.

---

## 🛠️ Tech Stack Architecture
- **Backend:** Python 3.14 + Django REST Framework (DRF)
- **Scraping Engine:** BeautifulSoup4 + Requests
- **Database:** SQLite3
- **Frontend:** React (Vite environment build) + Axios data fetching
- **Style Ecosystem:** Pure responsive CSS Object layouts

---

## 🪵 The Developer's Troubleshooting Log (Human Insights)

Building a full-stack system from scratch means running into walls. Here is a transparent chronicle of the architectural traps encountered during this build and exactly how they were engineered through.

### 🛑 Roadblock 1: The Invisible Server Mismatch (404 Gateways)
- **The Mistake:** During React-to-Django setup, configuration bases were mismatched. Setting the frontend endpoint trace to a bare IP or removing the `api/` segment caused requests to broadcast to endpoints like `//all/` or `/add/`. Django strictly rejected these paths.
- **The Fix:** Realigned `API_BASE` in `App.jsx` to match Django's url pattern precisely with no trailing slashes: `http://localhost:8000/api`. This synced perfectly with `backend/urls.py`.

### 🛑 Roadblock 2: The Silent CORS Security Blockade
- **The Mistake:** Axios requests went out, but the browser interface threw generic network failures. The Django log recorded incoming `OPTIONS` check handshakes, but no data moved. The backend lacked cross-origin authorization settings.
- **The Fix:** Configured `django-cors-headers` middleware directly into the backend settings engine, placing `CorsMiddleware` at the absolute top of the processing queue, and explicitly whitelisting the local frontend ports (`5173`).

### 🛑 Roadblock 3: The Vanishing Text Mystery (Dark Mode Blending)
- **The Mistake:** Implemented an explicit styling structure with dark-charcoal header fonts (`#1a1a1a`). However, because the development machine defaults to a system-wide dark mode theme layout, the application title blended into the black browser surface and completely vanished.
- **The Fix:** Swapped static hex formatting vectors over to dynamic runtime layout logic. Implemented a custom `useState(true)` switch in React that tracks system/user state dynamically, shifting layout text values up to bright white values (`#ffffff`) when dark theme rules trigger.

### 🛑 Roadblock 4: The Stray Layout Syntax Break
- **The Mistake:** Introduced a typo (`) {`) directly into the inline JSX template for the Theme Toggle button. The underlying Vite compiler immediately crashed with an internal parser error and blocked the UI build.
- **The Fix:** Traced the exact line numbers flagged inside the terminal, stripped out the stray characters, and safely restored clean React structural syntax layout tags.

---

## 🚀 Local Deployment Instructions

### Backend Execution
1. Activate your virtual environment: `.\venv\Scripts\Activate.ps1`
2. Fire up the Django development gateway instance:
   ```bash
   python -m manage.py runserver
   ```

### Frontend Execution
1. Open a secondary terminal, and navigate to the frontend directory: `cd frontend`
2. Start the Vite hot-reloading development server layout:
   ```bash
   npm run dev
   ```
