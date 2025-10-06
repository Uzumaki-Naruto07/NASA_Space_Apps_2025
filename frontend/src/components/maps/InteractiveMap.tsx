import { useRef, useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface AirQualityData {
  id: number;
  name: string;
  lat: number;
  lng: number;
  aqi: number;
  pm25: number;
  no2: number;
  o3: number;
  lastUpdate: string;
  source?: string;
  region?: string;
}

const InteractiveMap = () => {
  const mapRef = useRef<L.Map>(null);
  const [airQualityData, setAirQualityData] = useState<AirQualityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<'global' | 'north_america' | 'uae'>('global');

  // Enhanced data points with more cities
  const defaultDataPoints: AirQualityData[] = [
    // North America
    {
      id: 1,
      name: 'New York City',
      lat: 40.7128,
      lng: -74.0060,
      aqi: 45,
      pm25: 12,
      no2: 18,
      o3: 25,
      lastUpdate: '2 min ago',
      source: 'TEMPO + Ground',
      region: 'north_america'
    },
    {
      id: 2,
      name: 'Los Angeles',
      lat: 34.0522,
      lng: -118.2437,
      aqi: 78,
      pm25: 28,
      no2: 35,
      o3: 42,
      lastUpdate: '3 min ago',
      source: 'TEMPO + Ground',
      region: 'north_america'
    },
    {
      id: 3,
      name: 'Toronto',
      lat: 43.6532,
      lng: -79.3832,
      aqi: 32,
      pm25: 8,
      no2: 12,
      o3: 18,
      lastUpdate: '1 min ago',
      source: 'OpenAQ',
      region: 'north_america'
    },
    {
      id: 4,
      name: 'Vancouver',
      lat: 49.2827,
      lng: -123.1207,
      aqi: 28,
      pm25: 6,
      no2: 8,
      o3: 15,
      lastUpdate: '2 min ago',
      source: 'OpenAQ',
      region: 'north_america'
    },
    {
      id: 5,
      name: 'Montreal',
      lat: 45.5017,
      lng: -73.5673,
      aqi: 35,
      pm25: 9,
      no2: 14,
      o3: 20,
      lastUpdate: '1 min ago',
      source: 'OpenAQ',
      region: 'north_america'
    },
    {
      id: 6,
      name: 'Chicago',
      lat: 41.8781,
      lng: -87.6298,
      aqi: 52,
      pm25: 15,
      no2: 22,
      o3: 28,
      lastUpdate: '3 min ago',
      source: 'AirNow',
      region: 'north_america'
    },
    {
      id: 7,
      name: 'Houston',
      lat: 29.7604,
      lng: -95.3698,
      aqi: 68,
      pm25: 22,
      no2: 28,
      o3: 35,
      lastUpdate: '2 min ago',
      source: 'AirNow',
      region: 'north_america'
    },
    {
      id: 8,
      name: 'Mexico City',
      lat: 19.4326,
      lng: -99.1332,
      aqi: 95,
      pm25: 35,
      no2: 45,
      o3: 38,
      lastUpdate: '4 min ago',
      source: 'TEMPO',
      region: 'north_america'
    },
    // UAE Cities
    {
      id: 9,
      name: 'Dubai',
      lat: 25.2048,
      lng: 55.2708,
      aqi: 65,
      pm25: 18,
      no2: 25,
      o3: 32,
      lastUpdate: '1 min ago',
      source: 'UAE Air Quality',
      region: 'uae'
    },
    {
      id: 10,
      name: 'Abu Dhabi',
      lat: 24.4539,
      lng: 54.3773,
      aqi: 58,
      pm25: 15,
      no2: 20,
      o3: 28,
      lastUpdate: '2 min ago',
      source: 'UAE Air Quality',
      region: 'uae'
    },
    {
      id: 11,
      name: 'Sharjah',
      lat: 25.3573,
      lng: 55.4033,
      aqi: 72,
      pm25: 20,
      no2: 28,
      o3: 35,
      lastUpdate: '1 min ago',
      source: 'UAE Air Quality',
      region: 'uae'
    },
    {
      id: 12,
      name: 'Ajman',
      lat: 25.4052,
      lng: 55.5136,
      aqi: 48,
      pm25: 12,
      no2: 18,
      o3: 25,
      lastUpdate: '2 min ago',
      source: 'UAE Air Quality',
      region: 'uae'
    },
    {
      id: 13,
      name: 'Ras Al Khaimah',
      lat: 25.7895,
      lng: 55.9592,
      aqi: 42,
      pm25: 10,
      no2: 15,
      o3: 22,
      lastUpdate: '1 min ago',
      source: 'UAE Air Quality',
      region: 'uae'
    }
  ];

  // Fetch real-time data from API
  useEffect(() => {
    const fetchGlobalData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5001/api/global-air-quality');
        if (response.ok) {
          const data = await response.json();
          // Transform API data to our format
          const transformedData: AirQualityData[] = [];
          
          // Add North America data
          data.north_america?.forEach((item: any, index: number) => {
            transformedData.push({
              id: index + 1,
              name: item.city || 'Unknown',
              lat: item.lat,
              lng: item.lon,
              aqi: Math.round(item.aqi || 0),
              pm25: Math.round(item.pm25 || 0),
              no2: Math.round(item.no2 || 0),
              o3: Math.round(item.o3 || 0),
              lastUpdate: 'Live',
              source: item.source || 'API',
              region: 'north_america'
            });
          });
          
          // Add UAE data
          data.uae?.forEach((item: any, index: number) => {
            transformedData.push({
              id: index + 100,
              name: item.city || 'Unknown',
              lat: item.lat,
              lng: item.lon,
              aqi: Math.round(item.aqi || 0),
              pm25: Math.round(item.pm25 || 0),
              no2: Math.round(item.no2 || 0),
              o3: Math.round(item.o3 || 0),
              lastUpdate: 'Live',
              source: item.source || 'UAE API',
              region: 'uae'
            });
          });
          
          if (transformedData.length > 0) {
            setAirQualityData(transformedData);
          } else {
            setAirQualityData(defaultDataPoints);
          }
        } else {
          setAirQualityData(defaultDataPoints);
        }
      } catch (error) {
        console.error('Error fetching global data:', error);
        setAirQualityData(defaultDataPoints);
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalData();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchGlobalData, 300000);
    return () => clearInterval(interval);
  }, []);

  const dataPoints = airQualityData.filter(point => {
    if (selectedRegion === 'global') return true;
    return point.region === selectedRegion;
  });

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return '#00e400';
    if (aqi <= 100) return '#ffff00';
    if (aqi <= 150) return '#ff7e00';
    if (aqi <= 200) return '#ff0000';
    if (aqi <= 300) return '#8f3f97';
    return '#7e0023';
  };

  const getAQILevel = (aqi: number) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  // Get map center based on selected region
  const getMapCenter = (): [number, number] => {
    if (selectedRegion === 'uae') return [24.4539, 54.3773]; // Abu Dhabi
    if (selectedRegion === 'north_america') return [39.8283, -98.5795]; // Center of North America
    return [20, 0]; // Global view
  };

  const getMapZoom = () => {
    if (selectedRegion === 'uae') return 8;
    if (selectedRegion === 'north_america') return 4;
    return 2; // Global view
  };

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden relative">
      {/* Region Filter Controls */}
      <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedRegion('global')}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              selectedRegion === 'global' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Global
          </button>
          <button
            onClick={() => setSelectedRegion('north_america')}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              selectedRegion === 'north_america' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            North America
          </button>
          <button
            onClick={() => setSelectedRegion('uae')}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              selectedRegion === 'uae' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            UAE
          </button>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            <span className="text-xs text-gray-600">Loading...</span>
          </div>
        </div>
      )}

      {/* Data Source Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200">
        <div className="text-xs font-semibold mb-2 text-gray-800">Data Sources</div>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-700 font-medium">TEMPO Satellite</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs text-gray-700 font-medium">OpenAQ</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-xs text-gray-700 font-medium">UAE Air Quality</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-xs text-gray-700 font-medium">AirNow</span>
          </div>
        </div>
      </div>

      <MapContainer
        center={getMapCenter()}
        zoom={getMapZoom()}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {dataPoints.map((point) => {
          const markerSize = Math.max(16, Math.min(32, point.aqi / 5)); // Dynamic marker size based on AQI
          const sourceColor = point.source?.includes('TEMPO') ? '#10b981' : 
                             point.source?.includes('OpenAQ') ? '#3b82f6' :
                             point.source?.includes('UAE') ? '#8b5cf6' : '#f59e0b';
          
          return (
            <Marker
              key={point.id}
              position={[point.lat, point.lng]}
              icon={L.divIcon({
                className: 'custom-div-icon',
                html: `<div style="
                  background-color: ${getAQIColor(point.aqi)};
                  width: ${markerSize}px;
                  height: ${markerSize}px;
                  border-radius: 50%;
                  border: 3px solid ${sourceColor};
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: ${markerSize > 20 ? '10px' : '8px'};
                  font-weight: bold;
                  color: white;
                  text-shadow: 1px 1px 1px rgba(0,0,0,0.5);
                  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                ">${point.aqi}</div>`,
                iconSize: [markerSize, markerSize],
                iconAnchor: [markerSize/2, markerSize/2]
              })}
            >
              <Popup>
                <div className="p-3 min-w-[200px]">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{point.name}</h3>
                    <span className="text-xs px-2 py-1 rounded-full text-white" style={{ backgroundColor: sourceColor }}>
                      {point.source}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">AQI:</span>
                      <span className="font-bold text-lg" style={{ color: getAQIColor(point.aqi) }}>
                        {point.aqi}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mb-2">
                      {getAQILevel(point.aqi)}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex justify-between">
                        <span>PM₂.₅:</span>
                        <span className="font-medium">{point.pm25} μg/m³</span>
                      </div>
                      <div className="flex justify-between">
                        <span>NO₂:</span>
                        <span className="font-medium">{point.no2} ppb</span>
                      </div>
                      <div className="flex justify-between">
                        <span>O₃:</span>
                        <span className="font-medium">{point.o3} ppb</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2 pt-2 border-t">
                      Last update: {point.lastUpdate}
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;
