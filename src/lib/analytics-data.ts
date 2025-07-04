export interface Employee {
  id: string
  name: string
  department: string
  role: string
  level: 'Executive' | 'Manager' | 'Senior' | 'Mid-level' | 'Junior'
  engagement: number
  performance: number
  tenure: number // years
  salary: number
  lastPromotionDate: Date | null
  reportingManager: string | null
  directReports: string[]
  skills: string[]
  certifications: string[]
  projects: string[]
  trainingHours: number
  lastReviewScore: number
  collaborationScore: number
  innovationScore: number
  leadershipScore: number
  attritionRisk: number
  predictedPerformance: number
  careerGrowthPotential: number
  workloadBalance: number
  jobSatisfaction: number
  networkCentrality: number
  influenceScore: number
  mentorshipInvolvement: number
  crossFunctionalExperience: number
  adaptabilityScore: number
  communicationScore: number
  problemSolvingScore: number
  technicalSkillsScore: number
  burnoutRisk: number
  promotionReadiness: number
  flightRisk: number
  retentionScore: number
  diversityMetrics: {
    gender: string
    ethnicity: string
    age: number
    neurodiversity: boolean
    veteranStatus: boolean
    lgbtq: boolean
  }
  locationData: {
    office: string
    remote: boolean
    timeZone: string
    region: string
  }
  historicalPerformance: {
    month: string
    performance: number
    engagement: number
    projects: number
    trainingCompleted: number
  }[]
}

export interface AnalyticsMetrics {
  totalEmployees: number
  departmentBreakdown: { [key: string]: number }
  avgEngagement: number
  avgPerformance: number
  attritionRate: number
  promotionRate: number
  diversityIndex: number
  retentionRate: number
  highPerformers: number
  atRiskEmployees: number
  burnoutCases: number
  trainingInvestment: number
  productivityScore: number
  collaborationIndex: number
  innovationIndex: number
  leadershipPipeline: number
  skillsGaps: { [key: string]: number }
  departmentHealth: { [key: string]: number }
  predictiveInsights: {
    expectedAttrition: number
    promotionCandidates: number
    riskFactors: string[]
    opportunities: string[]
  }
}

export interface DepartmentAnalytics {
  department: string
  totalEmployees: number
  avgEngagement: number
  avgPerformance: number
  attritionRate: number
  promotionRate: number
  avgTenure: number
  avgSalary: number
  productivityScore: number
  collaborationScore: number
  innovationScore: number
  leadershipScore: number
  burnoutRisk: number
  retentionScore: number
  skillsDistribution: { [key: string]: number }
  roleDistribution: { [key: string]: number }
  performanceTrends: { month: string; performance: number }[]
  engagementTrends: { month: string; engagement: number }[]
  attritionTrends: { month: string; attrition: number }[]
  riskFactors: string[]
  recommendations: string[]
}

export const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations', 'Legal', 'Customer Success']

export const roles = ['Executive', 'Manager', 'Senior', 'Mid-level', 'Junior']

export const skills = [
  'JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'Docker', 'Machine Learning', 'Data Analysis',
  'Project Management', 'Leadership', 'Communication', 'Sales', 'Marketing', 'Finance', 'HR',
  'Operations', 'Legal', 'Customer Service', 'Design', 'UX/UI', 'DevOps', 'Security', 'Database',
  'Testing', 'Agile', 'Scrum', 'Product Management', 'Strategy', 'Analytics', 'Business Intelligence'
]

