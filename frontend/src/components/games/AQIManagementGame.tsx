import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Car, Factory, Wind, AlertTriangle, TrendingDown, Award, DollarSign } from 'lucide-react';
import * as THREE from 'three';

const AQIManagementGame = () => {
  const [gameState, setGameState] = useState('menu');
  const [budget, setBudget] = useState(50000);
  const [aqi, setAqi] = useState(145);
  const [day, setDay] = useState(1);
  const [consecutiveSafeDays, setConsecutiveSafeDays] = useState(0);
  const [deaths, setDeaths] = useState(0);
  const [gameMessage, setGameMessage] = useState('');
  const [deployedPolicies, setDeployedPolicies] = useState([]);
  const [districts, setDistricts] = useState({
    industrial: { aqi: 180, pollution: 90, color: '#ef4444' },
    downtown: { aqi: 135, pollution: 70, color: '#f97316' },
    residential: { aqi: 110, pollution: 50, color: '#eab308' },
    suburban: { aqi: 85, pollution: 30, color: '#84cc16' }
  });
  const [weather, setWeather] = useState('clear');
  const [scanning, setScanning] = useState(false);

  const mountRef = useRef(null);
  const cityRef = useRef([]);

  const policies = [
    { id: 1, name: 'Ban Diesel Cars', cost: 8000, impact: -15, icon: '🚗', district: 'all' },
    { id: 2, name: 'Subsidize Solar Housing', cost: 12000, impact: -20, icon: '☀️', district: 'residential' },
    { id: 3, name: 'Factory Emissions Cap', cost: 15000, impact: -25, icon: '🏭', district: 'industrial' },
    { id: 4, name: 'Green Public Transit', cost: 10000, impact: -18, icon: '🚌', district: 'downtown' },
    { id: 5, name: 'Tree Planting Program', cost: 5000, impact: -10, icon: '🌳', district: 'all' },
    { id: 6, name: 'Clean Energy Mandate', cost: 20000, impact: -30, icon: '⚡', district: 'industrial' }
  ];

  const weatherEvents = ['clear', 'windy', 'sandstorm', 'festival'];

  useEffect(() => {
    if (!mountRef.current || gameState !== 'playing') return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    scene.fog = new THREE.Fog(0xcccccc, 10, 50);

    const camera = new THREE.PerspectiveCamera(50, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 15, 20);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
    sunLight.position.set(10, 20, 10);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const groundGeometry = new THREE.PlaneGeometry(40, 40);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x2d5016 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const gridHelper = new THREE.GridHelper(40, 20, 0x444444, 0x888888);
    scene.add(gridHelper);

    const buildingPositions = [
      { x: -8, z: -8, h: 3, color: 0x666666, type: 'industrial' },
      { x: -8, z: 0, h: 2.5, color: 0x888888, type: 'industrial' },
      { x: -8, z: 8, h: 2, color: 0x999999, type: 'industrial' },
      { x: 0, z: -8, h: 5, color: 0x555555, type: 'downtown' },
      { x: 0, z: 0, h: 4, color: 0x444444, type: 'downtown' },
      { x: 0, z: 8, h: 6, color: 0x333333, type: 'downtown' },
      { x: 8, z: -8, h: 2, color: 0xaa8866, type: 'residential' },
      { x: 8, z: 0, h: 1.5, color: 0xbb9977, type: 'residential' },
      { x: 8, z: 8, h: 1.8, color: 0xccaa88, type: 'residential' }
    ];

    buildingPositions.forEach(pos => {
      const buildingGeometry = new THREE.BoxGeometry(3, pos.h, 3);
      const buildingMaterial = new THREE.MeshStandardMaterial({ 
        color: pos.color,
        roughness: 0.7,
        metalness: 0.3
      });
      const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
      building.position.set(pos.x, pos.h / 2, pos.z);
      building.castShadow = true;
      building.receiveShadow = true;
      building.userData = { type: pos.type };
      scene.add(building);
      cityRef.current.push(building);
    });

    const particleCount = 1000;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 40;
      positions[i + 1] = Math.random() * 10;
      positions[i + 2] = (Math.random() - 0.5) * 40;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      color: aqi > 150 ? 0xff4444 : aqi > 100 ? 0xffaa44 : 0xcccccc,
      size: 0.3,
      transparent: true,
      opacity: aqi > 100 ? 0.6 : 0.3
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      particles.rotation.y += 0.0005;
      particles.position.y = Math.sin(Date.now() * 0.0005) * 0.5;

      cityRef.current.forEach((building, idx) => {
        const districtData = districts[building.userData.type];
        if (districtData) {
          const targetColor = new THREE.Color(districtData.color);
          building.material.color.lerp(targetColor, 0.01);
        }
      });

      camera.position.x = Math.sin(Date.now() * 0.0001) * 25;
      camera.position.z = Math.cos(Date.now() * 0.0001) * 25;
      camera.lookAt(0, 2, 0);

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [gameState, aqi, districts]);

  useEffect(() => {
    if (gameState === 'playing') {
      const timer = setInterval(() => {
        setDay(prev => prev + 1);
        
        const randomEvent = Math.random();
        if (randomEvent < 0.1) {
          const newWeather = weatherEvents[Math.floor(Math.random() * weatherEvents.length)];
          setWeather(newWeather);
          
          if (newWeather === 'sandstorm') {
            setAqi(prev => Math.min(300, prev + 30));
            setGameMessage('⚠️ Sandstorm! AQI increased by 30');
          } else if (newWeather === 'windy') {
            setAqi(prev => Math.max(0, prev - 15));
            setGameMessage('💨 Windy day! AQI decreased by 15');
          } else if (newWeather === 'festival') {
            setAqi(prev => Math.min(300, prev + 20));
            setGameMessage('🎉 Festival traffic! AQI increased by 20');
          }
        }

        const policyReduction = deployedPolicies.reduce((sum, p) => sum + p.impact, 0);
        const baseIncrease = 5;
        
        setAqi(prev => {
          const newAqi = Math.max(0, Math.min(300, prev + baseIncrease + policyReduction));
          return newAqi;
        });

        setAqi(prev => {
          if (prev < 50) {
            setConsecutiveSafeDays(prevDays => prevDays + 1);
          } else {
            setConsecutiveSafeDays(0);
            if (prev > 200) {
              setDeaths(prevDeaths => prevDeaths + 1);
            }
          }
          return prev;
        });
      }, 4000);

      return () => clearInterval(timer);
    }
  }, [gameState, deployedPolicies]);

  useEffect(() => {
    if (consecutiveSafeDays >= 10) {
      setGameState('won');
    } else if (budget <= 0 || deaths >= 10) {
      setGameState('lost');
    }
  }, [consecutiveSafeDays, budget, deaths]);

  const startGame = () => {
    setGameState('playing');
    setGameMessage('🌆 City pollution crisis detected. Deploy policies to improve air quality.');
  };

  const deployPolicy = (policy) => {
    if (budget >= policy.cost && !deployedPolicies.find(p => p.id === policy.id)) {
      setBudget(prev => prev - policy.cost);
      setDeployedPolicies(prev => [...prev, policy]);
      setAqi(prev => Math.max(0, prev + policy.impact));
      setGameMessage(`✅ ${policy.name} deployed! AQI impact: ${policy.impact}`);
    }
  };

  const runTempoScan = () => {
    if (budget >= 2000 && !scanning) {
      setBudget(prev => prev - 2000);
      setScanning(true);
      setGameMessage('📡 TEMPO Scan initiated... Analyzing NO₂ and O₃ levels');
      
      setTimeout(() => {
        setScanning(false);
        const reduction = Math.floor(Math.random() * 10) + 5;
        setAqi(prev => Math.max(0, prev - reduction));
        setGameMessage(`✅ Scan complete! Identified hotspots. AQI reduced by ${reduction}`);
      }, 3000);
    }
  };

  const getAqiColor = (value) => {
    if (value <= 50) return 'text-green-400';
    if (value <= 100) return 'text-yellow-400';
    if (value <= 150) return 'text-orange-400';
    return 'text-red-400';
  };

  const getAqiLabel = (value) => {
    if (value <= 50) return 'Good';
    if (value <= 100) return 'Moderate';
    if (value <= 150) return 'Unhealthy (Sensitive)';
    if (value <= 200) return 'Unhealthy';
    return 'Hazardous';
  };

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/90 rounded-2xl p-12 max-w-2xl text-center shadow-2xl border border-blue-500/30">
          <Wind className="w-20 h-20 text-blue-400 mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-white mb-4">AQI Management Lab</h1>
          <p className="text-blue-200 text-lg mb-8">
            Control city-wide air quality through strategic policy deployment
          </p>
          <div className="bg-slate-700/50 p-6 rounded-xl mb-8 text-left">
            <h3 className="text-xl font-bold text-white mb-3">Mission Objectives:</h3>
            <ul className="text-blue-100 space-y-2">
              <li>• Deploy policies to reduce AQI below 50</li>
              <li>• Maintain safe air quality for 10 consecutive days</li>
              <li>• Use TEMPO scans to identify pollution hotspots</li>
              <li>• Manage budget and prevent public health crisis</li>
            </ul>
          </div>
          <button
            onClick={startGame}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-10 py-4 rounded-xl text-xl font-bold hover:from-blue-600 hover:to-cyan-600 transition-all"
          >
            Start Simulation
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'won') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/90 rounded-2xl p-12 max-w-2xl text-center shadow-2xl border border-green-500/30">
          <Award className="w-24 h-24 text-green-400 mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-white mb-4">City Breathes Again!</h1>
          <p className="text-green-200 text-xl mb-6">Air quality maintained at safe levels for 10 days!</p>
          <div className="bg-slate-700/50 p-6 rounded-xl mb-8">
            <p className="text-white text-lg">Final Statistics:</p>
            <p className="text-green-300 text-2xl mt-2">Day {day} • AQI: {aqi.toFixed(0)}</p>
            <p className="text-green-300 text-2xl">{deployedPolicies.length} Policies Deployed</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-xl text-lg font-bold"
          >
            New City
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'lost') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/90 rounded-2xl p-12 max-w-2xl text-center shadow-2xl border border-red-500/30">
          <AlertTriangle className="w-24 h-24 text-red-400 mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-white mb-4">Public Health Crisis</h1>
          <p className="text-red-200 text-xl mb-6">
            {budget <= 0 ? 'Budget depleted' : 'Death toll exceeded threshold'}
          </p>
          <div className="bg-slate-700/50 p-6 rounded-xl mb-8">
            <p className="text-white text-lg">Lasted {day} days</p>
            <p className="text-red-300 text-xl mt-2">Final AQI: {aqi.toFixed(0)} - {getAqiLabel(aqi)}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-3 rounded-xl text-lg font-bold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto mb-4">
        <div className="bg-slate-800/90 rounded-xl overflow-hidden shadow-2xl border border-slate-600">
          <div ref={mountRef} style={{ width: '100%', height: '400px' }} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto mb-4">
        <div className="bg-slate-800/90 rounded-xl p-4 shadow-xl border border-slate-600">
          <div className="grid grid-cols-5 gap-3">
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <p className="text-blue-300 text-xs">Day</p>
              <p className="text-white text-xl font-bold">{day}</p>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <p className={`text-xs ${getAqiColor(aqi)}`}>AQI</p>
              <p className={`text-xl font-bold ${getAqiColor(aqi)}`}>{aqi.toFixed(0)}</p>
              <p className="text-xs text-slate-400">{getAqiLabel(aqi)}</p>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <p className="text-green-300 text-xs">Safe Days</p>
              <p className="text-white text-xl font-bold">{consecutiveSafeDays}/10</p>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <p className="text-yellow-300 text-xs">Budget</p>
              <p className="text-white text-xl font-bold">${(budget/1000).toFixed(0)}K</p>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <p className="text-red-300 text-xs">Deaths</p>
              <p className="text-white text-xl font-bold">{deaths}/10</p>
            </div>
          </div>
        </div>
      </div>

      {gameMessage && (
        <div className="max-w-7xl mx-auto mb-4">
          <div className="bg-blue-600/20 border border-blue-400 rounded-lg p-3 text-blue-100 text-sm">
            {gameMessage}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-slate-800/90 rounded-xl p-4 shadow-xl border border-slate-600">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-cyan-400" />
              Policy Interventions
            </h2>
            <button
              onClick={runTempoScan}
              disabled={budget < 2000 || scanning}
              className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${
                budget >= 2000 && !scanning
                  ? 'bg-purple-500 hover:bg-purple-600 text-white'
                  : 'bg-slate-600 text-slate-400'
              }`}
            >
              {scanning ? '📡 Scanning...' : '📡 TEMPO Scan ($2K)'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {policies.map(policy => {
              const deployed = deployedPolicies.find(p => p.id === policy.id);
              return (
                <div 
                  key={policy.id}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    deployed 
                      ? 'bg-green-900/30 border-green-500' 
                      : 'bg-slate-700/50 border-slate-600 hover:border-cyan-400'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-white font-bold text-sm flex items-center gap-2">
                        <span className="text-xl">{policy.icon}</span>
                        {policy.name}
                      </h3>
                      <p className="text-cyan-300 text-xs mt-1">Impact: {policy.impact} AQI</p>
                      <p className="text-slate-400 text-xs">Zone: {policy.district}</p>
                    </div>
                  </div>
                  {!deployed && (
                    <button
                      onClick={() => deployPolicy(policy)}
                      disabled={budget < policy.cost}
                      className={`w-full mt-2 px-3 py-1 rounded text-xs font-bold ${
                        budget >= policy.cost
                          ? 'bg-cyan-500 hover:bg-cyan-600 text-white'
                          : 'bg-slate-600 text-slate-400'
                      }`}
                    >
                      Deploy ${(policy.cost/1000).toFixed(0)}K
                    </button>
                  )}
                  {deployed && (
                    <div className="text-green-400 text-xs font-bold mt-2">✓ Active</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-800/90 rounded-xl p-4 shadow-xl border border-slate-600">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Factory className="w-5 h-5 text-orange-400" />
              District Status
            </h2>
            <div className="space-y-3">
              {Object.entries(districts).map(([key, district]) => (
                <div key={key} className="bg-slate-700/50 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-bold text-sm capitalize">{key}</span>
                    <span className={`text-sm font-bold ${getAqiColor(district.aqi)}`}>
                      AQI: {district.aqi}
                    </span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all"
                      style={{ 
                        width: `${Math.min(100, (district.pollution / 100) * 100)}%`,
                        backgroundColor: district.color
                      }}
                    />
                  </div>
                  <p className="text-slate-400 text-xs mt-1">Pollution: {district.pollution}%</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/90 rounded-xl p-4 shadow-xl border border-slate-600">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Wind className="w-5 h-5 text-blue-400" />
              Weather: {weather}
            </h2>
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <p className="text-slate-300 text-sm">
                {weather === 'clear' && '☀️ Clear skies - Normal conditions'}
                {weather === 'windy' && '💨 Windy - Pollution dispersing'}
                {weather === 'sandstorm' && '🌪️ Sandstorm - AQI spike!'}
                {weather === 'festival' && '🎉 Festival - Heavy traffic'}
              </p>
            </div>
          </div>

          <div className="bg-slate-800/90 rounded-xl p-4 shadow-xl border border-slate-600">
            <h2 className="text-lg font-bold text-white mb-3">Active Policies ({deployedPolicies.length})</h2>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {deployedPolicies.length === 0 ? (
                <p className="text-slate-400 text-xs text-center py-2">No policies deployed</p>
              ) : (
                deployedPolicies.map(policy => (
                  <div key={policy.id} className="bg-green-900/20 border border-green-500/50 p-2 rounded text-xs">
                    <span className="text-white font-bold">{policy.icon} {policy.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AQIManagementGame;
