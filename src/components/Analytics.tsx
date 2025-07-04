'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, TrendingUp, AlertTriangle, Award, Target, Brain, 
  Filter, ChevronDown, ChevronUp, BarChart3, PieChart, 
  LineChart, Activity, Zap, Shield, Star, Clock
} from 'lucide-react'
import { 
  Employee, 
  generateEmployeeData, 
  calculateDepartmentAnalytics, 
  calculateOverallAnalytics,
  departments,
  DepartmentAnalytics 
} from '@/lib/analytics-data'
import { 
  PredictiveAnalytics, 
  AttritionPrediction, 
  EngagementPrediction, 
  PerformancePrediction,
  CareerPathPrediction,
  analyzeSkillGaps,
  predictWorkforceNeeds
} from '@/lib/predictive-analytics'

interface FilterState {
  department: string
  role: string
  riskLevel: string
  performanceRange: [number, number]
  engagementRange: [number, number]
}

const Analytics = () => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [activeTab, setActiveTab] = useState('overview')
  const [filters, setFilters] = useState<FilterState>({
    department: 'All',
    role: 'All',
    riskLevel: 'All',
    performanceRange: [0, 1],
    engagementRange: [0, 1]
  })
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [expandedCards, setExpandedCards] = useState<{ [key: string]: boolean }>({})
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const predictiveAnalytics = useMemo(() => new PredictiveAnalytics(), [])

  useEffect(() => {
    const employeeData = generateEmployeeData(250)
    setEmployees(employeeData)
  }, [])

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      return (
        (filters.department === 'All' || emp.department === filters.department) &&
        (filters.role === 'All' || emp.role === filters.role) &&
        emp.performance >= filters.performanceRange[0] &&
        emp.performance <= filters.performanceRange[1] &&
        emp.engagement >= filters.engagementRange[0] &&
        emp.engagement <= filters.engagementRange[1]
      )
    })
  }, [employees, filters])

  const overallAnalytics = useMemo(() => {
    return calculateOverallAnalytics(filteredEmployees)
  }, [filteredEmployees])

  const departmentAnalytics = useMemo(() => {
    return departments.map(dept => calculateDepartmentAnalytics(filteredEmployees, dept))
  }, [filteredEmployees])

  const attritionPredictions = useMemo(() => {
    return filteredEmployees.map(emp => predictiveAnalytics.predictAttrition(emp))
  }, [filteredEmployees, predictiveAnalytics])

  const engagementPredictions = useMemo(() => {
    return filteredEmployees.map(emp => predictiveAnalytics.predictEngagement(emp))
  }, [filteredEmployees, predictiveAnalytics])

  const performancePredictions = useMemo(() => {
    return filteredEmployees.map(emp => predictiveAnalytics.predictPerformance(emp))
  }, [filteredEmployees, predictiveAnalytics])

  const careerPathPredictions = useMemo(() => {
    return filteredEmployees.map(emp => predictiveAnalytics.predictCareerPath(emp))
  }, [filteredEmployees, predictiveAnalytics])

  const skillGaps = useMemo(() => analyzeSkillGaps(filteredEmployees), [filteredEmployees])

  const workforceNeeds = useMemo(() => predictWorkforceNeeds(filteredEmployees), [filteredEmployees])

  const toggleCard = (cardId: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }))
  }

  const FilterPanel = () => (
    <motion.div 
      className="cyber-card mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-cyber text-neon-blue flex items-center gap-2">
          <Filter size={20} />
          Advanced Filters
        </h3>
        <button
          onClick={() => toggleCard('filters')}
          className="text-neon-green hover:text-neon-blue transition-colors"
        >
          {expandedCards['filters'] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {expandedCards['filters'] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
              <div>
                <label className="block text-sm font-cyber text-gray-300 mb-2">Department</label>
                <select
                  value={filters.department}
                  onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full bg-gray-800 border border-neon-blue/30 rounded px-3 py-2 text-white focus:border-neon-blue focus:outline-none"
                >
                  <option value="All">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-cyber text-gray-300 mb-2">Role Level</label>
                <select
                  value={filters.role}
                  onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full bg-gray-800 border border-neon-blue/30 rounded px-3 py-2 text-white focus:border-neon-blue focus:outline-none"
                >
                  <option value="All">All Roles</option>
                  <option value="Executive">Executive</option>
                  <option value="Manager">Manager</option>
                  <option value="Senior">Senior</option>
                  <option value="Mid-level">Mid-level</option>
                  <option value="Junior">Junior</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-cyber text-gray-300 mb-2">Performance Range</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={filters.performanceRange[0]}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      performanceRange: [parseFloat(e.target.value), prev.performanceRange[1]]
                    }))}
                    className="flex-1"
                  />
                  <span className="text-xs text-gray-400 w-8">{Math.round(filters.performanceRange[0] * 100)}%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-cyber text-gray-300 mb-2">Engagement Range</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={filters.engagementRange[0]}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      engagementRange: [parseFloat(e.target.value), prev.engagementRange[1]]
                    }))}
                    className="flex-1"
                  />
                  <span className="text-xs text-gray-400 w-8">{Math.round(filters.engagementRange[0] * 100)}%</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Employees"
          value={overallAnalytics.totalEmployees.toString()}
          subtitle="Active workforce"
          icon={Users}
          color="neon-blue"
          delay={0.1}
        />
        <MetricCard
          title="Avg Performance"
          value={`${(overallAnalytics.avgPerformance * 100).toFixed(1)}%`}
          subtitle="Organization wide"
          icon={TrendingUp}
          color="neon-green"
          delay={0.2}
        />
        <MetricCard
          title="Attrition Risk"
          value={`${overallAnalytics.attritionRate.toFixed(1)}%`}
          subtitle="Employees at risk"
          icon={AlertTriangle}
          color="yellow-400"
          delay={0.3}
        />
        <MetricCard
          title="High Performers"
          value={overallAnalytics.highPerformers.toString()}
          subtitle="Top talent pool"
          icon={Award}
          color="neon-purple"
          delay={0.4}
        />
      </div>

      {/* Predictive Insights */}
      <motion.div
        className="cyber-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <h3 className="text-xl font-cyber text-neon-green mb-4 flex items-center gap-2">
          <Brain size={24} />
          Predictive Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-effect p-4 rounded">
            <h4 className="font-cyber text-neon-blue mb-2">Workforce Predictions</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Expected Attrition (12 months):</span>
                <span className="text-yellow-400">{workforceNeeds.expectedAttrition}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Promotion Candidates:</span>
                <span className="text-neon-green">{overallAnalytics.predictiveInsights.promotionCandidates}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Budget Impact:</span>
                <span className="text-red-400">${(workforceNeeds.budgetImpact / 1000000).toFixed(1)}M</span>
              </div>
            </div>
          </div>
          <div className="glass-effect p-4 rounded">
            <h4 className="font-cyber text-neon-purple mb-2">Risk Factors</h4>
            <div className="space-y-1">
              {overallAnalytics.predictiveInsights.riskFactors.map((factor, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <AlertTriangle size={16} className="text-yellow-400" />
                  <span className="text-gray-300 text-sm">{factor}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Department Health */}
      <motion.div
        className="cyber-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <h3 className="text-xl font-cyber text-neon-blue mb-4">Department Health Matrix</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {departmentAnalytics.filter(dept => dept.totalEmployees > 0).map((dept, idx) => (
            <div key={dept.department} className="glass-effect p-4 rounded">
              <h4 className="font-cyber text-sm mb-2">{dept.department}</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Health Score:</span>
                  <span className={`text-xs ${
                    overallAnalytics.departmentHealth[dept.department] > 0.8 ? 'text-neon-green' :
                    overallAnalytics.departmentHealth[dept.department] > 0.6 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {(overallAnalytics.departmentHealth[dept.department] * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1">
                  <div 
                    className={`h-1 rounded-full transition-all duration-1000 ${
                      overallAnalytics.departmentHealth[dept.department] > 0.8 ? 'bg-neon-green' :
                      overallAnalytics.departmentHealth[dept.department] > 0.6 ? 'bg-yellow-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${overallAnalytics.departmentHealth[dept.department] * 100}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400">
                  {dept.totalEmployees} employees
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )

  const AttritionTab = () => (
    <div className="space-y-6">
      {/* Attrition Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Critical Risk"
          value={attritionPredictions.filter(p => p.riskLevel === 'Critical').length.toString()}
          subtitle="Immediate attention needed"
          icon={AlertTriangle}
          color="red-400"
          delay={0.1}
        />
        <MetricCard
          title="High Risk"
          value={attritionPredictions.filter(p => p.riskLevel === 'High').length.toString()}
          subtitle="3-6 months timeline"
          icon={Clock}
          color="yellow-400"
          delay={0.2}
        />
        <MetricCard
          title="Low Risk"
          value={attritionPredictions.filter(p => p.riskLevel === 'Low').length.toString()}
          subtitle="Stable employees"
          icon={Shield}
          color="neon-green"
          delay={0.3}
        />
      </div>

      {/* High Risk Employees */}
      <motion.div
        className="cyber-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h3 className="text-xl font-cyber text-red-400 mb-4 flex items-center gap-2">
          <AlertTriangle size={24} />
          High Risk Employees
        </h3>
        <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-neon-blue/50 scrollbar-track-gray-800">
          {attritionPredictions
            .filter(pred => pred.riskLevel === 'High' || pred.riskLevel === 'Critical')
            .map((prediction, idx) => {
              const employee = filteredEmployees.find(emp => emp.id === prediction.employeeId)
              if (!employee) return null
              
              return (
                <motion.div
                  key={prediction.employeeId}
                  className="glass-effect p-4 rounded cursor-pointer hover:border-neon-blue/50 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  onClick={() => setSelectedEmployee(employee)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-cyber text-white">{employee.name}</h4>
                      <p className="text-sm text-gray-400">{employee.department} • {employee.role}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-bold ${
                        prediction.riskLevel === 'Critical' ? 'text-red-400' : 'text-yellow-400'
                      }`}>
                        {prediction.riskLevel} Risk
                      </div>
                      <div className="text-xs text-gray-400">
                        {(prediction.probability * 100).toFixed(0)}% probability
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="text-xs text-gray-400 mb-1">Key Factors:</div>
                    <div className="flex flex-wrap gap-1">
                      {prediction.keyFactors.slice(0, 3).map((factor, idx) => (
                        <span key={idx} className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300">
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )
            })}
        </div>
      </motion.div>
    </div>
  )

  const PerformanceTab = () => (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Exceeds Expectations"
          value={performancePredictions.filter(p => p.potentialRating === 'Exceeds Expectations').length.toString()}
          subtitle="Top performers"
          icon={Star}
          color="neon-green"
          delay={0.1}
        />
        <MetricCard
          title="Meets Expectations"
          value={performancePredictions.filter(p => p.potentialRating === 'Meets Expectations').length.toString()}
          subtitle="Solid performers"
          icon={Target}
          color="neon-blue"
          delay={0.2}
        />
        <MetricCard
          title="Below Expectations"
          value={performancePredictions.filter(p => p.potentialRating === 'Below Expectations').length.toString()}
          subtitle="Needs improvement"
          icon={TrendingUp}
          color="yellow-400"
          delay={0.3}
        />
        <MetricCard
          title="Improving Trend"
          value={performancePredictions.filter(p => p.trend === 'Improving').length.toString()}
          subtitle="Positive trajectory"
          icon={Activity}
          color="neon-purple"
          delay={0.4}
        />
      </div>

      {/* Performance Predictions */}
      <motion.div
        className="cyber-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <h3 className="text-xl font-cyber text-neon-green mb-4 flex items-center gap-2">
          <BarChart3 size={24} />
          Performance Predictions
        </h3>
        <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-neon-blue/50 scrollbar-track-gray-800">
          {performancePredictions
            .sort((a, b) => b.predictedPerformance - a.predictedPerformance)
            .slice(0, 20)
            .map((prediction, idx) => {
              const employee = filteredEmployees.find(emp => emp.id === prediction.employeeId)
              if (!employee) return null
              
              return (
                <motion.div
                  key={prediction.employeeId}
                  className="glass-effect p-4 rounded cursor-pointer hover:border-neon-blue/50 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  onClick={() => setSelectedEmployee(employee)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-cyber text-white">{employee.name}</h4>
                      <p className="text-sm text-gray-400">{employee.department} • {employee.role}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-bold ${
                        prediction.trend === 'Improving' ? 'text-neon-green' :
                        prediction.trend === 'Declining' ? 'text-red-400' : 'text-neon-blue'
                      }`}>
                        {prediction.trend}
                      </div>
                      <div className="text-xs text-gray-400">
                        {(prediction.predictedPerformance * 100).toFixed(0)}% predicted
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ${
                          prediction.predictedPerformance > 0.8 ? 'bg-neon-green' :
                          prediction.predictedPerformance > 0.6 ? 'bg-neon-blue' : 'bg-yellow-400'
                        }`}
                        style={{ width: `${prediction.predictedPerformance * 100}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              )
            })}
        </div>
      </motion.div>
    </div>
  )

  const EngagementTab = () => (
    <div className="space-y-6">
      {/* Engagement Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Highly Engaged"
          value={engagementPredictions.filter(p => p.predictedEngagement > 0.8).length.toString()}
          subtitle="Above 80% engagement"
          icon={Zap}
          color="neon-green"
          delay={0.1}
        />
        <MetricCard
          title="At Risk"
          value={engagementPredictions.filter(p => p.predictedEngagement < 0.5).length.toString()}
          subtitle="Below 50% engagement"
          icon={AlertTriangle}
          color="red-400"
          delay={0.2}
        />
        <MetricCard
          title="Improving"
          value={engagementPredictions.filter(p => p.trend === 'Increasing').length.toString()}
          subtitle="Positive trend"
          icon={TrendingUp}
          color="neon-blue"
          delay={0.3}
        />
      </div>

      {/* Engagement Predictions */}
      <motion.div
        className="cyber-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h3 className="text-xl font-cyber text-neon-purple mb-4 flex items-center gap-2">
          <Activity size={24} />
          Engagement Predictions
        </h3>
        <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-neon-blue/50 scrollbar-track-gray-800">
          {engagementPredictions
            .sort((a, b) => {
              if (a.trend === 'Decreasing' && b.trend !== 'Decreasing') return -1
              if (b.trend === 'Decreasing' && a.trend !== 'Decreasing') return 1
              return a.predictedEngagement - b.predictedEngagement
            })
            .slice(0, 20)
            .map((prediction, idx) => {
              const employee = filteredEmployees.find(emp => emp.id === prediction.employeeId)
              if (!employee) return null
              
              return (
                <motion.div
                  key={prediction.employeeId}
                  className="glass-effect p-4 rounded cursor-pointer hover:border-neon-blue/50 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  onClick={() => setSelectedEmployee(employee)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-cyber text-white">{employee.name}</h4>
                      <p className="text-sm text-gray-400">{employee.department} • {employee.role}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-bold ${
                        prediction.trend === 'Increasing' ? 'text-neon-green' :
                        prediction.trend === 'Decreasing' ? 'text-red-400' : 'text-neon-blue'
                      }`}>
                        {prediction.trend}
                      </div>
                      <div className="text-xs text-gray-400">
                        {(prediction.predictedEngagement * 100).toFixed(0)}% predicted
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ${
                          prediction.predictedEngagement > 0.8 ? 'bg-neon-green' :
                          prediction.predictedEngagement > 0.6 ? 'bg-neon-blue' : 'bg-red-400'
                        }`}
                        style={{ width: `${prediction.predictedEngagement * 100}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              )
            })}
        </div>
      </motion.div>
    </div>
  )

  const CareerPathTab = () => (
    <div className="space-y-6">
      {/* Career Path Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Ready for Promotion"
          value={careerPathPredictions.filter(p => p.readinessScore > 0.8).length.toString()}
          subtitle="High readiness score"
          icon={Award}
          color="neon-green"
          delay={0.1}
        />
        <MetricCard
          title="Skill Development"
          value={careerPathPredictions.filter(p => p.skillGaps.length > 0).length.toString()}
          subtitle="Need skill building"
          icon={Target}
          color="neon-blue"
          delay={0.2}
        />
        <MetricCard
          title="Fast Track"
          value={careerPathPredictions.filter(p => p.timeToPromotion <= 12).length.toString()}
          subtitle="< 12 months to promotion"
          icon={Zap}
          color="neon-purple"
          delay={0.3}
        />
      </div>

      {/* Career Path Predictions */}
      <motion.div
        className="cyber-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h3 className="text-xl font-cyber text-neon-green mb-4 flex items-center gap-2">
          <Target size={24} />
          Career Path Predictions
        </h3>
        <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-neon-blue/50 scrollbar-track-gray-800">
          {careerPathPredictions
            .sort((a, b) => b.readinessScore - a.readinessScore)
            .slice(0, 20)
            .map((prediction, idx) => {
              const employee = filteredEmployees.find(emp => emp.id === prediction.employeeId)
              if (!employee) return null
              
              return (
                <motion.div
                  key={prediction.employeeId}
                  className="glass-effect p-4 rounded cursor-pointer hover:border-neon-blue/50 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  onClick={() => setSelectedEmployee(employee)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-cyber text-white">{employee.name}</h4>
                      <p className="text-sm text-gray-400">{employee.department} • {employee.role}</p>
                      <p className="text-xs text-neon-blue">Next Role: {prediction.nextRole}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-bold ${
                        prediction.readinessScore > 0.8 ? 'text-neon-green' :
                        prediction.readinessScore > 0.6 ? 'text-neon-blue' : 'text-yellow-400'
                      }`}>
                        {(prediction.readinessScore * 100).toFixed(0)}% Ready
                      </div>
                      <div className="text-xs text-gray-400">
                        {prediction.timeToPromotion} months
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ${
                          prediction.readinessScore > 0.8 ? 'bg-neon-green' :
                          prediction.readinessScore > 0.6 ? 'bg-neon-blue' : 'bg-yellow-400'
                        }`}
                        style={{ width: `${prediction.readinessScore * 100}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              )
            })}
        </div>
      </motion.div>
    </div>
  )

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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'attrition', label: 'Attrition Risk', icon: AlertTriangle },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'engagement', label: 'Engagement', icon: Activity },
    { id: 'career', label: 'Career Paths', icon: Target },
  ]

  return (
    <div className="space-y-6 h-full overflow-hidden flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-cyber text-neon-green mb-2">
          Advanced Analytics Dashboard
        </h2>
        <p className="text-gray-400 font-matrix">
          Predictive insights and workforce intelligence powered by AI
        </p>
      </motion.div>

      {/* Filters */}
      <FilterPanel />

      {/* Navigation Tabs */}
      <motion.div
        className="flex flex-wrap gap-2 mb-6"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-cyber text-sm transition-all duration-300 flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-neon-blue text-black glow-effect'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-neon-blue'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-neon-blue/50 scrollbar-track-gray-800"
        >
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'attrition' && <AttritionTab />}
          {activeTab === 'performance' && <PerformanceTab />}
          {activeTab === 'engagement' && <EngagementTab />}
          {activeTab === 'career' && <CareerPathTab />}
        </motion.div>
      </AnimatePresence>

      {/* Employee Detail Modal */}
      <AnimatePresence>
        {selectedEmployee && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEmployee(null)}
          >
            <motion.div
              className="cyber-card max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-neon-blue/50 scrollbar-track-gray-800"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-cyber text-neon-blue">{selectedEmployee.name}</h3>
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="text-gray-400 hover:text-neon-blue transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-effect p-3 rounded">
                    <h4 className="font-cyber text-neon-green text-sm mb-2">Basic Info</h4>
                    <p className="text-sm text-gray-300">Department: {selectedEmployee.department}</p>
                    <p className="text-sm text-gray-300">Role: {selectedEmployee.role}</p>
                    <p className="text-sm text-gray-300">Tenure: {selectedEmployee.tenure.toFixed(1)} years</p>
                  </div>
                  <div className="glass-effect p-3 rounded">
                    <h4 className="font-cyber text-neon-purple text-sm mb-2">Performance</h4>
                    <p className="text-sm text-gray-300">Current: {(selectedEmployee.performance * 100).toFixed(0)}%</p>
                    <p className="text-sm text-gray-300">Engagement: {(selectedEmployee.engagement * 100).toFixed(0)}%</p>
                    <p className="text-sm text-gray-300">Attrition Risk: {(selectedEmployee.attritionRisk * 100).toFixed(0)}%</p>
                  </div>
                </div>

                <div className="glass-effect p-3 rounded">
                  <h4 className="font-cyber text-neon-blue text-sm mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEmployee.skills.map((skill, idx) => (
                      <span key={idx} className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="glass-effect p-3 rounded">
                  <h4 className="font-cyber text-neon-green text-sm mb-2">Predictive Insights</h4>
                  <div className="space-y-2">
                    {(() => {
                      const attritionPred = attritionPredictions.find(p => p.employeeId === selectedEmployee.id)
                      const performancePred = performancePredictions.find(p => p.employeeId === selectedEmployee.id)
                      const careerPred = careerPathPredictions.find(p => p.employeeId === selectedEmployee.id)
                      
                      return (
                        <>
                          {attritionPred && (
                            <p className="text-sm text-gray-300">
                              Attrition Risk: <span className={`font-bold ${
                                attritionPred.riskLevel === 'Critical' ? 'text-red-400' :
                                attritionPred.riskLevel === 'High' ? 'text-yellow-400' : 'text-neon-green'
                              }`}>{attritionPred.riskLevel}</span>
                            </p>
                          )}
                          {performancePred && (
                            <p className="text-sm text-gray-300">
                              Performance Trend: <span className={`font-bold ${
                                performancePred.trend === 'Improving' ? 'text-neon-green' :
                                performancePred.trend === 'Declining' ? 'text-red-400' : 'text-neon-blue'
                              }`}>{performancePred.trend}</span>
                            </p>
                          )}
                          {careerPred && (
                            <p className="text-sm text-gray-300">
                              Next Role: <span className="font-bold text-neon-purple">{careerPred.nextRole}</span>
                              <span className="text-gray-400"> in {careerPred.timeToPromotion} months</span>
                            </p>
                          )}
                        </>
                      )
                    })()}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Analytics