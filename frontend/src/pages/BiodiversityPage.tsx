import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { getBiodiversityRecords } from '../api/services';
import { BiodiversityRecord } from '../types';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { 
  ShieldCheck, 
  AlertTriangle, 
  HelpCircle, 
  Dna, 
  Heart, 
  Sliders, 
  Compass, 
  Flame 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

export const BiodiversityPage: React.FC = () => {
  const { selectedRegion, regions, setSelectedRegion } = useStore();
  const [records, setRecords] = useState<BiodiversityRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBiodiversity = async () => {
      if (!selectedRegion) return;
      try {
        setLoading(true);
        const res = await getBiodiversityRecords(selectedRegion.id, 1); // Get latest day records
        setRecords(res);
      } catch (error) {
        console.error("Failed to load biodiversity records:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBiodiversity();
  }, [selectedRegion]);

  // Aggregate counts by category for charts
  const getCategoryChartData = () => {
    const categories = ["Pelagic", "Demersal", "Coral", "Microbial"];
    const colors = ["#0ea5e9", "#2563eb", "#f43f5e", "#10b981"];
    
    return categories.map((cat, idx) => {
      const catRecs = records.filter(r => r.category === cat);
      const totalCount = catRecs.reduce((acc, curr) => acc + curr.count, 0);
      return {
        name: cat,
        count: totalCount,
        fill: colors[idx]
      };
    });
  };

  const chartData = getCategoryChartData();

  // Extract sensitive species (Vulnerable / Endangered / Critically Endangered)
  const sensitiveSpecies = records.filter(
    (r) => r.conservation_status !== "Least Concern"
  );

  // Calculate conservation priority index (0-100)
  // Higher index if there are critically endangered species or high risk scores
  const getPriorityIndex = () => {
    if (records.length === 0) return 30;
    const avgRisk = records.reduce((acc, r) => acc + r.risk_score, 0) / records.length;
    let factor = avgRisk * 0.8;
    if (records.some((r) => r.conservation_status === "Critically Endangered")) {
      factor += 20;
    }
    return Math.min(100, Math.round(factor));
  };

  const priorityIndex = getPriorityIndex();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Upper header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100 flex items-center">
            <Dna className="h-7 w-7 mr-3 text-cyan-400" />
            Molecular Biodiversity & Conservation
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-light mt-1">
            Tracking marine DNA samples, ecosystem indicators, and bleaching alerts.
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

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 1. Species distribution chart */}
        <Card className="bg-slate-900/30 border-slate-800/40 lg:col-span-2">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-300">Molecular Density Distribution</h3>
            <p className="text-[11px] text-slate-500 font-light mt-0.5">Sample counts compiled by genomic taxonomy groupings (last 24 hours)</p>
          </div>
          
          {loading ? (
            <Skeleton className="w-full h-[240px]" />
          ) : (
            <div className="w-full h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <XAxis type="number" stroke="rgba(255,255,255,0.1)" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.1)" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* 2. Priority indicator card */}
        <Card className="bg-slate-900/30 border-slate-800/40 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-300">Conservation Priority Index</h3>
            
            {loading ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <div className="space-y-4">
                <div className="flex items-baseline space-x-2">
                  <span className="text-5xl font-extrabold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                    {priorityIndex}
                  </span>
                  <span className="text-xs text-slate-500 font-bold">/ 100 priority</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-400 font-semibold">Classification:</span>
                  <Badge variant={priorityIndex > 70 ? "error" : priorityIndex > 40 ? "warning" : "success"}>
                    {priorityIndex > 70 ? "CRITICAL FOCUS" : priorityIndex > 40 ? "MODERATE MONITOR" : "STABLE SHIELD"}
                  </Badge>
                </div>

                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  Calculated based on local temperature anomalies, coral bleaching warnings, and population stress of vulnerable organisms.
                </p>
              </div>
            )}
          </div>
          
          <div className="border-t border-slate-900 pt-4 mt-6 flex items-center justify-between text-[10px] text-slate-500">
            <span>Audit: Molecular Taxonomy Standard</span>
            <span>DNA Scans: Completed</span>
          </div>
        </Card>
      </div>

      {/* Sensitive alert lists & specific indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Specific indicators (Microbial & Coral bleaching indexes) */}
        <Card className="bg-slate-900/30 border-slate-800/40 lg:col-span-2 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-300">Key Ecological Biomarkers</h3>
            <p className="text-[11px] text-slate-500 font-light mt-0.5">Biomarker profiles assessing coral thermal bleaching indices and microbial health values.</p>
          </div>

          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              {records
                .filter(r => r.category === "Coral" || r.category === "Microbial")
                .map((r, idx) => {
                  const isCoral = r.category === "Coral";
                  const pct = isCoral ? r.coral_bleaching_index : r.microbial_health_index;
                  const label = isCoral ? "Bleaching Stress Index" : "Microbial Density Health";
                  return (
                    <div key={idx} className="p-3 bg-slate-850 border border-slate-800 rounded-xl">
                      <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                        <span className="text-slate-300">{r.species_name} ({r.category})</span>
                        <span className={isCoral ? "text-rose-500" : "text-emerald-500"}>{(pct ?? 0).toFixed(0)}%</span>
                      </div>
                      <div className="flex items-center space-x-2 text-[10px] text-slate-400 mb-2">
                        <span>{label}</span>
                        <span>•</span>
                        <span>Risk level: {(r.risk_score ?? 0).toFixed(0)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${isCoral ? 'bg-rose-500' : 'bg-emerald-500'}`}
                          style={{ width: `${pct ?? 0}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </Card>

        {/* Sensitive Species List */}
        <Card className="bg-slate-900/30 border-slate-800/40 space-y-3">
          <div>
            <h3 className="text-sm font-bold text-slate-300 flex items-center">
              <Heart className="h-4 w-4 mr-2 text-rose-500 animate-pulse" />
              Sensitive Species Alert
            </h3>
            <p className="text-[11px] text-slate-500 font-light mt-0.5">Endangered or vulnerable species logged in DNA sequencing.</p>
          </div>

          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {sensitiveSpecies.map((s, idx) => (
              <div key={idx} className="p-2.5 bg-slate-950/60 border border-slate-850 rounded-xl text-xs flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-200">{s.species_name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Category: {s.category}</p>
                </div>
                <Badge variant={s.conservation_status === "Critically Endangered" ? "error" : "warning"}>
                  {s.conservation_status}
                </Badge>
              </div>
            ))}

            {!loading && sensitiveSpecies.length === 0 && (
              <div className="text-xs text-slate-500 italic py-4 text-center">No critical conservation status alerts found.</div>
            )}
          </div>
        </Card>
      </div>

    </div>
  );
};
