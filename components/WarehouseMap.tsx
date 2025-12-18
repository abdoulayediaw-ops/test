
import React, { useEffect, useRef } from 'react';
import { Warehouse } from '../types';

interface WarehouseMapProps {
  warehouses: Warehouse[];
}

const WarehouseMap: React.FC<WarehouseMapProps> = ({ warehouses }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    // Dynamically load Leaflet if not already initialized
    const initMap = async () => {
      if (typeof window === 'undefined' || !mapRef.current) return;
      
      const L = (window as any).L;
      if (!L) return;

      if (!mapInstance.current) {
        mapInstance.current = L.map(mapRef.current).setView([14.4974, -14.4524], 7);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(mapInstance.current);
      }

      // Clear existing markers
      mapInstance.current.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) {
          mapInstance.current.removeLayer(layer);
        }
      });

      // Add markers
      warehouses.forEach(w => {
        const popupContent = `
          <div style="font-family: sans-serif; padding: 5px;">
            <b style="color: #065f46; font-size: 14px;">${w.name}</b><br/>
            <span style="font-size: 12px; color: #64748b;">${w.region}</span><br/>
            <div style="margin-top: 8px; border-top: 1px solid #f1f5f9; padding-top: 5px;">
              <small><b>Resp:</b> ${w.manager}</small>
            </div>
          </div>
        `;
        L.marker([w.lat, w.lng]).addTo(mapInstance.current).bindPopup(popupContent);
      });
    };

    const timer = setTimeout(initMap, 300);
    return () => clearTimeout(timer);
  }, [warehouses]);

  return (
    <div className="h-full min-h-[500px] w-full bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden relative">
      <div ref={mapRef} className="h-full w-full z-0" />
      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-lg border border-slate-100 text-xs font-bold text-emerald-800 uppercase tracking-widest pointer-events-none">
        Carte des Infrastructures
      </div>
    </div>
  );
};

export default WarehouseMap;
