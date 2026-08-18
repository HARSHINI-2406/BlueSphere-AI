import React from 'react';
import { Badge } from "../components/ui/Badge";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { 
  Waves, 
  ArrowRight, 
  Database, 
  Cpu, 
  ShieldCheck, 
  TrendingUp, 
  Compass, 
  CheckCircle2, 
  MessageSquare,
  Globe 
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useStore } from '../store/useStore';

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useStore();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const features = [
    {
      title: "Ocean Data Streams",
      description: "Real-time tracking of sea surface temperatures, salinity, and multi-sensor thermal anomalies.",
      icon: Waves,
      color: "from-cyan-500 to-blue-500"
    },
    {
      title: "Fisheries Forecasting",
      description: "Machine learning models forecasting abundance density corridors to map optimal harvest pathways.",
      icon: TrendingUp,
      color: "from-emerald-500 to-teal-500"
    },
    {
      title: "Biodiversity Tracking",
      description: "Integrated species density logs mapping coral thermal stress index values and microbial biomarkers.",
      icon: ShieldCheck,
      color: "from-purple-500 to-indigo-500"
    },
    {
      title: "Automated Recommendations",
      description: "AI-driven decision systems outputting natural-language advisories, risk maps, and action items.",
      icon: Cpu,
      color: "from-orange-500 to-amber-500"
    }
  ];

  const testimonials = [
    {
      quote: "BlueSphere AI has completely transformed how our marine biology teams cross-reference temperature fluctuations with local coral surveys. The anomalies warnings are spot on.",
      author: "Dr. Sarah Jenkins",
      role: "Marine Ecology Lead, Oceania Data Labs"
    },
    {
      quote: "The abundance forecasts have optimized our sustainable harvesting routes, significantly reducing fuel consumption while keeping us fully compliant with regional guides.",
      author: "Marcus Vance",
      role: "Operations Director, Pacific Harvester Group"
    }
  ];

  return (
    <div className="relative min-h-screen bg-ocean-950 text-slate-100 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-600/5 blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-600/5 blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative z-10">
        <motion.div 
          className="text-center space-y-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs sm:text-sm font-semibold tracking-wider uppercase mb-2">
            <Globe className="h-4 w-4 text-cyan-400" />
            <span>Commercial Marine Intelligence</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-slate-100 via-slate-100 to-slate-300 bg-clip-text text-transparent">AI-Powered </span>
            <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-teal-400 bg-clip-text text-transparent">
              Marine Analytics
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            BlueSphere AI delivers marine intelligence for ocean monitoring, fisheries forecasting, and biodiversity analytics. Unlock predictive datasets to streamline sustainable offshore operations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to={isAuthenticated ? "/dashboard" : "/login"}>
              <Button size="lg" className="w-full sm:w-auto flex items-center space-x-2 group">
                <span>{isAuthenticated ? "Go to Dashboard" : "Get Started"}</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            {!isAuthenticated && (
              <Link to="/register">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <span>Register Account</span>
                </Button>
              </Link>
            )}
          </div>
        </motion.div>

        {/* Features list */}
        <div className="mt-28">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight">Unified Solutions</h2>
            <p className="text-sm text-slate-400 mt-2 font-light">
              Scientific precision met with machine learning automation to map ecological indicators.
            </p>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <motion.div key={idx} variants={itemVariants}>
                  <Card className="h-full flex flex-col items-start border-slate-800/40 bg-slate-900/30 hover:border-slate-700/60 hover:-translate-y-1 transition-all duration-300">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${feat.color} text-slate-50 mb-4 shadow-sm shadow-cyan-500/5`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-200">{feat.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed font-light">
                      {feat.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Interactive preview mockup */}
        <div className="mt-28">
          <Card className="bg-slate-900/10 border-slate-800/60 p-6 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-cyan-600/5 blur-[80px] pointer-events-none"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="space-y-4 lg:col-span-1">
                <Badge variant="info">Console Preview</Badge>
                <h2 className="text-3xl font-bold">Operational Control Room</h2>
                <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
                  Gain instant access to thermal heatmaps, salinity indices, current maps, and natural-language recommendations inside one unified workspace.
                </p>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                    <span>Dynamic React Leaflet map controls</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                    <span>Real-time predictive ML engines</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                    <span>Secure multi-user JWT authentication</span>
                  </div>
                </div>
              </div>

              {/* Styled Mockup box */}
              <div className="lg:col-span-2 bg-slate-950 border border-slate-850 p-4 sm:p-6 rounded-2xl space-y-4 shadow-glass shadow-slate-950/50">
                <div className="flex justify-between items-center border-b border-slate-850 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold tracking-wider">WORKSPACE PREVIEW</span>
                </div>
                
                {/* Visual Grid Mockup */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                  <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-xl space-y-2">
                    <span className="text-slate-500 font-bold block">FISHERIES FORECAST</span>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-extrabold text-cyan-400">82</span>
                      <span className="text-[10px] text-slate-500 font-semibold">/ 100 Abundance</span>
                    </div>
                    <Badge variant="success">High Density Corridor</Badge>
                  </div>
                  <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-xl space-y-2">
                    <span className="text-slate-500 font-bold block">BIODIVERSITY BLEACHING RISK</span>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-extrabold text-rose-400">18%</span>
                      <span className="text-[10px] text-slate-500 font-semibold">Stress Index</span>
                    </div>
                    <Badge variant="success">Shield Protected</Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="mt-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Why Organizations Choose BlueSphere</h2>
              <p className="text-sm sm:text-base text-slate-400 font-light leading-relaxed">
                Our platform delivers reliable physical and chemical oceanography metrics to optimize marine activities. From shipping routing to offshore aquaculture and impact modeling, we help firms make data-backed ESG decisions.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 text-xs sm:text-sm">
                  <div className="mt-1 p-1 bg-cyan-500/10 rounded border border-cyan-500/20 text-cyan-400">
                    <Database className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200">Scaleable Architecture</h4>
                    <p className="text-xs text-slate-400 font-light mt-0.5">Built to parse high-frequency inputs from satellite scans and sensory buoys with PostgreSQL structures.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 text-xs sm:text-sm">
                  <div className="mt-1 p-1 bg-cyan-500/10 rounded border border-cyan-500/20 text-cyan-400">
                    <Compass className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200">Dynamic Risk Auditing</h4>
                    <p className="text-xs text-slate-400 font-light mt-0.5">Automated isolation anomaly detectors map changes, allowing immediate response to rising heatwaves.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonials Section */}
            <div className="space-y-6 lg:pl-6">
              <h3 className="text-sm font-bold text-slate-300 flex items-center px-1">
                <MessageSquare className="h-4 w-4 mr-2 text-cyan-400" />
                Trusted by Marine Professionals
              </h3>
              
              <div className="space-y-4">
                {testimonials.map((test, idx) => (
                  <Card key={idx} className="bg-slate-900/30 border-slate-800/40 p-5 space-y-3">
                    <p className="text-xs text-slate-300 italic font-light leading-relaxed">
                      "{test.quote}"
                    </p>
                    <div className="text-[10px]">
                      <strong className="text-cyan-400 block">{test.author}</strong>
                      <span className="text-slate-500 font-semibold">{test.role}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="mt-28 mb-12 text-center max-w-3xl mx-auto p-10 bg-gradient-to-tr from-slate-900 to-indigo-950/20 border border-slate-800/80 rounded-3xl relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full bg-cyan-500/5 blur-[50px] pointer-events-none"></div>
          <div className="relative z-10 space-y-5">
            <h2 className="text-3xl font-extrabold text-slate-100">Ready to Analyze?</h2>
            <p className="text-xs sm:text-sm text-slate-400 font-light max-w-xl mx-auto">
              Register now and begin exploring predictive datasets for ocean metrics, fish abundance indicators, and biological records.
            </p>
            <div className="flex justify-center">
              <Link to="/register">
                <Button size="lg" className="flex items-center space-x-2 group">
                  <span>Create Account</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
