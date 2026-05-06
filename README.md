# ArcheoDB: Archaeological Research & Enterprise Resource Planning

ArcheoDB is a comprehensive management system designed for archaeological research institutions. It combines a robust **Artifact Registry**, **Excavation Site Management**, **Dating Records**, and a full **ERP module** for museum financials and human resources.

## 🚀 Overview

ArcheoDB streamlines the lifecycle of archaeological discovery—from the first shovel in the ground to the museum exhibition floor. It provides researchers with tools to catalog finds and administrators with tools to manage the logistics of research labs and museums.

### Key Modules
- **🏛️ Excavation Management**: Map-based site exploration, stratigraphic layer tracking, and professional site gallery with images.
- **🏺 Artifact Registry**: Detailed cataloging of materials, condition states, spatial context, and site image associations.
- **⏳ Chronology Center**: Specialized management for C14 and Dendrochronology dating records.
- **💰 Financial ERP**: Museum transaction tracking, customer management, and sales analytics.
- **👷 HR & Labor**: Management of field laborers, work assignments, and payroll tracking.
- **🤖 AI Classification**: Integrated (simulated) AI for automated material type suggestion.
- **🛡️ Audit Logs**: Comprehensive activity tracking for administrative security.
- **🖼️ Visual Archive**: Professional image integration for all 9 archaeological excavation sites with responsive galleries.

---

## 🛠️ Technology Stack

### Frontend (`/archeo-research-db`)
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: CSS3 with CSS Variables, responsive Grid & Flexbox layouts
- **Animations**: [Framer Motion](https://www.framer.com/motion/) (smooth transitions, carousels, modals)
- **Visualization**: [Recharts](https://recharts.org/) (Analytics) & [Leaflet](https://leafletjs.com/) (GIS/Mapping)
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Asset Management**: Professional image integration for 9 archaeological sites with dynamic loading, caching, and error handling

### Backend (`/archeo-research-backend`)
- **Language**: [Python 3.12+](https://www.python.org/)
- **API Framework**: [Flask](https://flask.palletsprojects.com/)
- **Database**: SQLite (via [Flask-SQLAlchemy](https://flask-sqlalchemy.palletsprojects.com/))
- **Security**: JWT Authentication ([Flask-JWT-Extended](https://flask-jwt-extended.readthedocs.io/))
- **CORS**: [Flask-CORS](https://flask-cors.readthedocs.io/)

---

## 📂 Project Structure

```text
Archeological_Research_DB/
├── archeo-research-backend/      # Python Flask API
│   ├── app.py                    # Main entry point & API Routes
│   ├── models.py                 # SQLAlchemy Database Models
│   ├── config.py                 # Application Configuration
│   ├── archeo_erp.db             # SQLite Database File
│   └── seed_data.py              # Script for populating initial data
├── archeo-research-db/           # React Frontend Application
│   ├── src/
│   │   ├── api/                  # Axios configuration and API calls
│   │   ├── components/           # Reusable UI components
│   │   │   ├── SiteCard.jsx      # Site grid/list card component
│   │   │   ├── SiteThumbnail.jsx # Compact site preview
│   │   │   ├── SiteDetailModal.jsx # Full site details modal
│   │   │   ├── SiteGallery.jsx   # Featured sites carousel
│   │   │   └── ...               # Other components
│   │   ├── pages/                # Main view components (Dashboard, Registry, etc.)
│   │   ├── utils/                # Utility functions
│   │   │   ├── siteImages.js     # Image mapping & caching utilities
│   │   │   ├── toast.js          # Toast notifications
│   │   │   └── ...               # Other utilities
│   │   ├── stores/               # State management
│   │   └── data/                 # Mock data and constants
│   ├── public/
│   │   └── assets/
│   │       └── sites/            # Excavation site images
│   │           ├── amri.jpg
│   │           ├── chanhudaro.jpg
│   │           ├── harapa.jpg
│   │           ├── kot_diji.jpg
│   │           ├── mehrgarh.jpg
│   │           ├── mohenjadaro.jpg
│   │           ├── rehman-dheri.jpg
│   │           ├── takht-e-bahi.jpg
│   │           └── taxila.jpg
│   ├── vite.config.js            # Vite configuration
│   └── tailwind.config.js        # Tailwind styling configuration
└── images/                       # Source images folder (reference)
```

---

## ⚙️ Setup Instructions

### 1. Backend Setup
Navigate to the backend directory and set up a virtual environment:
```bash
cd archeo-research-backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install flask flask-sqlalchemy flask-cors flask-jwt-extended
```

Run the application:
```bash
python app.py
```
The API will be available at `http://localhost:5000`.

### 2. Frontend Setup
Navigate to the frontend directory and install dependencies:
```bash
cd archeo-research-db
npm install
```

Run the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## 🔒 Authentication & Roles

The system utilizes JWT-based authentication with role-based access control (RBAC):
- **Admin**: Full access to all modules, including Audit Logs and User Management.
- **Researcher**: Full access to Sites, Artifacts, and Dating modules.
- **HR/Manager**: Access to Financials and Laborer management.
- **Guest**: Read-only access to public research data.

---

## 🖼️ Professional Site Image Integration (2026)

### New Features
- **9/9 major excavation site images** integrated throughout the application (Mohenjo-Daro, Taxila, Harappa, Mehrgarh, Amri, Chanhudaro, Takht-e-Bahi, Kot Diji, Rehman Dheri)
- **Dynamic image mapping** with fallback and error handling
- **Professional gallery carousel** (SiteGallery component) on Dashboard
- **Detail modal** (SiteDetailModal component) for full site info with hero image
- **Thumbnails and previews** in all site-related tables, cards, and lists
- **Responsive, dark/light mode compatible, and performance-optimized**

### Key Files
- `src/utils/siteImages.js` — Centralized image mapping, metadata, and caching
- `src/components/SiteGallery.jsx` — Featured sites carousel
- `src/components/SiteDetailModal.jsx` — Full site details modal
- `src/components/SiteCard.jsx` & `SiteThumbnail.jsx` — Reusable image cards
- `src/pages/Dashboard.jsx`, `SitesExplorer.jsx`, `ArtifactRegistry.jsx`, `Inventory.jsx` — All enhanced for image display

### Documentation
- `SITE_IMAGES_INTEGRATION.md` — Complete integration guide
- `IMPLEMENTATION_SUMMARY.md` — Technical summary
- `PROJECT_COMPLETION_REPORT.md` — Final status report

**Status:** All features implemented, error-checked, and production-ready as of May 2026.

---

## 📜 License
This project is developed for archaeological research management and enterprise resource planning.

---
*Developed by [faizzanasghar](https://github.com/faizzanasghar)*
