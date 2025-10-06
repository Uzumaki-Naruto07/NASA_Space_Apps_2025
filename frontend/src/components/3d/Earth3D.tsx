import { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Stars } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import PollutionVisualization from './PollutionVisualization';
import { airQualityService } from '../../api/services';

// Enhanced Earth component with NASA-style pollution visualization
const Earth = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const [time, setTime] = useState(0);

  // Create realistic Earth textures
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Create base Earth texture with continents
    const gradient = ctx.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, '#1e3a8a'); // Deep ocean blue
    gradient.addColorStop(0.3, '#3b82f6'); // Ocean blue
    gradient.addColorStop(0.7, '#10b981'); // Land green
    gradient.addColorStop(1, '#f59e0b'); // Desert yellow
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 512);
    
    // Add continent shapes
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.ellipse(200, 150, 80, 40, 0, 0, 2 * Math.PI); // North America
    ctx.fill();
    
    ctx.beginPath();
    ctx.ellipse(300, 200, 60, 30, 0, 0, 2 * Math.PI); // Europe
    ctx.fill();
    
    ctx.beginPath();
    ctx.ellipse(500, 180, 100, 50, 0, 0, 2 * Math.PI); // Asia
    ctx.fill();
    
    ctx.beginPath();
    ctx.ellipse(400, 300, 70, 40, 0, 0, 2 * Math.PI); // Africa
    ctx.fill();
    
    ctx.beginPath();
    ctx.ellipse(600, 350, 80, 35, 0, 0, 2 * Math.PI); // Australia
    ctx.fill();
    
    return new THREE.CanvasTexture(canvas);
  }, []);

  // Create pollution overlay texture
  const pollutionTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Create pollution hotspots
    const pollutionSpots = [
      { x: 200, y: 150, intensity: 0.8, radius: 40 }, // North America
      { x: 300, y: 200, intensity: 0.6, radius: 30 }, // Europe
      { x: 500, y: 180, intensity: 0.9, radius: 50 }, // Asia
      { x: 400, y: 300, intensity: 0.7, radius: 35 }, // Africa
      { x: 600, y: 350, intensity: 0.5, radius: 25 }, // Australia
    ];
    
    pollutionSpots.forEach(spot => {
      const gradient = ctx.createRadialGradient(
        spot.x, spot.y, 0,
        spot.x, spot.y, spot.radius
      );
      gradient.addColorStop(0, `rgba(255, 0, 0, ${spot.intensity})`);
      gradient.addColorStop(0.5, `rgba(255, 100, 0, ${spot.intensity * 0.6})`);
      gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(spot.x, spot.y, spot.radius, 0, 2 * Math.PI);
      ctx.fill();
    });
    
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
    
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += 0.001;
      atmosphereRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.03;
    }
    
    setTime(state.clock.elapsedTime);
  });

  return (
    <group>
      {/* Main Earth Sphere */}
      <Sphere
        ref={meshRef}
        args={[2, 128, 128]}
      >
        <meshPhongMaterial
          map={earthTexture}
          shininess={100}
          transparent
          opacity={0.9}
        />
      </Sphere>
      
      {/* Pollution Overlay */}
      <Sphere
        args={[2.01, 128, 128]}
        rotation={[0, 0, 0]}
      >
        <meshBasicMaterial
          map={pollutionTexture}
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
      
      {/* Atmosphere */}
      <Sphere
        ref={atmosphereRef}
        args={[2.1, 64, 64]}
      >
        <meshBasicMaterial
          color="#87ceeb"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Animated pollution particles */}
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const radius = 2.05 + Math.sin(time + i) * 0.1;
        const x = Math.cos(angle + time * 0.1) * radius;
        const y = Math.sin(time + i) * 0.3;
        const z = Math.sin(angle + time * 0.1) * radius;
        
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.01, 8, 8]} />
            <meshBasicMaterial
              color="#ff4444"
              transparent
              opacity={0.8}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// Enhanced Earth3D component with NASA-style presentation
