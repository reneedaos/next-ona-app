import { Employee } from './analytics-data'

export interface PredictiveModel {
  name: string
  accuracy: number
  lastTrainingDate: Date
  features: string[]
  type: 'classification' | 'regression'
}

export interface AttritionPrediction {
  employeeId: string
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical'
  probability: number
  keyFactors: string[]
  recommendations: string[]
  timeline: '1-3 months' | '3-6 months' | '6-12 months' | '12+ months'
  confidence: number
}

export interface EngagementPrediction {
  employeeId: string
  predictedEngagement: number
  trend: 'Increasing' | 'Stable' | 'Decreasing'
  factors: string[]
  recommendations: string[]
  confidence: number
}

export interface PerformancePrediction {
  employeeId: string
  predictedPerformance: number
  trend: 'Improving' | 'Stable' | 'Declining'
  potentialRating: 'Exceeds Expectations' | 'Meets Expectations' | 'Below Expectations'
  developmentAreas: string[]
  strengths: string[]
  confidence: number
}

export interface CareerPathPrediction {
  employeeId: string
  nextRole: string
  timeToPromotion: number // in months
  readinessScore: number
  skillGaps: string[]
  recommendedActions: string[]
  confidence: number
}

export interface TeamDynamicsPrediction {
  teamId: string
  collaborationScore: number
  communicationHealth: number
  productivityForecast: number
  riskFactors: string[]
  opportunities: string[]
  recommendedInterventions: string[]
}

// Advanced ML-inspired algorithms (simplified for demo)
export class PredictiveAnalytics {
  private models: { [key: string]: PredictiveModel } = {
    attrition: {
      name: 'Attrition Risk Model',
      accuracy: 0.87,
      lastTrainingDate: new Date('2023-12-01'),
      features: ['engagement', 'performance', 'tenure', 'salary', 'workload', 'manager_rating', 'promotion_history'],
      type: 'classification'
    },
    engagement: {
      name: 'Engagement Prediction Model',
      accuracy: 0.82,
      lastTrainingDate: new Date('2023-11-15'),
      features: ['performance', 'tenure', 'workload', 'training_hours', 'team_dynamics', 'recognition'],
      type: 'regression'
    },
    performance: {
      name: 'Performance Forecasting Model',
      accuracy: 0.79,
      lastTrainingDate: new Date('2023-11-20'),
      features: ['historical_performance', 'skills', 'training', 'engagement', 'project_complexity'],
      type: 'regression'
    }
  }

  // Ensemble method combining multiple factors
  predictAttrition(employee: Employee): AttritionPrediction {
    const factors = []
    let riskScore = 0

    // Engagement factor (35% weight)
    if (employee.engagement < 0.4) {
      riskScore += 0.35
      factors.push('Very low engagement')
    } else if (employee.engagement < 0.6) {
      riskScore += 0.2
      factors.push('Below average engagement')
    }

    // Performance vs Engagement mismatch (20% weight)
    if (employee.performance > 0.8 && employee.engagement < 0.6) {
      riskScore += 0.2
      factors.push('High performer with low engagement')
    }

    // Tenure factor (15% weight)
    if (employee.tenure < 0.5) {
      riskScore += 0.1
      factors.push('New employee adjustment period')
    } else if (employee.tenure > 7 && employee.performance < 0.7) {
      riskScore += 0.15
      factors.push('Long tenure with stagnant performance')
    }

    // Salary vs Performance (10% weight)
    const expectedSalary = this.calculateExpectedSalary(employee.role, employee.performance)
    if (employee.salary < expectedSalary * 0.9) {
      riskScore += 0.1
      factors.push('Below market compensation')
    }

    // Manager relationship (10% weight)
    if (employee.collaborationScore < 0.5) {
      riskScore += 0.1
      factors.push('Poor collaboration scores')
    }

    // Workload and burnout (10% weight)
    if (employee.burnoutRisk > 0.7) {
      riskScore += 0.1
      factors.push('High burnout risk')
    }

    // Determine risk level and timeline
    let riskLevel: AttritionPrediction['riskLevel']
    let timeline: AttritionPrediction['timeline']

    if (riskScore >= 0.7) {
      riskLevel = 'Critical'
      timeline = '1-3 months'
    } else if (riskScore >= 0.5) {
      riskLevel = 'High'
      timeline = '3-6 months'
    } else if (riskScore >= 0.3) {
      riskLevel = 'Medium'
      timeline = '6-12 months'
    } else {
      riskLevel = 'Low'
      timeline = '12+ months'
    }

    const recommendations = this.generateAttritionRecommendations(factors, riskLevel)
    const confidence = this.calculateConfidence(employee, 'attrition')

    return {
      employeeId: employee.id,
      riskLevel,
      probability: Math.min(0.95, riskScore),
      keyFactors: factors,
      recommendations,
      timeline,
      confidence
    }
  }

