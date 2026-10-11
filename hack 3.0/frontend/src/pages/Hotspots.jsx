import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Compass, AlertTriangle, ShieldCheck } from 'lucide-react';

// Custom Icon for Financial Shocks
const shockIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const impactIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function Hotspots() {
  const [events, setEvents] = useState([
    { 
      id: "EVT-101", 
      name: "Middle East Supply Cut", 
      lat: 25.0, lng: 45.0, 
      type: "Shock", 
      affected: [
        { name: "Global Shipping (Suez)", lat: 29.9, lng: 32.5 },
        { name: "Indian Airlines (INDIGO)", lat: 28.6, lng: 77.2 }
      ] 
    },
    { 
      id: "EVT-102", 
      name: "Taiwan Semi Export Ban", 
      lat: 23.5, lng: 121.0, 
      type: "Shock", 
      affected: [
        { name: "Apple Supply Chain (Shenzhen)", lat: 22.5, lng: 114.0 },
        { name: "Microsoft Datacenters (US)", lat: 37.7, lng: -122.4 }
      ] 
    }
  ]);

  return (
    <div style={{ height: 'calc(100vh - 80px)', width: '100%', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      <div className="topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text)', margin: 0, fontSize: 24 }}>
          <Compass color="#f59e0b" /> Geopolitical Impact Map
        </h1>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ef4444', fontSize: 13, fontWeight: 'bold' }}>
            <AlertTriangle size={16} /> Primary Shocks
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f59e0b', fontSize: 13, fontWeight: 'bold' }}>
             <ShieldCheck size={16} /> Affected Regions
          </div>
        </div>
      </div>

      <div style={{ flex: 1, borderRadius: '16px', overflow: 'hidden', border: '1px solid #334155', position: 'relative' }}>
        <MapContainer center={[20.0, 45.0]} zoom={3} style={{ height: '100%', width: '100%', background: '#020617' }}>
          {/* Dark Mode Tile Layer */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />

          {events.map((evt) => (
            <React.Fragment key={evt.id}>
              {/* Primary Shock Marker */}
              <Marker position={[evt.lat, evt.lng]} icon={shockIcon}>
                <Popup>
                  <strong style={{ color: '#000' }}>{evt.name}</strong><br/>
                  Type: Origin Shock
                </Popup>
              </Marker>

              {/* Affected Regions & Propagation Lines */}
              {evt.affected.map((aff, i) => (
                <React.Fragment key={i}>
                  <Marker position={[aff.lat, aff.lng]} icon={impactIcon}>
                    <Popup>
                      <strong style={{ color: '#000' }}>{aff.name}</strong><br/>
                      Triggered by: {evt.name}
                    </Popup>
                  </Marker>
                  
                  <Polyline 
                    positions={[ [evt.lat, evt.lng], [aff.lat, aff.lng] ]} 
                    color="#ef4444" 
                    dashArray="5, 10" 
                    weight={2} 
                    opacity={0.6}
                  />
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </MapContainer>
        
        <div style={{ position: 'absolute', bottom: 20, left: 20, background: 'rgba(15,23,42,0.8)', padding: 16, borderRadius: 12, border: '1px solid #334155', backdropFilter: 'blur(10px)', zIndex: 1000 }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#f8fafc' }}>Active Global Alerts</h3>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {events.map(e => (
              <li key={e.id} style={{ fontSize: 13, color: '#cbd5e1' }}>• {e.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
