import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { 
  getRegions, 
  getOceanObservations, 
  getAIInsights
} from '../api/services';
import { OceanObservation, AIInsight } from '../types';
import { OceanMap } from '../components/map/OceanMap';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { 
  Thermometer, 
  Eye, 
  Droplet, 
  Compass, 
  AlertTriangle, 
  Leaf, 
  Layers, 
  TrendingUp, 
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

export const DashboardPage: React.FC = () => {
  const {
    regions,
    setRegions,
    selectedRegion,
    setSelectedRegion,
    activeLayers,
    toggleLayer,
    user
  } = useStore();

  const [loading, setLoading] = useState(true);
  const [latestObservations, setLatestObservations] = useState<Record<number, OceanObservation>>({});
  const [allObservations, setAllObservations] = useState<OceanObservation[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [miniChartData, setMiniChartData] = useState<OceanObservation[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<any[]>([]);

  // Initial Data Load
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Regions
        const regionsList = await getRegions();
        setRegions(regionsList);
        
        if (regionsList.length > 0 && !selectedRegion) {
          setSelectedRegion(regionsList[0]);
        }

        // 2. Fetch Observations
        const observations = await getOceanObservations(undefined, 30);
        setAllObservations(observations);

        // Extract latest observation per region
        const latestMap: Record<number, OceanObservation> = {};
        regionsList.forEach((r) => {
          const regObs = observations.filter((o) => o.region_id === r.id);
          if (regObs.length > 0) {
            // Sort by timestamp descending and take the first
            const sorted = [...regObs].sort(
              (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
            latestMap[r.id] = sorted[0];
          }
        });
        setLatestObservations(latestMap);

        // Extract anomaly events
        const alertsList: any[] = [];
        observations.forEach((o) => {
          if (o.is_anomaly) {
            const regName = regionsList.find((r) => r.id === o.region_id)?.name || "Unknown";
            const date = new Date(o.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
            
            // Check if this alert was already compiled
            if (!alertsList.some((a) => a.region === regName && a.date === date)) {
              alertsList.push({
                region: regName,
                date: date,
                description: `SST Anomaly (${o.sst}°C) flagged by Anomaly Detector.`,
                type: "high-temp"
              });
            }
          }
        });
        setRecentAlerts(alertsList.slice(0, 4));

        // 3. Fetch Insights
        const insightsList = await getAIInsights();
        setInsights(insightsList);

      } catch (error) {
        console.error("Failed to load dashboard parameters:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [setRegions, setSelectedRegion]);

  // Load mini chart history when selected region changes
  useEffect(() => {
    if (selectedRegion && allObservations.length > 0) {
      const filtered = allObservations
        .filter((o) => o.region_id === selectedRegion.id)
        .slice(-7); // Take last 7 days
      setMiniChartData(filtered);
    }
  }, [selectedRegion, allObservations]);

  // Calculate mock dynamic score card variables based on active region data
  const currentObs = selectedRegion ? latestObservations[selectedRegion.id] : null;

  // Sustainability score: deduction if anomaly, higher if temperature stable
  const calculateSustainabilityScore = () => {
    if (!currentObs) return 85;
    let base = 94;
    if (currentObs.is_anomaly) base -= 20;
    if (currentObs.sst > 30.5) base -= 10;
    if (currentObs.chlorophyll < 0.3) base -= 8;
    return Math.max(45, base);
  };

  // Biodiversity risk score: maps to coral bleaching/microbial stress
  const calculateBiodiversityRisk = () => {
    if (!currentObs) return 25;
    let score = 15;
    if (currentObs.sst > 29.5) score += (currentObs.sst - 29.5) * 15;
    if (currentObs.is_anomaly) score += 30;
    return Math.min(95, Math.round(score));
  };

  const sustScore = calculateSustainabilityScore();
  const bioRisk = calculateBiodiversityRisk();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100">Welcome back, {user?.full_name || 'Marine Analyst'}</h1>
          <p className="text-xs sm:text-sm text-slate-400 font-light mt-1">
            BlueSphere Marine Analytics Dashboard. Tracking real-time indicators across active coastal stations.
          </p>
        </div>
        
        {/* Region Selector dropdown */}
        <div className="flex items-center space-x-3">
          <label className="text-xs sm:text-sm text-slate-400 font-medium">Focused Region:</label>
          <select
            value={selectedRegion?.id || ""}
            onChange={(e) => {
              const reg = regions.find((r) => r.id === parseInt(e.target.value));
              if (reg) setSelectedRegion(reg);
            }}
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            {regions.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid Dashboard structure */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* 1. Left controls sidebar */}
        <div className="space-y-6 lg:col-span-1">
          {/* Layer toggles panel */}
          <Card className="bg-slate-900/30 border-slate-800/40">
            <h3 className="text-sm font-bold text-slate-300 flex items-center mb-4">
              <Layers className="h-4 w-4 mr-2 text-cyan-400" />
              Intelligence Layers
            </h3>
            <div className="space-y-3">
              {[
                { name: 'SST', label: 'Sea Surface Temperature', icon: Thermometer, color: 'text-orange-400' },
                { name: 'Chlorophyll', label: 'Chlorophyll Density', icon: Eye, color: 'text-emerald-400' },
                { name: 'Salinity', label: 'Salinity (PSU)', icon: Droplet, color: 'text-cyan-400' },
                { name: 'Currents', label: 'Ocean Currents', icon: Compass, color: 'text-indigo-400' }
              ].map((layer) => {
                const Icon = layer.icon;
                const active = activeLayers.includes(layer.name);
                return (
                  <button
                    key={layer.name}
                    onClick={() => toggleLayer(layer.name)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs sm:text-sm transition-all ${
                      active 
                        ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 font-semibold' 
                        : 'bg-slate-950/20 text-slate-400 border-slate-800/80 hover:text-slate-300'
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      <Icon className={`h-4 w-4 ${layer.color}`} />
                      <span>{layer.label}</span>
                    </span>
                    <span className={`h-2.5 w-2.5 rounded-full ${active ? 'bg-cyan-400 shadow-sm shadow-cyan-400' : 'bg-slate-800'}`}></span>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Environmental Dials Card */}
          <Card className="bg-slate-900/30 border-slate-800/40 space-y-4">
            {/* Sustainability Dial */}
            <div>
              <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5">
                <span className="text-slate-400 font-medium flex items-center">
                  <Leaf className="h-4 w-4 mr-1.5 text-emerald-400" />
                  Eco-Sustainability Index
                </span>
                <span className="font-bold text-slate-200">{sustScore}%</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    sustScore > 80 ? 'bg-emerald-400' : sustScore > 60 ? 'bg-amber-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${sustScore}%` }}
                ></div>
              </div>
            </div>

            {/* Biodiversity risk Meter */}
            <div>
              <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5">
                <span className="text-slate-400 font-medium flex items-center">
                  <ShieldCheck className="h-4 w-4 mr-1.5 text-rose-400" />
                  Ecosystem Bleaching Risk
                </span>
                <span className="font-bold text-slate-200">{bioRisk}%</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    bioRisk < 30 ? 'bg-emerald-400' : bioRisk < 60 ? 'bg-amber-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${bioRisk}%` }}
                ></div>
              </div>
            </div>
          </Card>
        </div>

        {/* 2. Middle Map Column */}
        <div className="lg:col-span-2 h-[350px] sm:h-[450px] lg:h-auto flex flex-col">
          {loading ? (
            <Skeleton className="w-full h-full flex-grow rounded-2xl" />
          ) : (
            <OceanMap latestObservations={latestObservations} />
          )}
        </div>

        {/* 3. Right Details & AI insights sidebar */}
        <div className="space-y-6 lg:col-span-1">
          {/* AI recommendations panel */}
          <Card className="bg-slate-900/30 border-slate-800/40">
            <h3 className="text-sm font-bold text-slate-300 flex items-center mb-4">
              <Cpu className="h-4 w-4 mr-2 text-cyan-400 animate-pulse" />
              Dynamic AI Advisories
            </h3>
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : (
              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                {insights
                  .filter((ins) => !selectedRegion || ins.region_id === selectedRegion.id)
                  .map((ins) => (
                    <div 
                      key={ins.id} 
                      className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <Badge variant={ins.risk_level === 'High' ? 'error' : ins.risk_level === 'Medium' ? 'warning' : 'success'}>
                          {ins.category}
                        </Badge>
                        <span className="text-[10px] text-slate-500 font-bold">{ins.time_horizon}</span>
                      </div>
                      <p className="text-slate-300 font-light leading-relaxed mb-2">{ins.content}</p>
                      <div className="text-[10px] text-cyan-400 font-semibold border-t border-slate-900 pt-1.5">
                        Action: <span className="text-slate-400 font-normal">{ins.suggested_action}</span>
                      </div>
                    </div>
                ))}
              </div>
            )}
          </Card>

          {/* Recent anomaly alerts */}
          <Card className="bg-slate-900/30 border-slate-800/40">
            <h3 className="text-sm font-bold text-slate-300 flex items-center mb-4">
              <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
              Coastline Alerts
            </h3>
            <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1">
              {recentAlerts.map((alt, idx) => (
                <div key={idx} className="flex items-start space-x-2.5 p-2 bg-rose-500/5 border border-rose-500/10 rounded-lg text-xs">
                  <span className="mt-0.5 p-0.5 rounded bg-rose-500/20 text-rose-400 font-bold text-[9px]">{alt.date}</span>
                  <div>
                    <h5 className="font-bold text-slate-200">{alt.region}</h5>
                    <p className="text-slate-400 text-[11px] font-light mt-0.5">{alt.description}</p>
                  </div>
                </div>
              ))}
              {recentAlerts.length === 0 && (
                <div className="text-xs text-slate-500 italic py-2 text-center">No recent anomalies flagged</div>
              )}
            </div>
          </Card>

          {/* Mini trend chart */}
          {selectedRegion && miniChartData.length > 0 && (
            <Card className="bg-slate-900/30 border-slate-800/40">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-400 flex items-center">
                  <TrendingUp className="h-3.5 w-3.5 mr-1 text-orange-400" />
                  SST 7-Day Trend
                </h4>
                <span className="text-[10px] text-slate-500 font-semibold">{selectedRegion.name}</span>
              </div>
              <div className="w-full h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={miniChartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="miniSstGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <Area 
                      type="monotone" 
                      dataKey="sst" 
                      stroke="#f97316" 
                      fillOpacity={1} 
                      fill="url(#miniSstGrad)" 
                      strokeWidth={1.5}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
};