  predictEngagement(employee: Employee): EngagementPrediction {
    const currentEngagement = employee.engagement
    const historicalTrend = this.calculateEngagementTrend(employee)
    
    let predictedEngagement = currentEngagement
    const factors = []

    // Performance correlation
    if (employee.performance > 0.8) {
      predictedEngagement += 0.05
      factors.push('High performance correlation')
    }

    // Training investment
    if (employee.trainingHours > 60) {
      predictedEngagement += 0.08
      factors.push('High training investment')
    }

    // Career growth opportunities
    if (employee.promotionReadiness > 0.7) {
      predictedEngagement += 0.1
      factors.push('High promotion readiness')
    } else if (employee.tenure > 3 && employee.promotionReadiness < 0.3) {
      predictedEngagement -= 0.1
      factors.push('Limited growth opportunities')
    }

    // Team dynamics
    if (employee.collaborationScore > 0.8) {
      predictedEngagement += 0.05
      factors.push('Strong team collaboration')
    }

    // Work-life balance
    if (employee.burnoutRisk > 0.6) {
      predictedEngagement -= 0.15
      factors.push('High burnout risk')
    }

    // Recognition and feedback
    if (employee.lastReviewScore > 0.8) {
      predictedEngagement += 0.05
      factors.push('Positive performance reviews')
    }

    predictedEngagement = Math.max(0, Math.min(1, predictedEngagement))

    const trend = predictedEngagement > currentEngagement + 0.05 ? 'Increasing' :
                 predictedEngagement < currentEngagement - 0.05 ? 'Decreasing' : 'Stable'

    const recommendations = this.generateEngagementRecommendations(factors, trend, predictedEngagement)
    const confidence = this.calculateConfidence(employee, 'engagement')

    return {
      employeeId: employee.id,
      predictedEngagement,
      trend,
      factors,
      recommendations,
      confidence
    }
  }

  predictPerformance(employee: Employee): PerformancePrediction {
    const currentPerformance = employee.performance
    const historicalAvg = employee.historicalPerformance.reduce((sum, h) => sum + h.performance, 0) / employee.historicalPerformance.length
    
    let predictedPerformance = currentPerformance
    const developmentAreas = []
    const strengths = []

    // Skill development trajectory
    if (employee.technicalSkillsScore > 0.8) {
      predictedPerformance += 0.05
      strengths.push('Strong technical skills')
    } else if (employee.technicalSkillsScore < 0.6) {
      predictedPerformance -= 0.05
      developmentAreas.push('Technical skill enhancement')
    }

    // Leadership and collaboration
    if (employee.leadershipScore > 0.8) {
      predictedPerformance += 0.05
      strengths.push('Leadership capabilities')
    } else if (employee.leadershipScore < 0.6) {
      developmentAreas.push('Leadership development')
    }

    // Innovation and adaptability
    if (employee.innovationScore > 0.8 && employee.adaptabilityScore > 0.8) {
      predictedPerformance += 0.08
      strengths.push('Innovation and adaptability')
    }

    // Communication effectiveness
    if (employee.communicationScore < 0.6) {
      predictedPerformance -= 0.03
      developmentAreas.push('Communication skills')
    }

    // Engagement impact on performance
    if (employee.engagement < 0.5) {
      predictedPerformance -= 0.1
      developmentAreas.push('Engagement and motivation')
    }

    // Training effectiveness
    if (employee.trainingHours > 40) {
      predictedPerformance += 0.05
      strengths.push('Continuous learning')
    }

    predictedPerformance = Math.max(0, Math.min(1, predictedPerformance))

    const trend = predictedPerformance > currentPerformance + 0.05 ? 'Improving' :
                 predictedPerformance < currentPerformance - 0.05 ? 'Declining' : 'Stable'

    const potentialRating = predictedPerformance > 0.8 ? 'Exceeds Expectations' :
                           predictedPerformance > 0.6 ? 'Meets Expectations' : 'Below Expectations'

    const confidence = this.calculateConfidence(employee, 'performance')

    return {
      employeeId: employee.id,
      predictedPerformance,
      trend,
      potentialRating,
      developmentAreas,
      strengths,
      confidence
    }
  }

