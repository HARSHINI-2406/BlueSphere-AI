import React from 'react';
import { Card } from '../components/ui/Card';
import { 
  BookOpen, 
  Cpu, 
  Globe, 
  HelpCircle, 
  Layers, 
  Settings, 
  Users 
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const techStack = {
    frontend: ["React 18", "Vite", "TypeScript", "Tailwind CSS", "Zustand (State)", "React Leaflet (Maps)", "Recharts (Charts)", "Framer Motion"],
    backend: ["FastAPI", "Uvicorn", "SQLAlchemy", "Scikit-Learn (RandomForest, IsolationForest)", "Pandas", "NumPy", "Pydantic"],
    database: ["PostgreSQL (Production ready)", "SQLite (Local development fallback)"],
    devops: ["Docker", "Docker Compose", "Multi-stage builds"]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title header */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-100 flex items-center">
          <HelpCircle className="h-7 w-7 mr-3 text-cyan-400" />
          About BlueSphere AI
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-light mt-1">
          Technical Specifications & Software Architecture
        </p>
      </div>

      {/* Platform & Model Overview cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Mission Card */}
        <Card className="bg-slate-900/30 border-slate-800/40 space-y-3">
          <h3 className="text-base font-bold text-slate-200 flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-cyan-400" />
            The Platform Mission
          </h3>
          <div className="text-xs sm:text-sm text-slate-400 space-y-2.5 font-light leading-relaxed">
            <p>
              Offshore operators, research groups, and sustainable aquaculture firms require unified datasets to forecast yields and verify environmental compliance. BlueSphere AI bridges this gap by aggregating physical, chemical, and biological marine readings into a single interactive controller.
            </p>
            <p>
              By translating multi-sensor datasets into real-time visual grids and natural-language advisories, BlueSphere AI enables offshore operations to make responsive, data-backed decisions in rapidly changing sea conditions.
            </p>
          </div>
        </Card>

        {/* Intelligence Engines Card */}
        <Card className="bg-slate-900/30 border-slate-800/40 space-y-3">
          <h3 className="text-base font-bold text-slate-200 flex items-center">
            <Cpu className="h-5 w-5 mr-2 text-cyan-400" />
            Machine Learning Engine
          </h3>
          <div className="text-xs sm:text-sm text-slate-400 space-y-2.5 font-light leading-relaxed">
            <p>
              At the core of the BlueSphere platform are two specialized predictive pipelines:
            </p>
            <ul className="list-disc pl-4 space-y-1 bg-slate-950/20 p-2.5 rounded-xl border border-slate-900">
              <li>**Abundance Forecaster**: A RandomForestRegressor trained on historical harvests, chlorophyll-a levels, salinity, and temperature, predicting target biomass yield probability.</li>
              <li>**Outlier Anomaly Detector**: An IsolationForest anomaly model that screens observations in real time to flag extreme heatwave events and thermal shocks.</li>
            </ul>
          </div>
        </Card>
      </div>

      {/* Technical Architecture specifications */}
      <Card className="bg-slate-900/30 border-slate-800/40 space-y-4">
        <h3 className="text-base font-bold text-slate-200 flex items-center">
          <Layers className="h-5 w-5 mr-2 text-cyan-400" />
          Technical Module Layout
        </h3>
        
        <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl font-mono text-[10px] sm:text-xs text-cyan-400/90 overflow-x-auto leading-relaxed">
          {`
  +-----------------------------------------------------------------------------+
  |                              FRONTEND PORTAL (React)                        |
  |  [Vite Client] ---> [Axios Interceptor] ---> [Zustand Auth Store]           |
  |  [Leaflet Map Layer Controls] <---> [Recharts Analytical Timelines]         |
  +-----------------------------------------------------------------------------+
                                         |
                                         v (JWT Authorization Headers)
  +-----------------------------------------------------------------------------+
  |                              BACKEND ENGINE (FastAPI)                       |
  |  [REST API Routes] ---> [lifespan Database Seeders]                         |
  |  [Auth API Controller] ---> [hashlib PBKDF2] & [jwt Tokens Engine]          |
  +-----------------------------------------------------------------------------+
                                         |
                                         v
  +-----------------------------------------------------------------------------+
  |                             DATABASE ORCHESTRATION                          |
  |            [SQLAlchemy Declarative] <---> [SQLite / PostgreSQL]            |
  +-----------------------------------------------------------------------------+
          `}
        </div>
      </Card>

      {/* Tech stack specifications grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(techStack).map(([layerName, items], idx) => (
          <Card key={idx} className="bg-slate-900/30 border-slate-800/40">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-800/80 pb-1.5 mb-3 flex items-center">
              <Settings className="h-3.5 w-3.5 mr-1.5 text-cyan-400" />
              {layerName} stack
            </h4>
            <ul className="space-y-1 text-xs text-slate-300 font-light">
              {items.map((item, itemIdx) => (
                <li key={itemIdx} className="flex items-center">
                  <span className="h-1 w-1 bg-cyan-400 rounded-full mr-2"></span>
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      {/* Roadmap & Scale info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Module division card */}
        <Card className="bg-slate-900/30 border-slate-800/40 space-y-4">
          <h3 className="text-base font-bold text-slate-200 flex items-center">
            <Users className="h-5 w-5 mr-2 text-cyan-400" />
            Software Deployment Models
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl space-y-1">
              <span className="font-bold text-slate-200">REST API Gateway</span>
              <p className="text-slate-400 font-light text-[11px]">Structured route endpoints mapping regional indicators under secure CORS headers.</p>
            </div>
            <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl space-y-1">
              <span className="font-bold text-slate-200">Zustand Client Store</span>
              <p className="text-slate-400 font-light text-[11px]">Maintains responsive state parameters, filter ranges, map layers, and user profiles.</p>
            </div>
            <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl space-y-1">
              <span className="font-bold text-slate-200">Docker Containerization</span>
              <p className="text-slate-400 font-light text-[11px]">Multi-stage Dockerfiles compiling frontend assets on Nginx and running backend processes.</p>
            </div>
            <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl space-y-1">
              <span className="font-bold text-slate-200">Secure JWT Flow</span>
              <p className="text-slate-400 font-light text-[11px]">PBKDF2 salted password credentials and stateless bearer authentication.</p>
            </div>
          </div>
        </Card>

        {/* Future Scope */}
        <Card className="bg-slate-900/30 border-slate-800/40 space-y-3">
          <h3 className="text-base font-bold text-slate-200 flex items-center">
            <Globe className="h-5 w-5 mr-2 text-cyan-400 animate-pulse" />
            Future Scaling & Integrations
          </h3>
          <div className="text-xs sm:text-sm text-slate-400 space-y-2.5 font-light leading-relaxed">
            <p>
              **Satellite Webhook Triggers**: Direct real-time data syncs with public Copernicus Sentinel satellite imagery endpoints for Sea Surface Temperature scans.
            </p>
            <p>
              **Sensory Edge Models**: Compiling models to run prediction logic directly on micro-controllers of maritime buoys.
            </p>
            <p>
              **Autonomous Drone Logs**: Fetching physical variables from oceanographic sub-surface drones and autonomous tracking gliders.
            </p>
          </div>
        </Card>
      </div>

    </div>
  );
};
