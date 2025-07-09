'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';

// Dynamic import for Three.js component (no SSR)
const ThreeNetworkVisualization = dynamic(() => import('@/components/ThreeNetworkVisualization'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue mb-4 mx-auto"></div>
        <p className="text-neon-blue">Loading 3D Visualization...</p>
      </div>
    </div>
  )
});

export default function SimulationPage() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [simulationTime, setSimulationTime] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [statistics, setStatistics] = useState({
    nodeCount: 0,
    edgeCount: 0,
    density: 0,
    averageDegree: 0,
    clusteringCoefficient: 0,
    departmentHomophily: 0
  });
  const [networkParams, setNetworkParams] = useState({
    nodes: 50,
    density: 0.3,
    homophily: 0.7,
    preferentialAttachment: 0.5,
    clustering: 0.4
  });

  const handleStartSimulation = () => {
    setIsSimulating(true);
  };

  const handleStopSimulation = () => {
    setIsSimulating(false);
  };

  const handleResetSimulation = () => {
    setIsSimulating(false);
    setSimulationTime(0);
    setResetTrigger(prev => prev + 1);
    setStatistics({
      nodeCount: 0,
      edgeCount: 0,
      density: 0,
      averageDegree: 0,
      clusteringCoefficient: 0,
      departmentHomophily: 0
    });
  };

  const handleStatisticsUpdate = useCallback((newStats: any) => {
    setStatistics(newStats);
    if (isSimulating) {
      setSimulationTime(prev => prev + 0.1);
    }
  }, [isSimulating]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-cyber-dark text-white overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyber-dark via-purple-900/20 to-cyber-dark pointer-events-none" />
      
      {/* Main Content */}
      <div className="relative z-10 flex h-screen">
        {/* Controls Panel */}
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-80 bg-cyber-gray/90 backdrop-blur-xl border-r border-neon-blue/30 p-6 overflow-y-auto"
        >
          <h1 className="text-2xl font-bold mb-6 text-neon-blue">
            ERGM Simulation
          </h1>
          
          {/* Simulation Controls */}
          <div className="space-y-6">
            <div className="bg-cyber-dark/50 rounded-lg p-4 border border-neon-blue/30">
              <h3 className="text-lg font-semibold mb-4 text-neon-green">Controls</h3>
              
              <div className="flex gap-3 mb-4">
                <button
                  onClick={isSimulating ? handleStopSimulation : handleStartSimulation}
                  className="flex-1 bg-neon-blue/20 hover:bg-neon-blue/30 border border-neon-blue/50 rounded-lg p-3 flex items-center justify-center gap-2 transition-all duration-300"
                >
                  {isSimulating ? <Pause size={16} /> : <Play size={16} />}
                  {isSimulating ? 'Pause' : 'Start'}
                </button>
                
                <button
                  onClick={handleResetSimulation}
                  className="bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple/50 rounded-lg p-3 flex items-center justify-center transition-all duration-300"
                >
                  <RotateCcw size={16} />
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Speed: {simulationSpeed}x</label>
                  <input
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.1"
                    value={simulationSpeed}
                    onChange={(e) => setSimulationSpeed(parseFloat(e.target.value))}
                    className="w-full h-2 bg-cyber-gray rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
            </div>

            {/* Network Parameters */}
            <div className="bg-cyber-dark/50 rounded-lg p-4 border border-neon-purple/30">
              <h3 className="text-lg font-semibold mb-4 text-neon-purple">Network Parameters</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nodes: {networkParams.nodes}</label>
                  <input
                    type="range"
                    min="20"
                    max="200"
                    value={networkParams.nodes}
                    onChange={(e) => setNetworkParams({...networkParams, nodes: parseInt(e.target.value)})}
                    className="w-full h-2 bg-cyber-gray rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Density: {networkParams.density.toFixed(2)}</label>
                  <input
                    type="range"
                    min="0.1"
                    max="0.8"
                    step="0.05"
                    value={networkParams.density}
                    onChange={(e) => setNetworkParams({...networkParams, density: parseFloat(e.target.value)})}
                    className="w-full h-2 bg-cyber-gray rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Homophily: {networkParams.homophily.toFixed(2)}</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={networkParams.homophily}
                    onChange={(e) => setNetworkParams({...networkParams, homophily: parseFloat(e.target.value)})}
                    className="w-full h-2 bg-cyber-gray rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Preferential Attachment: {networkParams.preferentialAttachment.toFixed(2)}</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={networkParams.preferentialAttachment}
                    onChange={(e) => setNetworkParams({...networkParams, preferentialAttachment: parseFloat(e.target.value)})}
                    className="w-full h-2 bg-cyber-gray rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Clustering: {networkParams.clustering.toFixed(2)}</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={networkParams.clustering}
                    onChange={(e) => setNetworkParams({...networkParams, clustering: parseFloat(e.target.value)})}
                    className="w-full h-2 bg-cyber-gray rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-cyber-dark/50 rounded-lg p-4 border border-neon-green/30">
              <h3 className="text-lg font-semibold mb-4 text-neon-green">Statistics</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Simulation Time:</span>
                  <span className="text-neon-blue">{formatTime(simulationTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Edges:</span>
                  <span className="text-neon-green">{statistics.edgeCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Network Density:</span>
                  <span className="text-neon-purple">{statistics.density.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg. Degree:</span>
                  <span className="text-neon-blue">{statistics.averageDegree.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Clustering Coeff:</span>
                  <span className="text-neon-green">{statistics.clusteringCoefficient.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Dept. Homophily:</span>
                  <span className="text-neon-purple">{statistics.departmentHomophily.toFixed(3)}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 3D Visualization */}
        <div className="flex-1 relative">
          <ThreeNetworkVisualization
            isSimulating={isSimulating}
            simulationSpeed={simulationSpeed}
            networkParams={networkParams}
            onReset={handleResetSimulation}
            onStatisticsUpdate={handleStatisticsUpdate}
            resetTrigger={resetTrigger}
          />
          
          {/* Overlay Info */}
          <div className="absolute top-4 right-4 bg-cyber-dark/90 backdrop-blur-xl rounded-lg p-4 border border-neon-blue/30">
            <h3 className="text-lg font-semibold text-neon-blue mb-2">3D Network View</h3>
            <p className="text-sm text-gray-300">
              Mouse: Orbit | Scroll: Zoom | Click: Select Node
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}