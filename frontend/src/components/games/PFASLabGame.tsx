import React, { useState, useEffect, useRef } from 'react';
import { Beaker, Droplet, AlertTriangle, TrendingDown, Zap, Award, TestTube, Activity } from 'lucide-react';
import * as THREE from 'three';

const PFASLabGame = () => {
  const [gameState, setGameState] = useState('menu');
  const [researchPoints, setResearchPoints] = useState(100);
  const [funding, setFunding] = useState(50000);
  const [exposureLevel, setExposureLevel] = useState(85);
  const [day, setDay] = useState(1);
  const [discoveredChemicals, setDiscoveredChemicals] = useState([]);
  const [deployedSolutions, setDeployedSolutions] = useState([]);
  const [activeAnalysis, setActiveAnalysis] = useState(null);
  const [gameMessage, setGameMessage] = useState('');
  const [labEquipment, setLabEquipment] = useState({
    lcms: { active: false, progress: 0 }
  });

  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const vialGroupRef = useRef(null);
  const labEquipmentRef = useRef([]);

  const chemicals = [
    { id: 1, name: 'PFOA', toxicity: 9, cost: 30, extractable: true },
    { id: 2, name: 'PFOS', toxicity: 8, cost: 30, extractable: true },
    { id: 3, name: 'GenX', toxicity: 6, cost: 25, extractable: false },
    { id: 4, name: 'PFBS', toxicity: 5, cost: 20, extractable: true },
    { id: 5, name: 'PFNA', toxicity: 7, cost: 25, extractable: true }
  ];

  const analysisTypes = [
    { 
      id: 'conventional', 
      name: 'Conventional Analysis', 
      cost: 10, 
      icon: '🔬'
    },
    { 
      id: 'oxidizable', 
      name: 'TOP Assay', 
      cost: 20, 
      icon: '⚗️'
    }
  ];

  const solutions = [
    { id: 1, name: 'Carbon Filter', effectiveness: 15, cost: 15000, icon: '🔬' },
    { id: 2, name: 'Ion Exchange', effectiveness: 25, cost: 30000, icon: '⚡' },
    { id: 3, name: 'Nanoreactor', effectiveness: 35, cost: 50000, icon: '🧬' }
  ];

  useEffect(() => {
    if (!mountRef.current || gameState !== 'playing') return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 3, 8);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(5, 10, 5);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const blueLight = new THREE.PointLight(0x00ccff, 1, 20);
    blueLight.position.set(-3, 2, 3);
    scene.add(blueLight);

    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x2a2a3e });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const benchGeometry = new THREE.BoxGeometry(6, 0.1, 3);
    const benchMaterial = new THREE.MeshStandardMaterial({ color: 0x444466 });
    const bench = new THREE.Mesh(benchGeometry, benchMaterial);
    bench.position.set(0, 1, 0);
    bench.castShadow = true;
    scene.add(bench);

    const machineGroup = new THREE.Group();
    const bodyGeometry = new THREE.BoxGeometry(2, 1.5, 1);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x333355 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    machineGroup.add(body);

    const screenGeometry = new THREE.BoxGeometry(0.8, 0.5, 0.05);
    const screenMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x0088ff,
      emissive: 0x0044aa,
      emissiveIntensity: 0.5
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(0, 0.5, 0.53);
    machineGroup.add(screen);

    machineGroup.position.set(0, 2.3, -1);
    scene.add(machineGroup);
    labEquipmentRef.current.push(machineGroup);

    const vialGroup = new THREE.Group();
    for (let i = 0; i < 8; i++) {
      const vialGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.4, 16);
      const vialMaterial = new THREE.MeshPhysicalMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.6
      });
      const vial = new THREE.Mesh(vialGeometry, vialMaterial);
      
      const liquidGeometry = new THREE.CylinderGeometry(0.07, 0.07, 0.25, 16);
      const liquidMaterial = new THREE.MeshStandardMaterial({ 
        color: i < 3 ? 0xff3344 : 0x44aaff
      });
      const liquid = new THREE.Mesh(liquidGeometry, liquidMaterial);
      liquid.position.y = -0.05;
      vial.add(liquid);
      
      vial.position.set((i - 3.5) * 0.35, 1.35, 0.5);
      vialGroup.add(vial);
    }
    scene.add(vialGroup);
    vialGroupRef.current = vialGroup;

    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (vialGroupRef.current) {
        vialGroupRef.current.rotation.y += 0.002;
      }

      if (labEquipment.lcms.active && labEquipmentRef.current[0]) {
        const time = Date.now() * 0.003;
        labEquipmentRef.current[0].children[1].material.emissiveIntensity = 0.5 + Math.sin(time) * 0.3;
      }

      camera.position.x = Math.sin(Date.now() * 0.0002) * 0.5;
      camera.lookAt(0, 1.5, 0);

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
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
  }, [gameState, labEquipment.lcms.active]);

  useEffect(() => {
    if (gameState === 'playing') {
      const timer = setInterval(() => {
        setDay(prev => prev + 1);
        setResearchPoints(prev => prev + 10);
        
        setExposureLevel(prev => {
          const increase = Math.max(0, 0.5 - (deployedSolutions.length * 0.2));
          return Math.min(100, prev + increase);
        });

        setLabEquipment(prev => {
          const updated = { ...prev };
          if (updated.lcms.active && updated.lcms.progress < 100) {
            updated.lcms.progress += 10;
          }
          return updated;
        });
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [gameState, deployedSolutions.length]);

  useEffect(() => {
    if (labEquipment.lcms.progress >= 100 && activeAnalysis) {
      completeAnalysis();
    }
  }, [labEquipment.lcms.progress, activeAnalysis]);

  useEffect(() => {
    if (exposureLevel <= 20) {
      setGameState('won');
    } else if (exposureLevel >= 100 || funding <= 0) {
      setGameState('lost');
    }
  }, [exposureLevel, funding]);

  const startGame = () => {
    setGameState('playing');
    setGameMessage('⚠️ PFAS contamination detected. Begin analysis.');
  };

  const startAnalysis = (type) => {
    const analysis = analysisTypes.find(a => a.id === type);
    if (researchPoints >= analysis.cost && !labEquipment.lcms.active) {
      setResearchPoints(prev => prev - analysis.cost);
      setActiveAnalysis(analysis);
      setLabEquipment(prev => ({
        ...prev,
        lcms: { active: true, progress: 0 }
      }));
      setGameMessage(`🔬 ${analysis.name} running...`);
    }
  };

  const completeAnalysis = () => {
    const undiscovered = chemicals.filter(c => !discoveredChemicals.find(d => d.id === c.id));
    
    if (activeAnalysis.id === 'oxidizable') {
      const discovered = undiscovered.slice(0, 2);
      setDiscoveredChemicals(prev => [...prev, ...discovered]);
      setGameMessage(`✅ Found: ${discovered.map(c => c.name).join(', ')}`);
    } else {
      const extractable = undiscovered.filter(c => c.extractable);
      const discovered = extractable.slice(0, 1);
      setDiscoveredChemicals(prev => [...prev, ...discovered]);
      setGameMessage(`✅ Found: ${discovered.map(c => c.name).join(', ')}`);
    }

    setLabEquipment(prev => ({
      ...prev,
      lcms: { active: false, progress: 0 }
    }));
    setActiveAnalysis(null);
  };

  const deploySolution = (solution) => {
    if (funding >= solution.cost && !deployedSolutions.find(s => s.id === solution.id)) {
      setFunding(prev => prev - solution.cost);
      setDeployedSolutions(prev => [...prev, solution]);
      setExposureLevel(prev => Math.max(0, prev - solution.effectiveness));
      setGameMessage(`✅ ${solution.name} deployed!`);
    }
  };

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/90 rounded-2xl p-12 max-w-2xl text-center shadow-2xl border border-blue-500/30">
          <Beaker className="w-20 h-20 text-blue-400 mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-white mb-4">PFAS Crisis Lab 3D</h1>
          <p className="text-blue-200 text-lg mb-8">
            Use analytical chemistry to identify and remediate forever chemicals
          </p>
          <button
            onClick={startGame}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-10 py-4 rounded-xl text-xl font-bold hover:from-blue-600 hover:to-cyan-600 transition-all"
          >
            Enter Laboratory
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
          <p className="text-green-200 text-xl mb-6">PFAS exposure reduced to safe levels!</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-xl text-lg font-bold"
          >
            New Case
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
          <h1 className="text-5xl font-bold text-white mb-4">Crisis Escalated</h1>
          <p className="text-red-200 text-xl mb-6">
            {exposureLevel >= 100 ? 'Exposure exceeded safe limits' : 'Funding depleted'}
          </p>
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
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <p className="text-blue-300 text-xs">Day</p>
              <p className="text-white text-xl font-bold">{day}</p>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <p className="text-green-300 text-xs">Research</p>
              <p className="text-white text-xl font-bold">{researchPoints}</p>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <p className="text-yellow-300 text-xs">Funding</p>
              <p className="text-white text-xl font-bold">${(funding/1000).toFixed(0)}K</p>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <p className="text-red-300 text-xs">Exposure</p>
              <p className="text-white text-xl font-bold">{exposureLevel.toFixed(1)}%</p>
              <div className="w-full bg-slate-600 rounded-full h-1.5 mt-1">
                <div 
                  className={`h-1.5 rounded-full ${exposureLevel > 70 ? 'bg-red-500' : 'bg-green-500'}`}
                  style={{ width: `${exposureLevel}%` }}
                />
              </div>
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
          <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <TestTube className="w-5 h-5 text-cyan-400" />
            LC-MS/MS Analysis
          </h2>

          {labEquipment.lcms.active && (
            <div className="bg-slate-700/50 p-3 rounded-lg mb-3">
              <div className="flex justify-between text-xs text-cyan-300 mb-1">
                <span>{activeAnalysis?.name}</span>
                <span>{labEquipment.lcms.progress}%</span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${labEquipment.lcms.progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            {analysisTypes.map(analysis => (
              <div key={analysis.id} className="bg-slate-700/50 p-3 rounded-lg border border-slate-600">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-white font-bold text-sm">{analysis.icon} {analysis.name}</h3>
                  </div>
                  <button
                    onClick={() => startAnalysis(analysis.id)}
                    disabled={researchPoints < analysis.cost || labEquipment.lcms.active}
                    className={`px-3 py-1 rounded text-xs font-bold ${
                      researchPoints >= analysis.cost && !labEquipment.lcms.active
                        ? 'bg-cyan-500 hover:bg-cyan-600 text-white'
                        : 'bg-slate-600 text-slate-400'
                    }`}
                  >
                    {analysis.cost} RP
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-800/90 rounded-xl p-4 shadow-xl border border-slate-600">
            <h2 className="text-lg font-bold text-white mb-3">Identified ({discoveredChemicals.length})</h2>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {discoveredChemicals.length === 0 ? (
                <p className="text-slate-400 text-xs text-center py-3">No compounds yet</p>
              ) : (
                discoveredChemicals.map(chem => (
                  <div key={chem.id} className="bg-red-900/20 border border-red-500/50 p-2 rounded text-xs">
                    <h3 className="text-white font-bold">{chem.name}</h3>
                    <p className="text-red-300">Toxicity: {chem.toxicity}/10</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-slate-800/90 rounded-xl p-4 shadow-xl border border-slate-600">
            <h2 className="text-lg font-bold text-white mb-3">Solutions</h2>
            <div className="space-y-2">
              {solutions.map(sol => {
                const deployed = deployedSolutions.find(s => s.id === sol.id);
                return (
                  <div key={sol.id} className={`p-2 rounded border ${deployed ? 'bg-green-900/30 border-green-500' : 'bg-slate-700/50 border-slate-600'}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white font-bold text-xs">{sol.icon} {sol.name}</span>
                      {deployed && <span className="text-green-400 text-xs">✓</span>}
                    </div>
                    {!deployed && (
                      <button
                        onClick={() => deploySolution(sol)}
                        disabled={funding < sol.cost}
                        className={`w-full mt-1 px-2 py-1 rounded text-xs font-bold ${
                          funding >= sol.cost ? 'bg-green-500 text-white' : 'bg-slate-600 text-slate-400'
                        }`}
                      >
                        Deploy ${(sol.cost/1000).toFixed(0)}K
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PFASLabGame;