export const generateEmployeeData = (count: number = 250): Employee[] => {
  const employees: Employee[] = []
  const names = [
    'Alex Johnson', 'Sarah Chen', 'Michael Rodriguez', 'Emily Davis', 'David Kim',
    'Jessica Brown', 'Robert Wilson', 'Amanda Garcia', 'Christopher Lee', 'Michelle Taylor',
    'Daniel Anderson', 'Ashley Martinez', 'Matthew Thomas', 'Lauren Jackson', 'Kevin White',
    'Nicole Harris', 'James Clark', 'Rachel Lewis', 'Brian Robinson', 'Stephanie Walker',
    'Joseph Hall', 'Megan Allen', 'William Young', 'Jennifer King', 'Thomas Wright',
    'Elizabeth Lopez', 'Joshua Hill', 'Samantha Scott', 'Andrew Green', 'Christina Adams',
    'Ryan Baker', 'Rebecca Nelson', 'Steven Carter', 'Katherine Mitchell', 'Brandon Perez',
    'Heather Roberts', 'Eric Turner', 'Amanda Phillips', 'Jonathan Campbell', 'Melissa Parker',
    'Adam Evans', 'Lisa Edwards', 'Justin Collins', 'Diana Stewart', 'Timothy Sanchez',
    'Maria Morris', 'Charles Rogers', 'Teresa Reed', 'Mark Cook', 'Angela Bailey'
  ]

  for (let i = 0; i < count; i++) {
    const dept = departments[Math.floor(Math.random() * departments.length)]
    const role = roles[Math.floor(Math.random() * roles.length)]
    const tenure = Math.random() * 15 + 0.5
    const basePerformance = Math.random() * 0.4 + 0.6
    const baseEngagement = Math.random() * 0.4 + 0.6
    
    // Generate historical performance data
    const historicalData = []
    for (let month = 0; month < 12; month++) {
      const monthName = new Date(2023, month).toLocaleDateString('en-US', { month: 'short' })
      historicalData.push({
        month: monthName,
        performance: Math.max(0, Math.min(1, basePerformance + (Math.random() - 0.5) * 0.3)),
        engagement: Math.max(0, Math.min(1, baseEngagement + (Math.random() - 0.5) * 0.3)),
        projects: Math.floor(Math.random() * 5) + 1,
        trainingCompleted: Math.floor(Math.random() * 3)
      })
    }

    const employee: Employee = {
      id: `emp-${i + 1}`,
      name: names[i % names.length] + (i >= names.length ? ` ${Math.floor(i / names.length) + 1}` : ''),
      department: dept,
      role: role,
      level: role as any,
      engagement: baseEngagement,
      performance: basePerformance,
      tenure: tenure,
      salary: Math.floor((Math.random() * 150000 + 50000) * (roles.indexOf(role) + 1) / 5),
      lastPromotionDate: Math.random() > 0.7 ? new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000 * 3) : null,
      reportingManager: Math.random() > 0.2 ? `emp-${Math.floor(Math.random() * count) + 1}` : null,
      directReports: [],
      skills: skills.slice(0, Math.floor(Math.random() * 8) + 3),
      certifications: Math.random() > 0.6 ? [`${skills[Math.floor(Math.random() * skills.length)]} Certified`] : [],
      projects: [`Project ${Math.floor(Math.random() * 100) + 1}`],
      trainingHours: Math.floor(Math.random() * 80) + 20,
      lastReviewScore: Math.random() * 0.4 + 0.6,
      collaborationScore: Math.random() * 0.4 + 0.6,
      innovationScore: Math.random() * 0.4 + 0.6,
      leadershipScore: Math.random() * 0.4 + 0.6,
      attritionRisk: calculateAttritionRisk(baseEngagement, basePerformance, tenure, role),
      predictedPerformance: basePerformance + (Math.random() - 0.5) * 0.2,
      careerGrowthPotential: Math.random() * 0.4 + 0.6,
      workloadBalance: Math.random() * 0.4 + 0.6,
      jobSatisfaction: Math.random() * 0.4 + 0.6,
      networkCentrality: Math.random() * 0.4 + 0.6,
      influenceScore: Math.random() * 0.4 + 0.6,
      mentorshipInvolvement: Math.random() * 0.4 + 0.6,
      crossFunctionalExperience: Math.random() * 0.4 + 0.6,
      adaptabilityScore: Math.random() * 0.4 + 0.6,
      communicationScore: Math.random() * 0.4 + 0.6,
      problemSolvingScore: Math.random() * 0.4 + 0.6,
      technicalSkillsScore: Math.random() * 0.4 + 0.6,
      burnoutRisk: calculateBurnoutRisk(baseEngagement, basePerformance, tenure),
      promotionReadiness: calculatePromotionReadiness(basePerformance, tenure, role),
      flightRisk: calculateFlightRisk(baseEngagement, basePerformance, tenure),
      retentionScore: Math.random() * 0.4 + 0.6,
      diversityMetrics: {
        gender: Math.random() > 0.5 ? 'Female' : 'Male',
        ethnicity: ['Asian', 'Black', 'Hispanic', 'White', 'Other'][Math.floor(Math.random() * 5)],
        age: Math.floor(Math.random() * 40) + 22,
        neurodiversity: Math.random() > 0.9,
        veteranStatus: Math.random() > 0.95,
        lgbtq: Math.random() > 0.9
      },
      locationData: {
        office: ['New York', 'San Francisco', 'Austin', 'Seattle', 'Boston', 'Remote'][Math.floor(Math.random() * 6)],
        remote: Math.random() > 0.6,
        timeZone: ['EST', 'PST', 'CST', 'MST'][Math.floor(Math.random() * 4)],
        region: ['North America', 'Europe', 'Asia'][Math.floor(Math.random() * 3)]
      },
      historicalPerformance: historicalData
    }

    employees.push(employee)
  }

  return employees
}