  predictCareerPath(employee: Employee): CareerPathPrediction {
    const roleHierarchy: { [key: string]: string } = {
      'Junior': 'Mid-level',
      'Mid-level': 'Senior',
      'Senior': 'Manager',
      'Manager': 'Executive',
      'Executive': 'Senior Executive'
    }

    const nextRole = roleHierarchy[employee.level] || 'Senior Executive'
    const skillGaps = []
    const recommendedActions = []

    // Calculate readiness based on multiple factors
    let readinessScore = employee.promotionReadiness

    // Adjust based on performance
    if (employee.performance > 0.8) readinessScore += 0.1
    if (employee.performance < 0.6) readinessScore -= 0.1

    // Adjust based on leadership for management roles
    if (nextRole.includes('Manager') || nextRole.includes('Executive')) {
      if (employee.leadershipScore < 0.7) {
        skillGaps.push('Leadership skills')
        recommendedActions.push('Participate in leadership development program')
        readinessScore -= 0.1
      }
    }

    // Technical skills for senior roles
    if (nextRole.includes('Senior') && employee.technicalSkillsScore < 0.8) {
      skillGaps.push('Advanced technical skills')
      recommendedActions.push('Pursue advanced technical training')
      readinessScore -= 0.05
    }

    // Communication for all advancement
    if (employee.communicationScore < 0.7) {
      skillGaps.push('Communication skills')
      recommendedActions.push('Enhance communication and presentation skills')
      readinessScore -= 0.05
    }

    // Calculate time to promotion
    let timeToPromotion = 24 // Default 2 years
    if (readinessScore > 0.8) timeToPromotion = 12
    else if (readinessScore > 0.6) timeToPromotion = 18
    else if (readinessScore < 0.4) timeToPromotion = 36

    // Adjust based on tenure
    if (employee.tenure < 1) timeToPromotion += 12
    else if (employee.tenure > 5) timeToPromotion -= 6

    const confidence = this.calculateConfidence(employee, 'career')

    return {
      employeeId: employee.id,
      nextRole,
      timeToPromotion: Math.max(6, timeToPromotion),
      readinessScore: Math.max(0, Math.min(1, readinessScore)),
      skillGaps,
      recommendedActions,
      confidence
    }
  }

  private calculateExpectedSalary(role: string, performance: number): number {
    const baseSalaries: { [key: string]: number } = {
      'Junior': 65000,
      'Mid-level': 85000,
      'Senior': 120000,
      'Manager': 140000,
      'Executive': 180000
    }

    const base = baseSalaries[role] || 75000
    return base * (1 + (performance - 0.5) * 0.4)
  }

  private calculateEngagementTrend(employee: Employee): number {
    const recentMonths = employee.historicalPerformance.slice(-6)
    if (recentMonths.length < 3) return 0

    const firstHalf = recentMonths.slice(0, 3).reduce((sum, h) => sum + h.engagement, 0) / 3
    const secondHalf = recentMonths.slice(3).reduce((sum, h) => sum + h.engagement, 0) / 3
    
    return secondHalf - firstHalf
  }