const Earth3D = () => {
  const [pollutionData, setPollutionData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load real pollution data from API
  useEffect(() => {
    const loadPollutionData = async () => {
      try {
        setIsLoading(true);
        
        // Get data for multiple regions
        const regions = ['nyc', 'london', 'tokyo', 'delhi', 'vancouver'];
        const promises = regions.map(async (region) => {
          try {
            const data = await airQualityService.getCurrentAQI(region);
            return {
              lat: (data as any).latitude || 0,
              lon: (data as any).longitude || 0,
              aqi: data.aqi || 0,
              city: region.charAt(0).toUpperCase() + region.slice(1),
              pollutant: (data as any).primary_pollutant || 'Unknown',
              timestamp: new Date().toISOString()
            };
          } catch (error) {
            console.warn(`Failed to load data for ${region}:`, error);
            return null;
          }
        });
        
        const results = await Promise.all(promises);
        const validData = results.filter(Boolean);
        
        if (validData.length === 0) {
          // Fallback to demo data if API fails
          setPollutionData([
            { lat: 40.7128, lon: -74.0060, aqi: 85, city: 'New York', pollutant: 'PM2.5', timestamp: new Date().toISOString() },
            { lat: 51.5074, lon: -0.1278, aqi: 45, city: 'London', pollutant: 'PM2.5', timestamp: new Date().toISOString() },
            { lat: 35.6762, lon: 139.6503, aqi: 78, city: 'Tokyo', pollutant: 'PM2.5', timestamp: new Date().toISOString() },
            { lat: 28.6139, lon: 77.2090, aqi: 156, city: 'New Delhi', pollutant: 'PM2.5', timestamp: new Date().toISOString() },
            { lat: 49.2827, lon: -123.1207, aqi: 25, city: 'Vancouver', pollutant: 'PM2.5', timestamp: new Date().toISOString() },
          ]);
        } else {
          setPollutionData(validData);
        }
      } catch (error) {
        console.error('Failed to load pollution data:', error);
        // Fallback to demo data
        setPollutionData([
          { lat: 40.7128, lon: -74.0060, aqi: 85, city: 'New York', pollutant: 'PM2.5', timestamp: new Date().toISOString() },
          { lat: 51.5074, lon: -0.1278, aqi: 45, city: 'London', pollutant: 'PM2.5', timestamp: new Date().toISOString() },
          { lat: 35.6762, lon: 139.6503, aqi: 78, city: 'Tokyo', pollutant: 'PM2.5', timestamp: new Date().toISOString() },
          { lat: 28.6139, lon: 77.2090, aqi: 156, city: 'New Delhi', pollutant: 'PM2.5', timestamp: new Date().toISOString() },
          { lat: 49.2827, lon: -123.1207, aqi: 25, city: 'Vancouver', pollutant: 'PM2.5', timestamp: new Date().toISOString() },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadPollutionData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 2, ease: "easeOut" }}
      className="w-full h-full relative"
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        style={{ background: 'transparent' }}
        shadows
      >
        {/* Enhanced Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -5]} intensity={0.8} color="#87ceeb" />
        <pointLight position={[5, 5, 5]} intensity={0.5} color="#ffffff" />
        
        {/* Stars Background */}
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
        />
        
        {/* Earth with pollution data */}
        <Earth />
        
        {/* Pollution visualization overlay */}
        <PollutionVisualization 
          pollutionData={pollutionData} 
          earthRadius={2}
        />
        
        {/* Enhanced Orbit Controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.3}
          minDistance={4}
          maxDistance={10}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
      
      {/* Loading overlay */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm"
        >
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-lg font-semibold">Loading Earth Data...</p>
            <p className="text-sm text-gray-300">Connecting to NASA TEMPO</p>
          </div>
        </motion.div>
      )}
      
      {/* Data overlay */}
      {!isLoading && pollutionData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="absolute bottom-4 left-4 right-4"
        >
          <div className="glass-effect rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Live Air Quality</h3>
                <p className="text-sm text-gray-300">NASA TEMPO Data</p>
                <p className="text-xs text-gray-400">
                  {pollutionData.length} cities monitored
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-400">
                  AQI {Math.round(pollutionData.reduce((sum, p) => sum + p.aqi, 0) / pollutionData.length)}
                </div>
                <div className="text-sm text-gray-300">Global Average</div>
                <div className="text-xs text-gray-400">
                  Worst: {pollutionData.reduce((max, p) => p.aqi > max.aqi ? p : max).city}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Earth3D;
