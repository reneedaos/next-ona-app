'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

// Safely import components with error boundaries
const NetworkVisualization = dynamic(() => import('@/components/NetworkVisualization'), {
  ssr: false,
  loading: () => <div>Loading Network...</div>
})
const Dashboard = dynamic(() => import('@/components/Dashboard'), {
  ssr: false,
  loading: () => <div>Loading Dashboard...</div>
})
const Analytics = dynamic(() => import('@/components/Analytics'), {
  ssr: false,
  loading: () => <div>Loading Analytics...</div>
})
const Sidebar = dynamic(() => import('@/components/Sidebar'), {
  ssr: false,
  loading: () => <div>Loading Sidebar...</div>
})
const MatrixRain = dynamic(() => import('@/components/MatrixRain'), {
  ssr: false,
  loading: () => <div>Loading Effects...</div>
})

// Dynamic import for Three.js component (no SSR)
const ThreeNetworkVisualization = dynamic(() => import('@/components/ThreeNetworkVisualization'), {
  ssr: false,
  loading: () => (
    <div className="cyber-card h-full flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue mb-4 mx-auto"></div>
        <p className="text-neon-blue">Loading 3D Visualization...</p>
      </div>
    </div>
  )
})

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard')
  
  // Simulation state
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationSpeed, setSimulationSpeed] = useState(1)
  const [simulationTime, setSimulationTime] = useState(0)
  const [resetTrigger, setResetTrigger] = useState(0)
  const [statistics, setStatistics] = useState({
    nodeCount: 0,
    edgeCount: 0,
    density: 0,
    averageDegree: 0,
    clusteringCoefficient: 0,
    departmentHomophily: 0
  })
  const [networkParams, setNetworkParams] = useState({
    nodes: 50,
    density: 0.3,
    homophily: 0.7,
    preferentialAttachment: 0.5,
    clustering: 0.4
  })

  const handleStartSimulation = () => {
    setIsSimulating(true)
  }

  const handleStopSimulation = () => {
    setIsSimulating(false)
  }

  const handleResetSimulation = () => {
    setIsSimulating(false)
    setSimulationTime(0)
    setResetTrigger(prev => prev + 1)
    setStatistics({
      nodeCount: 0,
      edgeCount: 0,
      density: 0,
      averageDegree: 0,
      clusteringCoefficient: 0,
      departmentHomophily: 0
    })
  }

  const handleStatisticsUpdate = useCallback((newStats: any) => {
    setStatistics(newStats)
    if (isSimulating) {
      setSimulationTime(prev => prev + 0.1)
    }
  }, [isSimulating])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      <MatrixRain />
      
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 p-6"
      >
        <div className="cyber-card">
          <h1 className="text-4xl font-cyber font-bold text-center bg-gradient-to-r from-neon-blue via-neon-purple to-neon-green bg-clip-text text-transparent">
            QUANTUM NETWORK ANALYZER
          </h1>
          <p className="text-center text-gray-300 mt-2 font-matrix">
            Advanced Organizational Network Intelligence System v2.0
          </p>
        </div>
      </motion.header>

      <div className="flex h-[calc(100vh-120px)] relative z-10">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Main Content */}
        <motion.div 
          className="flex-1 p-6 overflow-hidden flex flex-col"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'network' && <NetworkVisualization />}
          {activeTab === 'analytics' && <Analytics />}
          {activeTab === 'simulation' && (
            <div className="h-full flex">
              {/* Simulation Controls */}
              <div className="w-80 cyber-card mr-6 p-6 overflow-y-auto">
                <h2 className="text-2xl font-cyber text-neon-blue mb-6">ERGM Simulation</h2>
                
                {/* Controls */}
                <div className="space-y-6">
                  <div className="glass-effect p-4 rounded-lg">
                    <h3 className="text-lg font-cyber text-neon-green mb-4">Controls</h3>
                    
                    <div className="flex gap-3 mb-4">
                      <button
                        onClick={isSimulating ? handleStopSimulation : handleStartSimulation}
                        className="flex-1 bg-neon-blue/20 hover:bg-neon-blue/30 border border-neon-blue/50 rounded-lg p-3 flex items-center justify-center gap-2 transition-all duration-300"
                      >
                        {isSimulating ? 'Pause' : 'Start'}
                      </button>
                      
                      <button
                        onClick={handleResetSimulation}
                        className="bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple/50 rounded-lg p-3 transition-all duration-300"
                      >
                        Reset
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
                          className="w-full h-2 bg-cyber-gray rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Network Parameters */}
                  <div className="glass-effect p-4 rounded-lg">
                    <h3 className="text-lg font-cyber text-neon-purple mb-4">Network Parameters</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Nodes: {networkParams.nodes}</label>
                        <input
                          type="range"
                          min="20"
                          max="200"
                          value={networkParams.nodes}
                          onChange={(e) => setNetworkParams({...networkParams, nodes: parseInt(e.target.value)})}
                          className="w-full h-2 bg-cyber-gray rounded-lg appearance-none cursor-pointer"
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
                          className="w-full h-2 bg-cyber-gray rounded-lg appearance-none cursor-pointer"
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
                          className="w-full h-2 bg-cyber-gray rounded-lg appearance-none cursor-pointer"
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
                          className="w-full h-2 bg-cyber-gray rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Statistics */}
                  <div className="glass-effect p-4 rounded-lg">
                    <h3 className="text-lg font-cyber text-neon-green mb-4">Statistics</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Time:</span>
                        <span className="text-neon-blue">{formatTime(simulationTime)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Edges:</span>
                        <span className="text-neon-green">{statistics.edgeCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Density:</span>
                        <span className="text-neon-purple">{statistics.density.toFixed(3)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Clustering:</span>
                        <span className="text-neon-blue">{statistics.clusteringCoefficient.toFixed(3)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3D Visualization */}
              <div className="flex-1 cyber-card relative">
                <div className="absolute top-4 right-4 z-10 bg-cyber-dark/90 backdrop-blur-xl rounded-lg p-3 border border-neon-blue/30">
                  <h3 className="text-lg font-cyber text-neon-blue mb-1">3D Network</h3>
                  <p className="text-sm text-gray-300">
                    Orbit: Mouse | Zoom: Scroll | Select: Click
                  </p>
                </div>
                
                <ThreeNetworkVisualization
                  isSimulating={isSimulating}
                  simulationSpeed={simulationSpeed}
                  networkParams={networkParams}
                  onReset={handleResetSimulation}
                  onStatisticsUpdate={handleStatisticsUpdate}
                  resetTrigger={resetTrigger}
                />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  )
}