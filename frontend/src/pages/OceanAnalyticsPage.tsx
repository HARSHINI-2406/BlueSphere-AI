import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { getOceanObservations } from '../api/services';
import { OceanObservation } from '../types';
import { 
  SSTLineChart, 
  ChlorophyllAreaChart, 
  SalinityBarChart 
} from '../components/charts/OceanCharts';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { 
  Download, 
  Calendar, 
  Activity, 
  TrendingUp, 
  ShieldAlert, 
  AlertTriangle 
} from 'lucide-react';

export const OceanAnalyticsPage: React.FC = () => {
  const { selectedRegion, regions, setSelectedRegion } = useStore();
  const [days, setDays] = useState(30);
  const [data, setData] = useState<OceanObservation[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch observations when region or days filter updates
  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!selectedRegion) return;
      try {
        setLoading(true);
        const res = await getOceanObservations(selectedRegion.id, days);
        setData(res);
      } catch (error) {
        console.error("Failed to load analytics records:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [selectedRegion, days]);

  // Handle Export Report (Generates a clean CSV download)
  const handleExport = () => {
    if (data.length === 0 || !selectedRegion) return;
    
    const headers = ["Timestamp", "Region", "SST (°C)", "Chlorophyll (mg/m³)", "Salinity (PSU)", "Current Zonal (m/s)", "Current Meridional (m/s)", "Anomaly Score", "Is Anomaly"];
    const csvRows = [headers.join(",")];
    
    data.forEach((o) => {
      const row = [
        o.timestamp,
        selectedRegion.name,
        o.sst,
        o.chlorophyll,
        o.salinity,
        o.current_u,
        o.current_v,
        o.anomaly_score,
        o.is_anomaly
      ];
      csvRows.push(row.join(","));
    });
    
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bluesphere_ocean_report_${selectedRegion.name.toLowerCase()}_${days}d.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const anomalies = data.filter((o) => o.is_anomaly);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Upper Filters header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100 flex items-center">
            <Activity className="h-7 w-7 mr-3 text-cyan-400" />
            Oceanographic Observations
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-light mt-1">
            Visualizing physical, chemical, and thermal indicators with anomaly flags.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Region dropdown selection */}
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

          {/* Date range filter */}
          <div className="inline-flex rounded-xl bg-slate-900 border border-slate-800 p-1">
            {[7, 15, 30].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  days === d 
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {d} Days
              </button>
            ))}
          </div>

          {/* Export button */}
          <Button variant="outline" size="sm" onClick={handleExport} className="flex items-center space-x-1">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export Report</span>
          </Button>
        </div>
      </div>

      {/* Main Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SST Chart Card */}
        <Card className="bg-slate-900/30 border-slate-800/40 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-300">Sea Surface Temperature (SST)</h3>
              <p className="text-[11px] text-slate-500 font-light mt-0.5">Continuous satellite infrared temperature readouts in °C</p>
            </div>
            {data.length > 0 && (
              <Badge variant="info">Avg: {(data.reduce((acc, curr) => acc + curr.sst, 0) / data.length).toFixed(1)}°C</Badge>
            )}
          </div>
          {loading ? <Skeleton className="w-full h-[280px]" /> : <SSTLineChart data={data} />}
        </Card>

        {/* Anomalies side panel */}
        <Card className="bg-slate-900/30 border-slate-800/40 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-300 flex items-center">
              <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />
              Thermal Anomalies ({anomalies.length})
            </h3>
            <p className="text-[11px] text-slate-500 font-light mt-0.5">Spikes above 2.0 standard deviations from localized historical norms.</p>
          </div>

          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
            {anomalies.map((a, idx) => (
              <div key={idx} className="p-3 bg-rose-500/5 border border-rose-500/20 rounded-xl text-xs flex justify-between items-center">
                <div>
                  <p className="font-bold text-rose-400">Extreme Sea Temperature</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{new Date(a.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-slate-200">{a.sst}°C</span>
                  <p className="text-[9px] text-rose-400 font-semibold mt-0.5">{(a.anomaly_score * 100).toFixed(0)}% severity</p>
                </div>
              </div>
            ))}

            {!loading && anomalies.length === 0 && (
              <div className="text-xs text-slate-500 italic py-6 text-center">No anomalies registered during this date window.</div>
            )}
          </div>
        </Card>
      </div>

      {/* Second Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chlorophyll Concentration Card */}
        <Card className="bg-slate-900/30 border-slate-800/40">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-300">Chlorophyll-a density</h3>
              <p className="text-[11px] text-slate-500 font-light mt-0.5">Biomarker representing phytoplankton density (base of marine food chains)</p>
            </div>
            {data.length > 0 && (
              <Badge variant="success">Max: {Math.max(...data.map(o => o.chlorophyll)).toFixed(1)} mg/m³</Badge>
            )}
          </div>
          {loading ? <Skeleton className="w-full h-[280px]" /> : <ChlorophyllAreaChart data={data} />}
        </Card>

        {/* Salinity Level Card */}
        <Card className="bg-slate-900/30 border-slate-800/40">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-300">Salinity Index (PSU)</h3>
              <p className="text-[11px] text-slate-500 font-light mt-0.5">Salt concentration key to osmotic balances and species distributions</p>
            </div>
            {data.length > 0 && (
              <Badge variant="info">Avg: {(data.reduce((acc, curr) => acc + curr.salinity, 0) / data.length).toFixed(1)} PSU</Badge>
            )}
          </div>
          {loading ? <Skeleton className="w-full h-[280px]" /> : <SalinityBarChart data={data} />}
        </Card>
      </div>

      {/* Heatmap Grid Section */}
      <Card className="bg-slate-900/30 border-slate-800/40">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-300 flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-cyan-400" />
            Thermal Heatwave Calendar Heatmap (Anomaly Matrix)
          </h3>
          <p className="text-[11px] text-slate-500 font-light mt-0.5">Daily visual grid tracking thermal spikes. Darker boxes show low anomalies, while cyan and red indicators represent high anomaly scores.</p>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {loading ? (
            <Skeleton className="w-full h-12" />
          ) : (
            data.map((o, idx) => {
              let color = 'bg-slate-900 hover:bg-slate-850 border border-slate-800/60';
              if (o.is_anomaly) {
                color = 'bg-rose-500/80 border border-rose-400 shadow-sm shadow-rose-500/20';
              } else if (o.anomaly_score > 0.4) {
                color = 'bg-cyan-500/60 border border-cyan-400/40';
              } else if (o.anomaly_score > 0.2) {
                color = 'bg-cyan-900/40 border border-cyan-800/40';
              }

              return (
                <div
                  key={idx}
                  className={`h-7 w-7 rounded-md cursor-help flex items-center justify-center text-[8px] font-bold text-slate-400 group relative ${color}`}
                >
                  {new Date(o.timestamp).getDate()}
                  
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-950 border border-slate-800 text-[10px] text-slate-300 p-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                    <p className="font-semibold">{new Date(o.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</p>
                    <p>SST: {o.sst}°C</p>
                    <p>Anomaly Score: {(o.anomaly_score * 100).toFixed(0)}%</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

    </div>
  );
};
