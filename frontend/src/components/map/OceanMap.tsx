import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useStore } from '../../store/useStore';
import { Region, OceanObservation } from '../../types';
import { Thermometer, Droplet, Eye, Compass, ShieldAlert } from 'lucide-react';

// Custom component to adjust map view programmatically when active region changes
const MapRecenter: React.FC<{ coords: [number, number] | null }> = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView(coords, 6, { animate: true, duration: 1 });
    }
  }, [coords, map]);
  return null;
};

interface OceanMapProps {
  latestObservations: Record<number, OceanObservation>;
}

export const OceanMap: React.FC<OceanMapProps> = ({ latestObservations }) => {
  const { regions, selectedRegion, setSelectedRegion, activeLayers } = useStore();

  // Create custom glowing markers based on active metrics (SST -> orange/red, Chlorophyll -> green/cyan, Salinity -> cyan)
  const getMarkerIcon = (regionId: number) => {
    const obs = latestObservations[regionId];
    let color = '#06b6d4'; // default cyan
    let glowColor = 'rgba(6, 182, 212, 0.4)';

    if (obs) {
      if (obs.is_anomaly) {
        color = '#ef4444'; // Red for anomaly
        glowColor = 'rgba(239, 68, 68, 0.6)';
      } else if (activeLayers.includes('Chlorophyll') && !activeLayers.includes('SST')) {
        color = '#10b981'; // Green for high chlorophyll
        glowColor = 'rgba(16, 185, 129, 0.4)';
      } else if (activeLayers.includes('SST')) {
        if (obs.sst > 29) {
          color = '#f97316'; // Orange for high temp
          glowColor = 'rgba(249, 115, 22, 0.4)';
        }
      }
    }

    return L.divIcon({
      html: `
        <div style="position: relative; display: flex; width: 30px; height: 30px; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background-color: ${color}; opacity: 0.45; animation: leaflet-ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: relative; width: 12px; height: 12px; border-radius: 50%; background-color: ${color}; border: 2.5px solid #020d1a; box-shadow: 0 0 12px ${color};"></div>
        </div>
        <style>
          @keyframes leaflet-ping {
            0% { transform: scale(0.3); opacity: 0.9; }
            100% { transform: scale(1.3); opacity: 0; }
          }
        </style>
      `,
      className: 'custom-leaflet-pulse',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
  };

  const mapCenter: [number, number] = selectedRegion
    ? [selectedRegion.latitude, selectedRegion.longitude]
    : [14.5, 81.5]; // Centered to capture mainland India and Andaman islands

  const activeCenterCoords: [number, number] | null = selectedRegion
    ? [selectedRegion.latitude, selectedRegion.longitude]
    : null;

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden border border-slate-800/80 shadow-glass">
      <MapContainer
        center={mapCenter}
        zoom={selectedRegion ? 6 : 5}
        style={{ width: '100%', height: '100%', background: '#020d1a' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {regions.map((region) => {
          const obs = latestObservations[region.id];
          return (
            <Marker
              key={region.id}
              position={[region.latitude, region.longitude]}
              icon={getMarkerIcon(region.id)}
              eventHandlers={{
                click: () => {
                  setSelectedRegion(region);
                },
              }}
            >
              <Popup className="custom-map-popup">
                <div className="p-3 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 min-w-[220px]">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-extrabold text-sm text-cyan-400">{region.name}</h3>
                    {obs?.is_anomaly && (
                      <span className="flex items-center px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-bold border border-rose-500/30">
                        ANOMALY
                      </span>
                    )}
                  </div>
                  
                  {obs ? (
                    <div className="space-y-1.5 text-xs text-slate-300">
                      {activeLayers.includes('SST') && (
                        <div className="flex items-center justify-between">
                          <span className="flex items-center text-slate-400"><Thermometer className="h-3 w-3 mr-1 text-orange-400" /> Temperature:</span>
                          <span className="font-semibold text-slate-200">{obs.sst}°C</span>
                        </div>
                      )}
                      {activeLayers.includes('Chlorophyll') && (
                        <div className="flex items-center justify-between">
                          <span className="flex items-center text-slate-400"><Eye className="h-3 w-3 mr-1 text-emerald-400" /> Chlorophyll:</span>
                          <span className="font-semibold text-slate-200">{obs.chlorophyll} mg/m³</span>
                        </div>
                      )}
                      {activeLayers.includes('Salinity') && (
                        <div className="flex items-center justify-between">
                          <span className="flex items-center text-slate-400"><Droplet className="h-3 w-3 mr-1 text-cyan-400" /> Salinity:</span>
                          <span className="font-semibold text-slate-200">{obs.salinity} PSU</span>
                        </div>
                      )}
                      {activeLayers.includes('Currents') && (
                        <div className="flex items-center justify-between">
                          <span className="flex items-center text-slate-400"><Compass className="h-3 w-3 mr-1 text-indigo-400" /> Currents:</span>
                          <span className="font-semibold text-slate-200">
                            {Math.sqrt(obs.current_u ** 2 + obs.current_v ** 2).toFixed(2)} m/s
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-1.5 border-t border-slate-800">
                        <span className="flex items-center text-slate-400"><ShieldAlert className="h-3 w-3 mr-1 text-sky-400" /> Marine Risk:</span>
                        <span className={`font-bold ${obs.anomaly_score > 0.6 ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {(obs.anomaly_score * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 py-1">No oceanographic logs available</div>
                  )}

                  <button
                    onClick={() => setSelectedRegion(region)}
                    className="w-full mt-3 py-1.5 text-center text-[11px] font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 rounded-md transition-colors"
                  >
                    FOCUS ANALYTICS
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <MapRecenter coords={activeCenterCoords} />
      </MapContainer>
    </div>
  );
};