function calculateAttritionRisk(engagement: number, performance: number, tenure: number, role: string): number {
  let risk = 0.5
  
  // Low engagement increases risk
  if (engagement < 0.5) risk += 0.3
  else if (engagement < 0.7) risk += 0.1
  else risk -= 0.1
  
  // Low performance increases risk
  if (performance < 0.5) risk += 0.2
  else if (performance < 0.7) risk += 0.05
  else risk -= 0.05
  
  // Tenure effects
  if (tenure < 1) risk += 0.2 // New employees
  else if (tenure > 7) risk += 0.1 // Long tenure might lead to stagnation
  else risk -= 0.1
  
  // Role effects
  if (role === 'Executive') risk -= 0.1
  else if (role === 'Junior') risk += 0.1
  
  return Math.max(0, Math.min(1, risk))
}

function calculateBurnoutRisk(engagement: number, performance: number, tenure: number): number {
  let risk = 0.3
  
  // High performance with low engagement suggests burnout
  if (performance > 0.8 && engagement < 0.6) risk += 0.4
  else if (performance > 0.7 && engagement < 0.7) risk += 0.2
  
  // Long tenure without progression
  if (tenure > 5) risk += 0.1
  
  return Math.max(0, Math.min(1, risk))
}

function calculatePromotionReadiness(performance: number, tenure: number, role: string): number {
  let readiness = 0.3
  
  // High performance increases readiness
  if (performance > 0.8) readiness += 0.4
  else if (performance > 0.7) readiness += 0.2
  
  // Adequate tenure
  if (tenure > 2 && tenure < 8) readiness += 0.2
  else if (tenure > 1) readiness += 0.1
  
  // Role limitations
  if (role === 'Executive') readiness -= 0.3
  else if (role === 'Junior') readiness += 0.1
  
  return Math.max(0, Math.min(1, readiness))
}

function calculateFlightRisk(engagement: number, performance: number, tenure: number): number {
  let risk = 0.4
  
  // High performers with low engagement are flight risks
  if (performance > 0.7 && engagement < 0.6) risk += 0.3
  else if (engagement < 0.5) risk += 0.2
  
  // Tenure effects
  if (tenure > 3 && tenure < 7) risk += 0.1 // Prime years for job hopping
  else if (tenure < 1) risk += 0.2 // New employees might leave
  
  return Math.max(0, Math.min(1, risk))
}