  private generateAttritionRecommendations(factors: string[], riskLevel: string): string[] {
    const recommendations = []

    if (factors.includes('Very low engagement') || factors.includes('Below average engagement')) {
      recommendations.push('Schedule one-on-one meeting to discuss engagement concerns')
      recommendations.push('Implement personalized engagement plan')
    }

    if (factors.includes('High performer with low engagement')) {
      recommendations.push('Discuss career advancement opportunities')
      recommendations.push('Consider special projects or leadership roles')
    }

    if (factors.includes('Below market compensation')) {
      recommendations.push('Review compensation package')
      recommendations.push('Consider salary adjustment or additional benefits')
    }

    if (factors.includes('High burnout risk')) {
      recommendations.push('Assess workload and redistribute tasks')
      recommendations.push('Encourage time off and work-life balance')
    }

    if (riskLevel === 'Critical') {
      recommendations.push('Immediate manager intervention required')
      recommendations.push('Consider retention bonus or special incentives')
    }

    return recommendations
  }

  private generateEngagementRecommendations(factors: string[], trend: string, predictedEngagement: number): string[] {
    const recommendations = []

    if (trend === 'Decreasing') {
      recommendations.push('Investigate causes of declining engagement')
      recommendations.push('Implement immediate intervention measures')
    }

    if (factors.includes('Limited growth opportunities')) {
      recommendations.push('Discuss career development plans')
      recommendations.push('Identify stretch assignments or new responsibilities')
    }

    if (factors.includes('High burnout risk')) {
      recommendations.push('Review workload and provide additional support')
      recommendations.push('Encourage wellness programs participation')
    }

    if (predictedEngagement > 0.8) {
      recommendations.push('Leverage high engagement for mentoring roles')
      recommendations.push('Consider as culture champion or team leader')
    }

    return recommendations
  }

  private calculateConfidence(employee: Employee, modelType: string): number {
    const model = this.models[modelType]
    if (!model) return 0.5

    let confidence = model.accuracy

    // Adjust based on data quality
    if (employee.historicalPerformance.length >= 12) confidence += 0.05
    if (employee.tenure > 1) confidence += 0.05
    if (employee.lastReviewScore > 0) confidence += 0.03

    // Adjust based on model age
    const daysSinceTraining = (Date.now() - model.lastTrainingDate.getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceTraining > 90) confidence -= 0.05

    return Math.max(0.5, Math.min(0.95, confidence))
  }
}

// Utility functions for advanced analytics
export const analyzeSkillGaps = (employees: Employee[]): { [skill: string]: number } => {
  const skillDemand: { [skill: string]: number } = {}
  const skillSupply: { [skill: string]: number } = {}

  employees.forEach(emp => {
    emp.skills.forEach(skill => {
      skillSupply[skill] = (skillSupply[skill] || 0) + 1
    })
  })

  // Simulate skill demand based on roles and departments
  const highDemandSkills = [
    'Leadership', 'Data Analysis', 'Machine Learning', 'Cloud Computing',
    'Project Management', 'Communication', 'Strategic Planning'
  ]

  highDemandSkills.forEach(skill => {
    skillDemand[skill] = Math.floor(employees.length * 0.4) // 40% of workforce should have these skills
  })

  const skillGaps: { [skill: string]: number } = {}
  Object.keys(skillDemand).forEach(skill => {
    const gap = skillDemand[skill] - (skillSupply[skill] || 0)
    if (gap > 0) {
      skillGaps[skill] = gap
    }
  })

  return skillGaps
}

export const predictWorkforceNeeds = (employees: Employee[], months: number = 12): {
  expectedAttrition: number
  skillsNeeded: string[]
  rolesNeeded: string[]
  budgetImpact: number
} => {
  const predictiveAnalytics = new PredictiveAnalytics()
  
  const attritionPredictions = employees.map(emp => predictiveAnalytics.predictAttrition(emp))
  const highRiskEmployees = attritionPredictions.filter(pred => pred.riskLevel === 'High' || pred.riskLevel === 'Critical')
  
  const expectedAttrition = Math.round(highRiskEmployees.length * 0.7) // 70% of high-risk employees

  const skillsNeeded = analyzeSkillGaps(employees)
  const rolesNeeded: string[] = []
  
  // Calculate budget impact
  const avgSalary = employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length
  const budgetImpact = expectedAttrition * avgSalary * 1.5 // 1.5x for replacement costs

  return {
    expectedAttrition,
    skillsNeeded: Object.keys(skillsNeeded),
    rolesNeeded,
    budgetImpact
  }
}