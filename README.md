# BlueSphere AI
Project Demo : https://drive.google.com/file/d/1r7BKiToNY1wywfJScXPq1nlbgOZJp1C9/view?usp=sharing
**BlueSphere AI** is a professional AI-driven Unified Data Platform designed for oceanographic, fisheries, and molecular biodiversity insights. It provides real-time geospatial intelligence, anomaly detection, and species distribution modeling to support sustainable marine operations, environmental risk monitoring, and commercial maritime decision-making.

---

## Key Features

1. **Unified Oceanographic Intelligence Dashboard**:
   - Interactive spatial visualization of the Indian coastline (Kochi, Chennai, Mumbai, Visakhapatnam, Port Blair, Goa) using React Leaflet.
   - Live layer toggles for **Sea Surface Temperature (SST)**, **Chlorophyll concentration**, **Salinity**, and **Ocean Currents**.

2. **Fisheries Resource Forecasting**:
   - Machine Learning-based fish abundance prediction using a `RandomForestRegressor`.
   - Real-time **Potential Fishing Zone (PFZ)** style recommendation alerts.
   - Historical catch trends and environmental factor correlation mapping.

3. **Molecular & Ecosystem Biodiversity Monitoring**:
   - Spatial species distribution charts (Microbial, Coral, Pelagic, Demersal).
   - Sensitive ecosystem risk classification & conservation priority metrics.
   - Coral bleaching risk and microbial indicator dashboards.

4. **Natural Language AI Recommendations**:
   - Automated reasoning insights outlining oceanographic correlations.
   - Suggested operational actions, risk evaluation levels, and time horizons.

5. **Ocean Anomaly Detection**:
   - Multi-variate anomaly detection powered by `IsolationForest` to auto-flag marine heatwaves, runoff, or extreme temperature anomalies.

6. **Authentication & Session Persistence**:
   - Protected routes locking dashboard telemetry behind secure JWT tokens.
   - Salted PBKDF2 cryptography for credential registration, login, and profile administration.

---

## Technical Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Zustand, Recharts, React Leaflet, Framer Motion.
- **Backend**: FastAPI (Python 3.10+), Uvicorn, Pandas, NumPy, Scikit-learn, SQLAlchemy, PyJWT.
- **Database**: PostgreSQL (Docker / Production ready) with SQLite fallback for instant local testing.
- **DevOps**: Docker, Docker Compose.

---

## Getting Started

### Local Development Setup

#### 1. Backend Setup
Make sure you have Python 3.10+ installed.
```bash
cd backend
python -m venv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload
```
The backend server runs at `http://localhost:8000`.

#### 2. Frontend Setup
Make sure you have Node.js (v18+) installed.
```bash
cd frontend
npm install
npm run dev
```
The frontend application runs at `http://localhost:5173`.

---

## Docker Compose Setup

Run the entire stack (Database, Backend, and Frontend) instantly using:
```bash
docker-compose up --build
```
- Frontend will be accessible at: `http://localhost`
- Backend API will be accessible at: `http://localhost:8000`

---

## Core API Endpoints

### Authentication
- **Register Account**: `POST /api/v1/auth/register`
- **User Login**: `POST /api/v1/auth/login`
- **User Session Profile**: `GET /api/v1/auth/me`
- **Update Profile Settings**: `PUT /api/v1/auth/update`

### Telemetry & Forecasting
- **Health Status**: `GET /api/v1/health`
- **Ocean Observations**: `GET /api/v1/ocean/observations`
- **Ocean Regions**: `GET /api/v1/ocean/regions`
- **Fisheries Catch Records**: `GET /api/v1/fisheries/records`
- **Biodiversity Records**: `GET /api/v1/biodiversity/records`
- **AI Recommendation Engine**: `GET /api/v1/ai-insights`
- **Interactive ML Forecasting**: `POST /api/v1/predict`