export const calculateDepartmentAnalytics = (employees: Employee[], department: string): DepartmentAnalytics => {
  const deptEmployees = employees.filter(emp => emp.department === department)
  
  if (deptEmployees.length === 0) {
    return {
      department,
      totalEmployees: 0,
      avgEngagement: 0,
      avgPerformance: 0,
      attritionRate: 0,
      promotionRate: 0,
      avgTenure: 0,
      avgSalary: 0,
      productivityScore: 0,
      collaborationScore: 0,
      innovationScore: 0,
      leadershipScore: 0,
      burnoutRisk: 0,
      retentionScore: 0,
      skillsDistribution: {},
      roleDistribution: {},
      performanceTrends: [],
      engagementTrends: [],
      attritionTrends: [],
      riskFactors: [],
      recommendations: []
    }
  }

  const totalEmployees = deptEmployees.length
  const avgEngagement = deptEmployees.reduce((sum, emp) => sum + emp.engagement, 0) / totalEmployees
  const avgPerformance = deptEmployees.reduce((sum, emp) => sum + emp.performance, 0) / totalEmployees
  const avgTenure = deptEmployees.reduce((sum, emp) => sum + emp.tenure, 0) / totalEmployees
  const avgSalary = deptEmployees.reduce((sum, emp) => sum + emp.salary, 0) / totalEmployees
  
  const highRiskEmployees = deptEmployees.filter(emp => emp.attritionRisk > 0.7).length
  const attritionRate = (highRiskEmployees / totalEmployees) * 100
  
  const promotionReadyEmployees = deptEmployees.filter(emp => emp.promotionReadiness > 0.7).length
  const promotionRate = (promotionReadyEmployees / totalEmployees) * 100

  // Skills distribution
  const skillsDistribution: { [key: string]: number } = {}
  deptEmployees.forEach(emp => {
    emp.skills.forEach(skill => {
      skillsDistribution[skill] = (skillsDistribution[skill] || 0) + 1
    })
  })

  // Role distribution
  const roleDistribution: { [key: string]: number } = {}
  deptEmployees.forEach(emp => {
    roleDistribution[emp.role] = (roleDistribution[emp.role] || 0) + 1
  })

  // Generate trends (simplified for demo)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const performanceTrends = months.map(month => ({
    month,
    performance: avgPerformance + (Math.random() - 0.5) * 0.1
  }))

  const engagementTrends = months.map(month => ({
    month,
    engagement: avgEngagement + (Math.random() - 0.5) * 0.1
  }))

  const attritionTrends = months.map(month => ({
    month,
    attrition: attritionRate + (Math.random() - 0.5) * 5
  }))

  // Risk factors and recommendations
  const riskFactors = []
  const recommendations = []

  if (avgEngagement < 0.6) {
    riskFactors.push('Low engagement levels')
    recommendations.push('Implement engagement initiatives and regular feedback sessions')
  }

  if (avgPerformance < 0.6) {
    riskFactors.push('Below average performance')
    recommendations.push('Provide additional training and performance coaching')
  }

  if (attritionRate > 20) {
    riskFactors.push('High attrition risk')
    recommendations.push('Conduct exit interviews and address retention issues')
  }

  return {
    department,
    totalEmployees,
    avgEngagement,
    avgPerformance,
    attritionRate,
    promotionRate,
    avgTenure,
    avgSalary,
    productivityScore: avgPerformance * 0.7 + avgEngagement * 0.3,
    collaborationScore: deptEmployees.reduce((sum, emp) => sum + emp.collaborationScore, 0) / totalEmployees,
    innovationScore: deptEmployees.reduce((sum, emp) => sum + emp.innovationScore, 0) / totalEmployees,
    leadershipScore: deptEmployees.reduce((sum, emp) => sum + emp.leadershipScore, 0) / totalEmployees,
    burnoutRisk: deptEmployees.reduce((sum, emp) => sum + emp.burnoutRisk, 0) / totalEmployees,
    retentionScore: deptEmployees.reduce((sum, emp) => sum + emp.retentionScore, 0) / totalEmployees,
    skillsDistribution,
    roleDistribution,
    performanceTrends,
    engagementTrends,
    attritionTrends,
    riskFactors,
    recommendations
  }
}

