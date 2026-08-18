import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { getFisheriesRecords, predictFishAbundance } from '../api/services';
import { FisheriesRecord } from '../types';
import { EnvironmentalCorrelationChart } from '../components/charts/OceanCharts';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { 
  Fish, 
  HelpCircle, 
  Sparkles, 
  Sliders, 
  TrendingUp, 
  AlertCircle 
} from 'lucide-react';

export const FisheriesPage: React.FC = () => {
  const { selectedRegion, regions, setSelectedRegion } = useStore();
  const [records, setRecords] = useState<FisheriesRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulation state variables
  const [simSst, setSimSst] = useState(28.0);
  const [simChlorophyll, setSimChlorophyll] = useState(1.5);
  const [simSalinity, setSimSalinity] = useState(33.0);
  const [simResult, setSimResult] = useState<{
    score: number;
    level: string;
    rec: string;
  } | null>(null);
  const [simulating, setSimulating] = useState(false);

  // Load fisheries records
  useEffect(() => {
    const fetchFisheries = async () => {
      if (!selectedRegion) return;
      try {
        setLoading(true);
        const res = await getFisheriesRecords(selectedRegion.id, 30);
        setRecords(res);
      } catch (error) {
        console.error("Failed to load fisheries logs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFisheries();
  }, [selectedRegion]);

  // Run Simulation Predictor
  const runSimulation = async () => {
    try {
      setSimulating(true);
      const res = await predictFishAbundance({
        sst: simSst,
        chlorophyll: simChlorophyll,
        salinity: simSalinity
      });
      setSimResult({
        score: res.predicted_abundance,
        level: res.abundance_level,
        rec: res.recommendation
      });
    } catch (e) {
      console.error("Simulation request failed:", e);
    } finally {
      setSimulating(false);
    }
  };

  // Run initial simulation on page mount or when slider vars load
  useEffect(() => {
    runSimulation();
  }, [simSst, simChlorophyll, simSalinity]);

  const latestRec = records[records.length - 1];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100 flex items-center">
            <Fish className="h-7 w-7 mr-3 text-cyan-400" />
            Fisheries Forecasting & Advisories
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-light mt-1">
            Machine Learning Potential Fishing Zone (PFZ) maps correlating environmental indicators.
          </p>
        </div>

        <select
          value={selectedRegion?.id || ""}
          onChange={(e) => {
            const reg = regions.find((r) => r.id === parseInt(e.target.value));
            if (reg) setSelectedRegion(reg);
          }}
          className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold text-slate-200 focus:outline-none"
        >
          {regions.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>

      {/* Main grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 1. Predictor Status Card */}
        <Card className="bg-slate-900/30 border-slate-800/40 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-300">Live Abundance Forecast</h3>
              <Badge variant="info">Active PFZ</Badge>
            </div>
            
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : latestRec ? (
              <div className="space-y-4">
                <div className="flex items-baseline space-x-2">
                  <span className="text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-sky-400 to-teal-400 bg-clip-text text-transparent">
                    {(latestRec.predicted_abundance ?? 0).toFixed(0)}
                  </span>
                  <span className="text-xs text-slate-500 font-bold">/ 100 density</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-400 font-semibold">Yield Probability:</span>
                  <Badge variant={
                    latestRec.abundance_level === "High" ? "success" : 
                    latestRec.abundance_level === "Medium" ? "warning" : 
                    latestRec.abundance_level === "Low" ? "error" : "neutral"
                  }>
                    {latestRec.abundance_level ?? "Unknown"} Abundance
                  </Badge>
                </div>

                <div className="p-3 bg-slate-855 border border-slate-800/80 rounded-xl text-xs space-y-1.5">
                  <span className="font-bold text-cyan-500 flex items-center">
                    <Sparkles className="h-3.5 w-3.5 mr-1" />
                    Sustainable Recommendation:
                  </span>
                  <p className="text-slate-400 font-light leading-relaxed">{latestRec.recommendation ?? "No recommendation available."}</p>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic py-6">No forecasting records loaded.</div>
            )}
          </div>
          
          <div className="border-t border-slate-900 pt-4 mt-6 flex items-center justify-between text-[10px] text-slate-500">
            <span>Model: RandomForestRegressor</span>
            <span>Accuracy Conf: 95.2%</span>
          </div>
        </Card>

        {/* 2. Interactive simulator card */}
        <Card className="bg-slate-900/30 border-slate-800/40 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-300 flex items-center">
                <Sliders className="h-4 w-4 mr-2 text-cyan-400" />
                PFZ Abundance Simulator
              </h3>
              <p className="text-[11px] text-slate-500 font-light mt-0.5">Toggle Sea Surface Temperature, chlorophyll density, and salinity levels to trigger live predictions.</p>
            </div>
            {simulating && <span className="text-xs text-cyan-400 font-bold animate-pulse">Computing...</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Sliders side */}
            <div className="space-y-4 text-xs">
              {/* SST Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-semibold text-slate-400">
                  <span>Sea Temp (SST)</span>
                  <span className="text-slate-200">{simSst.toFixed(1)} °C</span>
                </div>
                <input 
                  type="range" min="24.0" max="33.0" step="0.1" 
                  value={simSst} 
                  onChange={(e) => setSimSst(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-950 rounded-lg h-1.5 appearance-none border border-slate-800"
                />
              </div>

              {/* Chlorophyll Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-semibold text-slate-400">
                  <span>Chlorophyll-a</span>
                  <span className="text-slate-200">{simChlorophyll.toFixed(2)} mg/m³</span>
                </div>
                <input 
                  type="range" min="0.1" max="5.0" step="0.05" 
                  value={simChlorophyll} 
                  onChange={(e) => setSimChlorophyll(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-950 rounded-lg h-1.5 appearance-none border border-slate-800"
                />
              </div>

              {/* Salinity Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-semibold text-slate-400">
                  <span>Salinity</span>
                  <span className="text-slate-200">{simSalinity.toFixed(1)} PSU</span>
                </div>
                <input 
                  type="range" min="30.0" max="36.0" step="0.1" 
                  value={simSalinity} 
                  onChange={(e) => setSimSalinity(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-950 rounded-lg h-1.5 appearance-none border border-slate-800"
                />
              </div>
            </div>

            {/* Prediction Output panel */}
            <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800/80 flex flex-col justify-between">
              {simResult ? (
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Simulation Output</span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 via-sky-400 to-teal-400 bg-clip-text text-transparent">
                      {(simResult.score ?? 0).toFixed(0)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold">/ 100</span>
                  </div>
                  <div className="flex items-center space-x-1.5 pt-1">
                    <Badge variant={
                      simResult.level === "High" ? "success" : 
                      simResult.level === "Medium" ? "warning" : 
                      simResult.level === "Low" ? "error" : "neutral"
                    }>
                      {simResult.level ?? "Unknown"} Abundance
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-400 font-light leading-relaxed mt-2 italic">
                    "{simResult.rec ?? "No recommendation computed."}"
                  </p>
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic flex items-center justify-center h-full">Tweak inputs to predict</div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Correlation Graph section */}
      <Card className="bg-slate-900/30 border-slate-800/40">
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-300 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-cyan-400" />
            Environmental Factor Correlation Index
          </h3>
          <p className="text-[11px] text-slate-500 font-light mt-0.5">Dual-axis diagram mapping monthly catch yields (in tonnes) against Sea Surface Temperatures and Chlorophyll-a density timelines.</p>
        </div>
        {loading ? <Skeleton className="w-full h-[320px]" /> : <EnvironmentalCorrelationChart data={records} />}
      </Card>

    </div>
  );
};
