'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, ChevronDown, ChevronUp } from 'lucide-react'
import * as d3 from 'd3'

interface Node {
  id: string
  name: string
  department: string
  role: string
  engagement: number
  x?: number
  y?: number
  fx?: number
  fy?: number
}

interface Link {
  source: string | Node
  target: string | Node
  strength: number
}

interface FilterState {
  department: string
  role: string
  engagementRange: [number, number]
}

const NetworkVisualization = () => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [nodes, setNodes] = useState<Node[]>([])
  const [links, setLinks] = useState<Link[]>([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    department: 'All',
    role: 'All',
    engagementRange: [0, 1]
  })

  // Generate sample data
  useEffect(() => {
    const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance']
    const roles = ['Manager', 'Senior', 'Mid-level', 'Junior', 'Executive']
    
    const sampleNodes: Node[] = Array.from({ length: 50 }, (_, i) => ({
      id: `node-${i}`,
      name: `Employee ${i + 1}`,
      department: departments[Math.floor(Math.random() * departments.length)],
      role: roles[Math.floor(Math.random() * roles.length)],
      engagement: Math.random(),
    }))

    const sampleLinks: Link[] = []
    for (let i = 0; i < 80; i++) {
      const source = sampleNodes[Math.floor(Math.random() * sampleNodes.length)]
      const target = sampleNodes[Math.floor(Math.random() * sampleNodes.length)]
      if (source.id !== target.id) {
        sampleLinks.push({
          source: source.id,
          target: target.id,
          strength: Math.random(),
        })
      }
    }

    setNodes(sampleNodes)
    setLinks(sampleLinks)
  }, [])

  // Filter nodes based on current filters
  const filteredNodes = useMemo(() => {
    return nodes.filter(node => {
      return (
        (filters.department === 'All' || node.department === filters.department) &&
        (filters.role === 'All' || node.role === filters.role) &&
        node.engagement >= filters.engagementRange[0] &&
        node.engagement <= filters.engagementRange[1]
      )
    })
  }, [nodes, filters])

  // Filter links to only include connections between visible nodes
  const filteredLinks = useMemo(() => {
    const visibleNodeIds = new Set(filteredNodes.map(node => node.id))
    return links.filter(link => {
      const sourceId = typeof link.source === 'string' ? link.source : link.source.id
      const targetId = typeof link.target === 'string' ? link.target : link.target.id
      return visibleNodeIds.has(sourceId) && visibleNodeIds.has(targetId)
    })
  }, [filteredNodes, links])

  useEffect(() => {
    if (!svgRef.current || filteredNodes.length === 0) return

    const svg = d3.select(svgRef.current)
    const width = 800
    const height = 600

    svg.selectAll('*').remove()

    // Create force simulation
    const simulation = d3.forceSimulation(filteredNodes)
      .force('link', d3.forceLink(filteredLinks).id((d: any) => d.id).distance(50))
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2))

    // Create container group
    const container = svg.append('g')

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        container.attr('transform', event.transform)
      })

    svg.call(zoom as any)

    // Create links
    const linkElements = container
      .selectAll('.link')
      .data(filteredLinks)
      .join('line')
      .attr('class', 'link')
      .style('stroke', '#00f3ff')
      .style('stroke-opacity', 0.6)
      .style('stroke-width', (d: any) => Math.sqrt(d.strength * 5))

    // Create nodes as person icons
    const nodeElements = container
      .selectAll('.node')
      .data(filteredNodes)
      .join('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        setSelectedNode(d)
      })
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .style('filter', 'drop-shadow(0px 0px 10px #00f3ff)')
        
        // Scale the inner content, not the group
        d3.select(this).selectAll('path, circle')
          .transition()
          .duration(200)
          .attr('transform', `scale(${1.3})`)
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .style('filter', 'none')
        
        // Reset the inner content scale
        d3.select(this).selectAll('path, circle')
          .transition()
          .duration(200)
          .attr('transform', 'scale(1)')
      })

    // Add person icon SVG to each node
    nodeElements.each(function(d) {
      const group = d3.select(this)
      const baseSize = 12
      const size = baseSize + d.engagement * 8
      const dept = d.department
      const colors: { [key: string]: string } = {
        'Engineering': '#00f3ff',
        'Sales': '#bf00ff',
        'Marketing': '#39ff14',
        'HR': '#ff6b35',
        'Finance': '#ffd700'
      }
      const color = colors[dept] || '#ffffff'
      
      // Geometric/minimal person icon - separate circle head and rectangular body
      const headRadius = size * 0.25
      const bodyWidth = size * 0.4
      const bodyHeight = size * 0.4
      
      // Head (circle)
      group.append('circle')
        .attr('cx', 0)
        .attr('cy', -size/2 + headRadius)
        .attr('r', headRadius)
        .style('fill', color)
        .style('stroke', '#ffffff')
        .style('stroke-width', 1)
        .style('opacity', 0.9)
      
      // Body (rectangle)
      group.append('rect')
        .attr('x', -bodyWidth/2)
        .attr('y', -size/6)
        .attr('width', bodyWidth)
        .attr('height', bodyHeight)
        .style('fill', color)
        .style('stroke', '#ffffff')
        .style('stroke-width', 1)
        .style('opacity', 0.9)
      
    })

    // Add drag behavior
    const drag = d3.drag()
      .on('start', (event, d: any) => {
        if (!event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
      })
      .on('drag', (event, d: any) => {
        d.fx = event.x
        d.fy = event.y
      })
      .on('end', (event, d: any) => {
        if (!event.active) simulation.alphaTarget(0)
        d.fx = null
        d.fy = null
      })

    nodeElements.call(drag as any)

    // Update positions on simulation tick
    simulation.on('tick', () => {
      linkElements
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)

      nodeElements
        .attr('transform', (d: any) => `translate(${d.x}, ${d.y})`)
    })

  }, [filteredNodes, filteredLinks])

  const FilterPanel = () => (
    <motion.div 
      className="cyber-card mb-4"
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
          onClick={() => setShowFilters(!showFilters)}
          className="text-neon-green hover:text-neon-blue transition-colors"
        >
          {showFilters ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div>
                <label className="block text-sm font-cyber text-gray-300 mb-2">Department</label>
                <select
                  value={filters.department}
                  onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full bg-gray-800 border border-neon-blue/30 rounded px-3 py-2 text-white focus:border-neon-blue focus:outline-none"
                >
                  <option value="All">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
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
                <label className="block text-sm font-cyber text-gray-300 mb-2">
                  Engagement Range: {Math.round(filters.engagementRange[0] * 100)}% - {Math.round(filters.engagementRange[1] * 100)}%
                </label>
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
                    className="flex-1 h-2 bg-cyber-gray rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={filters.engagementRange[1]}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      engagementRange: [prev.engagementRange[0], parseFloat(e.target.value)]
                    }))}
                    className="flex-1 h-2 bg-cyber-gray rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )

  return (
    <div className="flex flex-col min-h-full">
      <FilterPanel />
      <div className="cyber-card flex-1">
        <div className="flex flex-col lg:flex-row gap-6 h-full">
          <div className="flex-1">
            <h2 className="text-2xl font-cyber text-neon-blue mb-4">
              Network Topology Scanner ({filteredNodes.length} nodes)
            </h2>
            <div className="border border-neon-blue/30 rounded-lg overflow-hidden">
              <svg
                ref={svgRef}
                width="800"
                height="600"
                className="bg-black/50"
              />
            </div>
          </div>
          
          {/* Node Info Panel */}
          <motion.div 
            className="w-full lg:w-80 cyber-card"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
          >
          <h3 className="text-xl font-cyber text-neon-green mb-4">
            Node Analysis
          </h3>
          {selectedNode ? (
            <div className="space-y-4">
              <div className="glass-effect p-4 rounded">
                <h4 className="font-cyber text-lg text-neon-blue">{selectedNode.name}</h4>
                <p className="text-gray-300">ID: {selectedNode.id}</p>
              </div>
              <div className="glass-effect p-4 rounded">
                <p><span className="text-neon-purple">Department:</span> {selectedNode.department}</p>
                <p><span className="text-neon-purple">Role:</span> {selectedNode.role}</p>
                <p><span className="text-neon-purple">Engagement:</span> {(selectedNode.engagement * 100).toFixed(1)}%</p>
              </div>
              <div className="glass-effect p-4 rounded">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-neon-blue to-neon-green h-2 rounded-full transition-all duration-500"
                    style={{ width: `${selectedNode.engagement * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Engagement Level</p>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 mt-8">
              <p className="font-matrix">Click on a node to analyze</p>
              <div className="animate-pulse text-neon-blue mt-4">⚡</div>
            </div>
          )}
        </motion.div>
      </div>
      </div>
    </div>
  )
}

export default NetworkVisualization