export const calculateOverallAnalytics = (employees: Employee[]): AnalyticsMetrics => {
  const totalEmployees = employees.length
  
  if (totalEmployees === 0) {
    return {
      totalEmployees: 0,
      departmentBreakdown: {},
      avgEngagement: 0,
      avgPerformance: 0,
      attritionRate: 0,
      promotionRate: 0,
      diversityIndex: 0,
      retentionRate: 0,
      highPerformers: 0,
      atRiskEmployees: 0,
      burnoutCases: 0,
      trainingInvestment: 0,
      productivityScore: 0,
      collaborationIndex: 0,
      innovationIndex: 0,
      leadershipPipeline: 0,
      skillsGaps: {},
      departmentHealth: {},
      predictiveInsights: {
        expectedAttrition: 0,
        promotionCandidates: 0,
        riskFactors: [],
        opportunities: []
      }
    }
  }

  const departmentBreakdown: { [key: string]: number } = {}
  employees.forEach(emp => {
    departmentBreakdown[emp.department] = (departmentBreakdown[emp.department] || 0) + 1
  })

  const avgEngagement = employees.reduce((sum, emp) => sum + emp.engagement, 0) / totalEmployees
  const avgPerformance = employees.reduce((sum, emp) => sum + emp.performance, 0) / totalEmployees
  
  const highPerformers = employees.filter(emp => emp.performance > 0.8).length
  const atRiskEmployees = employees.filter(emp => emp.attritionRisk > 0.7).length
  const burnoutCases = employees.filter(emp => emp.burnoutRisk > 0.7).length
  const promotionCandidates = employees.filter(emp => emp.promotionReadiness > 0.7).length

  const attritionRate = (atRiskEmployees / totalEmployees) * 100
  const promotionRate = (promotionCandidates / totalEmployees) * 100
  const retentionRate = 100 - attritionRate

  // Calculate diversity index (simplified)
  const genderDistribution = employees.reduce((acc, emp) => {
    acc[emp.diversityMetrics.gender] = (acc[emp.diversityMetrics.gender] || 0) + 1
    return acc
  }, {} as { [key: string]: number })
  
  const diversityIndex = 1 - Math.max(...Object.values(genderDistribution)) / totalEmployees

  return {
    totalEmployees,
    departmentBreakdown,
    avgEngagement,
    avgPerformance,
    attritionRate,
    promotionRate,
    diversityIndex,
    retentionRate,
    highPerformers,
    atRiskEmployees,
    burnoutCases,
    trainingInvestment: employees.reduce((sum, emp) => sum + emp.trainingHours, 0),
    productivityScore: avgPerformance * 0.7 + avgEngagement * 0.3,
    collaborationIndex: employees.reduce((sum, emp) => sum + emp.collaborationScore, 0) / totalEmployees,
    innovationIndex: employees.reduce((sum, emp) => sum + emp.innovationScore, 0) / totalEmployees,
    leadershipPipeline: employees.filter(emp => emp.leadershipScore > 0.7).length,
    skillsGaps: {},
    departmentHealth: Object.keys(departmentBreakdown).reduce((acc, dept) => {
      const deptAnalytics = calculateDepartmentAnalytics(employees, dept)
      acc[dept] = (deptAnalytics.avgEngagement + deptAnalytics.avgPerformance) / 2
      return acc
    }, {} as { [key: string]: number }),
    predictiveInsights: {
      expectedAttrition: Math.round(attritionRate * totalEmployees / 100),
      promotionCandidates,
      riskFactors: [
        ...(avgEngagement < 0.6 ? ['Low overall engagement'] : []),
        ...(attritionRate > 20 ? ['High attrition risk'] : []),
        ...(burnoutCases > totalEmployees * 0.1 ? ['Burnout concerns'] : [])
      ],
      opportunities: [
        ...(promotionCandidates > 0 ? ['Promotion opportunities available'] : []),
        ...(avgPerformance > 0.7 ? ['High performance culture'] : []),
        ...(diversityIndex > 0.4 ? ['Strong diversity metrics'] : [])
      ]
    }
  }
}