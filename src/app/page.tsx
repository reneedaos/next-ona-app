'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import NetworkVisualization from '@/components/NetworkVisualization'
import Dashboard from '@/components/Dashboard'
import Analytics from '@/components/Analytics'
import Sidebar from '@/components/Sidebar'
import MatrixRain from '@/components/MatrixRain'

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard')

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
          {activeTab === 'simulation' && <div className="cyber-card h-full flex items-center justify-center">
            <h2 className="text-2xl font-cyber text-neon-purple">Simulation Engine - Coming Soon</h2>
          </div>}
        </motion.div>
      </div>
    </main>
  )
}