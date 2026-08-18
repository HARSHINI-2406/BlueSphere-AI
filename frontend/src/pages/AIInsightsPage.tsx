import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { getAIInsights, predictFishAbundance } from '../api/services';
import { AIInsight } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { 
  Cpu, 
  Sparkles, 
  HelpCircle, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Clock, 
  Gauge 
} from 'lucide-react';

export const AIInsightsPage: React.FC = () => {
  const { selectedRegion, regions, setSelectedRegion } = useStore();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>("All");

  // Form states for generating dynamic mock insights
  const [formSst, setFormSst] = useState("28.2");
  const [formChlo, setFormChlo] = useState("1.8");
  const [formSal, setFormSal] = useState("33.4");
  const [generatedAdvisory, setGeneratedAdvisory] = useState<any | null>(null);
  const [generating, setGenerating] = useState(false);

  // Load insights
  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const res = await getAIInsights(selectedRegion?.id);
        setInsights(res);
      } catch (error) {
        console.error("Failed to load AI insights:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, [selectedRegion]);

  // Handle Dynamic Advisory Generation
  const handleGenerateAdvisory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRegion) return;
    try {
      setGenerating(true);
      const sstVal = parseFloat(formSst);
      const chloVal = parseFloat(formChlo);
      const salVal = parseFloat(formSal);

      // Run prediction
      const modelRes = await predictFishAbundance({
        sst: sstVal,
        chlorophyll: chloVal,
        salinity: salVal
      });

      // Assemble natural language reasoning based on inputs
      let content = "";
      let suggestedAction = "";
      let riskLevel = "Low";
      let confidence = 89.5;
      let horizon = "Next 48 Hours";

      if (sstVal > 30.5) {
        content = `Satellite telemetry in ${selectedRegion.name} exhibits severe Sea Surface Temperature readings of ${sstVal}°C. Reduced salinity (${salVal} PSU) suggests elevated freshwater runoff.`;
        suggestedAction = "Initiate bleaching surveillance on benthic systems. Restrict localized warm-water thermal outflows.";
        riskLevel = "High";
        confidence = 91.2;
        horizon = "14 Days";
      } else if (modelRes.abundance_level === "High") {
        content = `Chlorophyll concentration is elevated at ${chloVal} mg/m³, indicating high primary productivity. The RandomForest regressor flags active pelagic fish schooling patterns.`;
        suggestedAction = "Distribute Potential Fishing Zone (PFZ) coordinate markers to local sustainable trawlers.";
        riskLevel = "Low";
        confidence = 94.6;
        horizon = "5 Days";
      } else {
        content = `Hydrographic profiles report standard salinity (${salVal} PSU) and balanced temperature values (${sstVal}°C) in the shelf channels of ${selectedRegion.name}.`;
        suggestedAction = "Continue standard automated multi-sensor buoy monitoring feeds. No immediate anomalies observed.";
        riskLevel = "Medium";
        confidence = 88.0;
        horizon = "Seasonal";
      }

      setGeneratedAdvisory({
        region: selectedRegion.name,
        category: sstVal > 30.5 ? "Biodiversity" : modelRes.abundance_level === "High" ? "Fisheries" : "Oceanography",
        content,
        suggestedAction,
        riskLevel,
        confidence,
        timeHorizon: horizon
      });

    } catch (err) {
      console.error("Advisory generation failed:", err);
    } finally {
      setGenerating(false);
    }
  };

  const filteredInsights = filterCategory === "All" 
    ? insights 
    : insights.filter(ins => ins.category === filterCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header and filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100 flex items-center">
            <Cpu className="h-7 w-7 mr-3 text-cyan-400" />
            AI Recommendations Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-light mt-1">
            Automated environmental analysis, confidence matrices, and maritime advisories.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
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

          {/* Category Filter buttons */}
          <div className="inline-flex rounded-xl bg-slate-900 border border-slate-800 p-1">
            {["All", "Oceanography", "Fisheries", "Biodiversity"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterCategory === cat 
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main split dashboard layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left side column: dynamic advisory generation console */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-slate-900/30 border-slate-800/40">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-slate-300 flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-cyan-400" />
                Advisory Generator Console
              </h3>
              <p className="text-[11px] text-slate-500 font-light mt-0.5">Input environmental readings to run the neural rule mapping models and generate natural-language recommendations.</p>
            </div>

            <form onSubmit={handleGenerateAdvisory} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-semibold">SST (°C)</label>
                  <input 
                    type="number" step="0.1" value={formSst} 
                    onChange={(e) => setFormSst(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none"
                    placeholder="28.2" required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-semibold">Chlorophyll</label>
                  <input 
                    type="number" step="0.05" value={formChlo} 
                    onChange={(e) => setFormChlo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none"
                    placeholder="1.8" required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-semibold">Salinity (PSU)</label>
                  <input 
                    type="number" step="0.1" value={formSal} 
                    onChange={(e) => setFormSal(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none"
                    placeholder="33.4" required
                  />
                </div>
              </div>

              <Button type="submit" disabled={generating} className="w-full">
                {generating ? "Mapping Rules..." : "Synthesize Advisory"}
              </Button>
            </form>

            {/* Generated results rendering panel */}
            {generatedAdvisory && (
              <div className="mt-5 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs space-y-3">
                <div className="flex justify-between items-center">
                  <Badge variant={generatedAdvisory.riskLevel === 'High' ? 'error' : generatedAdvisory.riskLevel === 'Medium' ? 'warning' : 'success'}>
                    {generatedAdvisory.category}
                  </Badge>
                  <span className="text-[10px] text-slate-500 font-bold">{generatedAdvisory.timeHorizon}</span>
                </div>
                
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Synthesized Advisory:</span>
                  <p className="text-slate-200 mt-1 leading-relaxed font-light">"{generatedAdvisory.content}"</p>
                </div>

                <div className="pt-2 border-t border-slate-900 space-y-1">
                  <p className="text-cyan-400 font-semibold">Suggested Action:</p>
                  <p className="text-slate-400 font-light">{generatedAdvisory.suggestedAction}</p>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
                  <span>Region: {generatedAdvisory.region}</span>
                  <span className="text-cyan-400 font-bold">Confidence: {generatedAdvisory.confidence}%</span>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right side: aggregate list of recommendation cards */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-slate-400 flex items-center mb-2 px-1">
            Active Recommendations ({filteredInsights.length})
          </h3>

          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {filteredInsights.map((ins) => (
                <Card 
                  key={ins.id}
                  className="bg-slate-900/30 border-slate-800/40 p-5 hover:border-slate-700/60 transition-colors flex flex-col md:flex-row gap-4"
                >
                  {/* Left stats parameters */}
                  <div className="flex flex-row md:flex-col justify-between items-baseline md:items-center p-3 rounded-2xl bg-slate-950/60 border border-slate-850 md:min-w-[130px] shrink-0 text-center gap-1">
                    <div>
                      <Gauge className="h-4 w-4 text-cyan-400 mx-auto hidden md:block mb-1" />
                      <span className="text-2xl font-black text-slate-200">{(ins.confidence ?? 0).toFixed(1)}%</span>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Confidence</p>
                    </div>
                    <div className="md:mt-3 border-l md:border-l-0 md:border-t border-slate-800/80 pl-4 md:pl-0 md:pt-2 w-full flex flex-col items-end md:items-center">
                      <Clock className="h-3.5 w-3.5 text-indigo-400 mx-auto hidden md:block mb-1" />
                      <span className="text-[10px] text-slate-300 font-bold">{ins.time_horizon}</span>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Horizon</p>
                    </div>
                  </div>

                  {/* Right textual details */}
                  <div className="space-y-2.5 flex-grow text-xs">
                    <div className="flex justify-between items-center">
                      <Badge variant={ins.category === 'Fisheries' ? 'success' : ins.category === 'Biodiversity' ? 'error' : 'info'}>
                        {ins.category} Advisory
                      </Badge>
                      <span className="flex items-center text-[10px] font-bold text-slate-400">
                        Risk: 
                        <span className={`ml-1 font-extrabold ${
                          ins.risk_level === 'High' ? 'text-rose-400' : 
                          ins.risk_level === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
                        }`}>{ins.risk_level}</span>
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-300 uppercase text-[10px] tracking-wider text-slate-500">Natural-Language Insight:</h4>
                      <p className="text-slate-200 mt-1 leading-relaxed font-light">"{ins.content}"</p>
                    </div>

                    <div className="pt-2 border-t border-slate-900 space-y-1">
                      <h4 className="font-bold text-cyan-400 uppercase text-[10px] tracking-wider">Suggested Operational Action:</h4>
                      <p className="text-slate-400 font-light">{ins.suggested_action}</p>
                    </div>
                  </div>
                </Card>
              ))}

              {filteredInsights.length === 0 && (
                <div className="text-xs text-slate-500 italic py-12 text-center">No advisories mapped in this category filter.</div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
