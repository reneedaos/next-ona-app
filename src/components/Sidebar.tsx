'use client'

import { motion } from 'framer-motion'
import { Activity, Network, BarChart3, Zap } from 'lucide-react'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Activity, color: 'neon-blue' },
  { id: 'network', label: 'Network', icon: Network, color: 'neon-green' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'neon-purple' },
  { id: 'simulation', label: 'Simulation', icon: Zap, color: 'neon-blue' },
]

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  return (
    <motion.div 
      className="w-64 cyber-card mr-6"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-xl font-cyber text-neon-green mb-6">CONTROL PANEL</h2>
      
      <nav className="space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          
          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                isActive 
                  ? 'bg-cyber-light neon-glow border border-neon-blue' 
                  : 'hover:bg-cyber-gray border border-transparent'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon 
                size={20} 
                className={`${isActive ? 'text-neon-blue' : 'text-gray-400'}`} 
              />
              <span className={`font-cyber ${isActive ? 'text-white' : 'text-gray-400'}`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  className="ml-auto w-2 h-2 bg-neon-blue rounded-full"
                  layoutId="activeIndicator"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          )
        })}
      </nav>
      
      <div className="mt-8 pt-6 border-t border-gray-700">
        <div className="glass-effect p-4 rounded-lg">
          <h3 className="font-cyber text-sm text-neon-purple mb-2">SYSTEM STATUS</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">Network</span>
              <span className="text-xs text-neon-green">ONLINE</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">Nodes</span>
              <span className="text-xs text-neon-blue">50</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">Connections</span>
              <span className="text-xs text-neon-purple">80</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Sidebar