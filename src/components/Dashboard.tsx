'use client'

import { motion } from 'framer-motion'
import { Users, Network, TrendingUp, AlertTriangle } from 'lucide-react'

const MetricCard = ({ title, value, subtitle, icon: Icon, color, delay }: any) => (
  <motion.div
    className="cyber-card"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ scale: 1.02 }}
  >
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-sm font-cyber text-gray-400 mb-1">{title}</h3>
        <p className={`text-2xl font-bold text-${color}`}>{value}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
      <Icon className={`text-${color} opacity-50`} size={24} />
    </div>
  </motion.div>
)

const Dashboard = () => {
  const metrics = [
    {
      title: 'TOTAL EMPLOYEES',
      value: '50',
      subtitle: 'Active network nodes',
      icon: Users,
      color: 'neon-blue',
      delay: 0.1,
    },
    {
      title: 'CONNECTIONS',
      value: '80',
      subtitle: 'Network relationships',
      icon: Network,
      color: 'neon-green',
      delay: 0.2,
    },
    {
      title: 'ENGAGEMENT',
      value: '73.2%',
      subtitle: 'Average engagement score',
      icon: TrendingUp,
      color: 'neon-purple',
      delay: 0.3,
    },
    {
      title: 'RISK FACTORS',
      value: '12',
      subtitle: 'Nodes requiring attention',
      icon: AlertTriangle,
      color: 'yellow-400',
      delay: 0.4,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Network Overview */}
        <motion.div
          className="cyber-card"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <h2 className="text-xl font-cyber text-neon-blue mb-4">NETWORK TOPOLOGY</h2>
          <div className="h-64 bg-black/30 rounded-lg flex items-center justify-center border border-neon-blue/20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-neon-blue rounded-full animate-pulse mx-auto mb-4"></div>
              <p className="text-gray-400 font-matrix">Quantum network visualization</p>
              <p className="text-xs text-gray-500 mt-2">50 nodes • 80 connections</p>
            </div>
          </div>
        </motion.div>

        {/* Department Analysis */}
        <motion.div
          className="cyber-card"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="text-xl font-cyber text-neon-green mb-4">DEPARTMENT MATRIX</h2>
          <div className="space-y-3">
            {[
              { name: 'Engineering', count: 15, color: 'neon-blue', percentage: 68 },
              { name: 'Sales', count: 12, color: 'neon-purple', percentage: 82 },
              { name: 'Marketing', count: 8, color: 'neon-green', percentage: 75 },
              { name: 'HR', count: 6, color: 'yellow-400', percentage: 90 },
              { name: 'Finance', count: 9, color: 'red-400', percentage: 65 },
            ].map((dept, index) => (
              <motion.div
                key={dept.name}
                className="flex items-center justify-between p-3 glass-effect rounded"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 bg-${dept.color} rounded-full`}></div>
                  <span className="font-cyber text-sm">{dept.name}</span>
                  <span className="text-xs text-gray-400">({dept.count})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-700 rounded-full h-1">
                    <motion.div
                      className={`bg-${dept.color} h-1 rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${dept.percentage}%` }}
                      transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                    />
                  </div>
                  <span className={`text-xs text-${dept.color}`}>{dept.percentage}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Activity Feed */}
      <motion.div
        className="cyber-card"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
      >
        <h2 className="text-xl font-cyber text-neon-purple mb-4">SYSTEM ACTIVITY LOG</h2>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {[
            { time: '14:32:15', message: 'New connection established: Employee_23 → Employee_41', type: 'success' },
            { time: '14:31:08', message: 'Engagement anomaly detected in Marketing department', type: 'warning' },
            { time: '14:29:44', message: 'Network scan completed successfully', type: 'info' },
            { time: '14:28:12', message: 'Employee_15 engagement score updated: 0.85', type: 'success' },
            { time: '14:26:33', message: 'Potential isolation risk for Employee_7', type: 'error' },
          ].map((log, index) => (
            <motion.div
              key={index}
              className="flex items-center space-x-3 p-2 glass-effect rounded text-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 1 + index * 0.1 }}
            >
              <span className="text-gray-500 font-matrix text-xs">{log.time}</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  log.type === 'success' ? 'bg-neon-green' :
                  log.type === 'warning' ? 'bg-yellow-400' :
                  log.type === 'error' ? 'bg-red-400' : 'bg-neon-blue'
                }`}
              />
              <span className="text-gray-300 flex-1">{log.message}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard