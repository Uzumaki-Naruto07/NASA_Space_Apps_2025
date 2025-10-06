import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface PollutionPoint {
  lat: number;
  lon: number;
  aqi: number;
  city: string;
  pollutant: string;
  timestamp: string;
}

interface PollutionVisualizationProps {
  pollutionData: PollutionPoint[];
  earthRadius?: number;
}

// Convert lat/lon to 3D coordinates
const latLonToVector3 = (lat: number, lon: number, radius: number): THREE.Vector3 => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
};

// Get color based on AQI level
const getAQIColor = (aqi: number): string => {
  if (aqi <= 50) return '#00e400'; // Good - Green
  if (aqi <= 100) return '#ffff00'; // Moderate - Yellow
  if (aqi <= 150) return '#ff8c00'; // Unhealthy for Sensitive - Orange
  if (aqi <= 200) return '#ff0000'; // Unhealthy - Red
  if (aqi <= 300) return '#8f3f97'; // Very Unhealthy - Purple
  return '#7e0023'; // Hazardous - Maroon
};

// Get size based on AQI level
const getAQISize = (aqi: number): number => {
  return Math.max(0.02, Math.min(0.15, aqi / 1000));
};

const PollutionPoint = ({ 
  point, 
  earthRadius, 
  index 
}: { 
  point: PollutionPoint; 
  earthRadius: number; 
  index: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [time, setTime] = useState(0);

  const position = latLonToVector3(point.lat, point.lon, earthRadius + 0.1);
  const color = getAQIColor(point.aqi);
  const size = getAQISize(point.aqi);

  useFrame((state) => {
    if (meshRef.current) {
      // Pulsing animation
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.3;
      meshRef.current.scale.setScalar(pulse);
      
      // Floating animation
      meshRef.current.position.y = position.y + Math.sin(state.clock.elapsedTime + index) * 0.05;
      
      setTime(state.clock.elapsedTime);
    }
  });

  return (
    <group position={position}>
      {/* Main pollution point */}
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Glow effect */}
      <mesh>
        <sphereGeometry args={[size * 2, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.2}
        />
      </mesh>
      
      {/* Animated particles around the point */}
      {Array.from({ length: 5 }).map((_, i) => {
        const angle = (i / 5) * Math.PI * 2 + time;
        const radius = size * 3;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(time + i) * 0.1;
        const z = Math.sin(angle) * radius;
        
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.005, 8, 8]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.6}
            />
          </mesh>
        );
      })}
      
      {/* City label (only show on hover) */}
      {hovered && (
        <Text
          position={[0, size * 3, 0]}
          fontSize={0.1}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {point.city}
        </Text>
      )}
    </group>
  );
};

const PollutionVisualization = ({ 
  pollutionData, 
  earthRadius = 2 
}: PollutionVisualizationProps) => {
  const [animatedData, setAnimatedData] = useState<PollutionPoint[]>([]);

  // Animate data points appearing
  useEffect(() => {
    if (pollutionData.length === 0) return;
    
    const timer = setTimeout(() => {
      setAnimatedData(pollutionData);
    }, 500);

    return () => clearTimeout(timer);
  }, [pollutionData]);

  return (
    <group>
      {animatedData.map((point, index) => (
        <PollutionPoint
          key={`${point.lat}-${point.lon}-${point.timestamp}`}
          point={point}
          earthRadius={earthRadius}
          index={index}
        />
      ))}
      
      {/* Connection lines between nearby points */}
      {animatedData.length > 1 && (
        <group>
          {animatedData.map((point1, i) => 
            animatedData.slice(i + 1).map((point2, j) => {
              const pos1 = latLonToVector3(point1.lat, point1.lon, earthRadius + 0.05);
              const pos2 = latLonToVector3(point2.lat, point2.lon, earthRadius + 0.05);
              const distance = pos1.distanceTo(pos2);
              
              // Only connect nearby points
              if (distance < 1) {
                return (
                  <line key={`${i}-${j}`}>
                    <bufferGeometry>
                      <bufferAttribute
                        attach="attributes-position"
                        count={2}
                        array={new Float32Array([
                          pos1.x, pos1.y, pos1.z,
                          pos2.x, pos2.y, pos2.z
                        ])}
                        itemSize={3}
                        args={[new Float32Array([
                          pos1.x, pos1.y, pos1.z,
                          pos2.x, pos2.y, pos2.z
                        ]), 3]}
                      />
                    </bufferGeometry>
                    <lineBasicMaterial color="#ff4444" transparent opacity={0.3} />
                  </line>
                );
              }
              return null;
            })
          )}
        </group>
      )}
    </group>
  );
};

export default PollutionVisualization;
