import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

interface ChartDataPoint {
  timestamp: string;
  sst: number;
  chlorophyll: number;
  salinity: number;
  [key: string]: any;
}

interface ChartProps {
  data: ChartDataPoint[];
}

// Utility to format date strings to readable shorthand (e.g. "04 Aug")
const formatDate = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  } catch (e) {
    return dateStr;
  }
};

// Custom tooltip renderer for a premium dark look
const CustomTooltip = ({ active, payload, label, suffix = "" }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950/90 border border-slate-800 p-3 rounded-xl shadow-lg backdrop-blur-sm text-xs">
        <p className="font-bold text-slate-400 mb-1">{formatDate(label)}</p>
        {payload.map((item: any, index: number) => (
          <p key={index} className="font-medium" style={{ color: item.color || item.fill }}>
            {item.name}: <span className="font-semibold text-slate-100">{(item.value ?? 0).toFixed(2)}{suffix}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// 1. SST Time-Series Line Chart
export const SSTLineChart: React.FC<ChartProps> = ({ data }) => {
  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={formatDate} 
            tick={{ fill: '#64748b', fontSize: 10 }}
            stroke="rgba(255,255,255,0.1)"
          />
          <YAxis 
            domain={['auto', 'auto']} 
            tick={{ fill: '#64748b', fontSize: 10 }}
            stroke="rgba(255,255,255,0.1)"
          />
          <Tooltip content={<CustomTooltip suffix="°C" />} />
          <Line 
            name="Sea Surface Temperature"
            type="monotone" 
            dataKey="sst" 
            stroke="#f97316" 
            strokeWidth={3}
            dot={{ r: 2, fill: '#f97316', strokeWidth: 0 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// 2. Chlorophyll Area Chart
export const ChlorophyllAreaChart: React.FC<ChartProps> = ({ data }) => {
  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="chloGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={formatDate} 
            tick={{ fill: '#64748b', fontSize: 10 }}
            stroke="rgba(255,255,255,0.1)"
          />
          <YAxis 
            tick={{ fill: '#64748b', fontSize: 10 }}
            stroke="rgba(255,255,255,0.1)"
          />
          <Tooltip content={<CustomTooltip suffix=" mg/m³" />} />
          <Area 
            name="Chlorophyll Concentration"
            type="monotone" 
            dataKey="chlorophyll" 
            stroke="#10b981" 
            fillOpacity={1} 
            fill="url(#chloGrad)"
            strokeWidth={2.5}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// 3. Salinity Bar Chart
export const SalinityBarChart: React.FC<ChartProps> = ({ data }) => {
  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={formatDate} 
            tick={{ fill: '#64748b', fontSize: 10 }}
            stroke="rgba(255,255,255,0.1)"
          />
          <YAxis 
            domain={[28, 'auto']} 
            tick={{ fill: '#64748b', fontSize: 10 }}
            stroke="rgba(255,255,255,0.1)"
          />
          <Tooltip content={<CustomTooltip suffix=" PSU" />} />
          <Bar 
            name="Salinity Level"
            dataKey="salinity" 
            fill="#0ea5e9" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// 4. Fisheries Environmental Correlation Chart (Catch vs SST & Chlorophyll)
interface CorrelationProps {
  data: any[];
}
export const EnvironmentalCorrelationChart: React.FC<CorrelationProps> = ({ data }) => {
  return (
    <div className="w-full h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 15, right: -10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={formatDate} 
            tick={{ fill: '#64748b', fontSize: 10 }}
            stroke="rgba(255,255,255,0.1)"
          />
          {/* Left Y-Axis for Catch Tonnes */}
          <YAxis 
            yAxisId="left" 
            tick={{ fill: '#64748b', fontSize: 10 }}
            stroke="rgba(255,255,255,0.1)"
          />
          {/* Right Y-Axis for SST & Chlorophyll */}
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            tick={{ fill: '#64748b', fontSize: 10 }}
            stroke="rgba(255,255,255,0.1)"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
          
          <Bar 
            yAxisId="left" 
            name="Catch (Tonnes)" 
            dataKey="catch_tonnes" 
            fill="#3b82f6" 
            opacity={0.7}
            radius={[3, 3, 0, 0]}
          />
          <Line 
            yAxisId="right" 
            name="SST (°C)" 
            type="monotone" 
            dataKey="sst" 
            stroke="#f97316" 
            strokeWidth={2}
            dot={false}
          />
          <Line 
            yAxisId="right" 
            name="Chlorophyll (mg/m³)" 
            type="monotone" 
            dataKey="chlorophyll" 
            stroke="#10b981" 
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
