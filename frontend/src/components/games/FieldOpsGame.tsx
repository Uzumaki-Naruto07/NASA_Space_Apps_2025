import React, { useState, useEffect, useRef } from 'react';
import { Heart, Wind, Users, Clock, Shield, AlertTriangle, Award } from 'lucide-react';
import * as THREE from 'three';

const FieldOpsGame = () => {
  const [gameState, setGameState] = useState('menu');
  const [health, setHealth] = useState(100);
  const [oxygen, setOxygen] = useState(100);
  const [exposure, setExposure] = useState(0);
  const [civilians, setCivilians] = useState(5);
  const [objectives, setObjectives] = useState(3);
  const [time, setTime] = useState(180);
  const [gameMessage, setGameMessage] = useState('');
  const [playerPos, setPlayerPos] = useState({ x: 0, z: 0 });
  const [scannerActive, setScannerActive] = useState(false);
  const [completedMissions, setCompletedMissions] = useState([]);
  
  const mountRef = useRef(null);
  const playerRef = useRef(null);
  const keysPressed = useRef({});

  const missions = [
    { id: 1, name: 'Install Air Filter', x: -10, z: -10, type: 'filter', icon: '🔧' },
    { id: 2, name: 'Neutralize Emissions', x: 15, z: -5, type: 'valve', icon: '🏭' },
    { id: 3, name: 'Escort Civilians', x: -5, z: 15, type: 'rescue', icon: '👥' }
  ];

  useEffect(() => {
    if (!mountRef.current || gameState !== 'playing') return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x8b7355);
    scene.fog = new THREE.FogExp2(0xcc9966, 0.015);

    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 15, 20);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffddaa, 0.6);
    sunLight.position.set(20, 30, 20);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const playerGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 8);
    const playerMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const player = new THREE.Mesh(playerGeometry, playerMaterial);
    player.position.set(0, 1, 0);
    player.castShadow = true;
    scene.add(player);
    playerRef.current = player;

    const hazardZones = [
      { x: -8, z: -8, color: 0xff4444 },
      { x: 12, z: -3, color: 0xff8844 },
      { x: -3, z: 12, color: 0xffaa44 }
    ];

    hazardZones.forEach(zone => {
      const zoneGeometry = new THREE.CylinderGeometry(3, 3, 0.2, 16);
      const zoneMaterial = new THREE.MeshStandardMaterial({ 
        color: zone.color,
        transparent: true,
        opacity: 0.6
      });
      const zoneMesh = new THREE.Mesh(zoneGeometry, zoneMaterial);
      zoneMesh.position.set(zone.x, 0.1, zone.z);
      scene.add(zoneMesh);
    });

    missions.forEach(mission => {
      const markerGeometry = new THREE.CylinderGeometry(0.5, 0.5, 3, 8);
      const markerMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 0.5
      });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.set(mission.x, 1.5, mission.z);
      scene.add(marker);
    });

    const buildingPositions = [
      { x: -15, z: -15, h: 5 },
      { x: -15, z: 5, h: 3 },
      { x: 18, z: -8, h: 7 },
      { x: 10, z: 10, h: 4 }
    ];

    buildingPositions.forEach(pos => {
      const buildingGeometry = new THREE.BoxGeometry(4, pos.h, 4);
      const buildingMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
      const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
      building.position.set(pos.x, pos.h / 2, pos.z);
      building.castShadow = true;
      scene.add(building);
    });

    const particleCount = 500;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 50;
      positions[i + 1] = Math.random() * 20;
      positions[i + 2] = (Math.random() - 0.5) * 50;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xaa6644,
      size: 0.4,
      transparent: true,
      opacity: 0.6
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    const handleKeyDown = (e) => {
      keysPressed.current[e.key.toLowerCase()] = true;
    };

    const handleKeyUp = (e) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (playerRef.current) {
        const moveSpeed = 0.2;
        let moved = false;

        if (keysPressed.current['w']) {
          playerRef.current.position.z -= moveSpeed;
          moved = true;
        }
        if (keysPressed.current['s']) {
          playerRef.current.position.z += moveSpeed;
          moved = true;
        }
        if (keysPressed.current['a']) {
          playerRef.current.position.x -= moveSpeed;
          moved = true;
        }
        if (keysPressed.current['d']) {
          playerRef.current.position.x += moveSpeed;
          moved = true;
        }

        playerRef.current.position.x = Math.max(-20, Math.min(20, playerRef.current.position.x));
        playerRef.current.position.z = Math.max(-20, Math.min(20, playerRef.current.position.z));

        if (moved) {
          setPlayerPos({
            x: playerRef.current.position.x,
            z: playerRef.current.position.z
          });
        }

        camera.position.x = playerRef.current.position.x;
        camera.position.z = playerRef.current.position.z + 20;
        camera.lookAt(playerRef.current.position.x, 2, playerRef.current.position.z);
      }

      particles.rotation.y += 0.001;

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
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'playing') {
      const timer = setInterval(() => {
        setTime(prev => {
          if (prev <= 0) return 0;
          return prev - 1;
        });

        setOxygen(prev => Math.max(0, prev - 0.5));

        const inHazardZone = Math.abs(playerPos.x + 8) < 3 && Math.abs(playerPos.z + 8) < 3 ||
                            Math.abs(playerPos.x - 12) < 3 && Math.abs(playerPos.z + 3) < 3 ||
                            Math.abs(playerPos.x + 3) < 3 && Math.abs(playerPos.z - 12) < 3;

        if (inHazardZone) {
          setExposure(prev => Math.min(100, prev + 2));
          setHealth(prev => Math.max(0, prev - 1));
        }

        missions.forEach(mission => {
          if (!completedMissions.includes(mission.id)) {
            const distance = Math.sqrt(
              Math.pow(playerPos.x - mission.x, 2) + 
              Math.pow(playerPos.z - mission.z, 2)
            );
            
            if (distance < 2) {
              completeMission(mission);
            }
          }
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameState, playerPos, completedMissions]);

  useEffect(() => {
    if (completedMissions.length >= 3) {
      setGameState('won');
    } else if (health <= 0 || oxygen <= 0 || time <= 0) {
      setGameState('lost');
    }
  }, [completedMissions, health, oxygen, time]);

  const startGame = () => {
    setGameState('playing');
    setGameMessage('🚨 Field mission activated. Navigate to objectives using WASD keys.');
  };

  const completeMission = (mission) => {
    if (!completedMissions.includes(mission.id)) {
      setCompletedMissions(prev => [...prev, mission.id]);
      setObjectives(prev => prev - 1);
      setGameMessage(`✅ ${mission.name} completed!`);
      
      if (mission.type === 'filter') {
        setExposure(prev => Math.max(0, prev - 20));
      } else if (mission.type === 'rescue') {
        setCivilians(prev => prev + 3);
      }
    }
  };

  const activateScanner = () => {
    if (!scannerActive) {
      setScannerActive(true);
      setGameMessage('📡 TEMPO Scanner active - Emission sources highlighted');
      setTimeout(() => {
        setScannerActive(false);
        setGameMessage('Scanner cooldown');
      }, 5000);
    }
  };

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/90 rounded-2xl p-12 max-w-2xl text-center shadow-2xl border border-orange-500/30">
          <Shield className="w-20 h-20 text-orange-400 mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-white mb-4">Clean Air Field Ops</h1>
          <p className="text-orange-200 text-lg mb-8">
            Navigate hazardous zones and complete environmental missions
          </p>
          <div className="bg-slate-700/50 p-6 rounded-xl mb-8 text-left">
            <h3 className="text-xl font-bold text-white mb-3">Mission Brief:</h3>
            <ul className="text-orange-100 space-y-2">
              <li>• Use WASD keys to navigate the field</li>
              <li>• Complete 3 objectives before time runs out</li>
              <li>• Avoid toxic red zones (high AQI)</li>
              <li>• Monitor oxygen and health levels</li>
              <li>• Press Space to activate TEMPO scanner</li>
            </ul>
          </div>
          <button
            onClick={startGame}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-10 py-4 rounded-xl text-xl font-bold hover:from-orange-600 hover:to-red-600 transition-all"
          >
            Deploy to Field
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
          <h1 className="text-5xl font-bold text-white mb-4">Mission Success!</h1>
          <p className="text-green-200 text-xl mb-6">All objectives completed!</p>
          <div className="bg-slate-700/50 p-6 rounded-xl mb-8">
            <p className="text-white text-lg">Mission Statistics:</p>
            <p className="text-green-300 text-2xl mt-2">Time: {180 - time}s</p>
            <p className="text-green-300 text-2xl">Civilians Saved: {civilians}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-xl text-lg font-bold"
          >
            New Mission
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
          <h1 className="text-5xl font-bold text-white mb-4">Mission Failed</h1>
          <p className="text-red-200 text-xl mb-6">
            {health <= 0 ? 'Health depleted' : oxygen <= 0 ? 'Oxygen depleted' : 'Time expired'}
          </p>
          <div className="bg-slate-700/50 p-6 rounded-xl mb-8">
            <p className="text-white text-lg">Objectives: {completedMissions.length}/3</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-3 rounded-xl text-lg font-bold"
          >
            Retry Mission
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
              <p className="text-green-300 text-xs flex items-center gap-1">
                <Heart className="w-3 h-3" /> Health
              </p>
              <p className="text-white text-xl font-bold">{health}%</p>
              <div className="w-full bg-slate-600 rounded-full h-1.5 mt-1">
                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${health}%` }} />
              </div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <p className="text-blue-300 text-xs flex items-center gap-1">
                <Wind className="w-3 h-3" /> Oxygen
              </p>
              <p className="text-white text-xl font-bold">{oxygen.toFixed(0)}%</p>
              <div className="w-full bg-slate-600 rounded-full h-1.5 mt-1">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${oxygen}%` }} />
              </div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <p className="text-red-300 text-xs">Exposure</p>
              <p className="text-white text-xl font-bold">{exposure.toFixed(0)}%</p>
              <div className="w-full bg-slate-600 rounded-full h-1.5 mt-1">
                <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${exposure}%` }} />
              </div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <p className="text-yellow-300 text-xs flex items-center gap-1">
                <Clock className="w-3 h-3" /> Time
              </p>
              <p className="text-white text-xl font-bold">{time}s</p>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <p className="text-purple-300 text-xs">Objectives</p>
              <p className="text-white text-xl font-bold">{completedMissions.length}/3</p>
            </div>
          </div>
        </div>
      </div>

      {gameMessage && (
        <div className="max-w-7xl mx-auto mb-4">
          <div className="bg-orange-600/20 border border-orange-400 rounded-lg p-3 text-orange-100 text-sm">
            {gameMessage}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-slate-800/90 rounded-xl p-4 shadow-xl border border-slate-600">
          <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            Mission Objectives
          </h2>
          <div className="space-y-3">
            {missions.map(mission => {
              const completed = completedMissions.includes(mission.id);
              const distance = Math.sqrt(
                Math.pow(playerPos.x - mission.x, 2) + 
                Math.pow(playerPos.z - mission.z, 2)
              );
              return (
                <div 
                  key={mission.id}
                  className={`p-3 rounded-lg border-2 ${
                    completed 
                      ? 'bg-green-900/30 border-green-500' 
                      : 'bg-slate-700/50 border-slate-600'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-white font-bold text-sm">
                        {mission.icon} {mission.name}
                      </h3>
                      <p className="text-slate-400 text-xs mt-1">
                        {completed ? '✅ Complete' : `Distance: ${distance.toFixed(1)}m`}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={activateScanner}
            disabled={scannerActive}
            className={`w-full mt-4 py-2 rounded-lg text-sm font-bold ${
              !scannerActive
                ? 'bg-purple-500 hover:bg-purple-600 text-white'
                : 'bg-slate-600 text-slate-400'
            }`}
          >
            {scannerActive ? '📡 Scanner Active...' : '📡 Activate TEMPO Scanner'}
          </button>
        </div>

        <div className="bg-slate-800/90 rounded-xl p-4 shadow-xl border border-slate-600">
          <h2 className="text-xl font-bold text-white mb-3">Controls</h2>
          <div className="space-y-2 text-sm">
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <p className="text-cyan-300 font-bold">Movement</p>
              <p className="text-slate-300 text-xs mt-1">W - Forward | S - Backward</p>
              <p className="text-slate-300 text-xs">A - Left | D - Right</p>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <p className="text-orange-300 font-bold">Hazard Zones</p>
              <p className="text-slate-300 text-xs mt-1">🔴 Red zones cause health damage</p>
              <p className="text-slate-300 text-xs">Avoid prolonged exposure</p>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <p className="text-purple-300 font-bold">Mission Tips</p>
              <p className="text-slate-300 text-xs mt-1">Walk to cyan markers to complete objectives</p>
              <p className="text-slate-300 text-xs">Watch your oxygen meter</p>
            </div>
          </div>

          <div className="mt-4 bg-slate-700/50 p-3 rounded-lg">
            <p className="text-white font-bold text-sm mb-2">Civilians Rescued</p>
            <div className="flex gap-1">
              {Array.from({ length: civilians }).map((_, i) => (
                <span key={i} className="text-green-400">👤</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldOpsGame;
