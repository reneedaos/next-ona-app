'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
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

const NetworkVisualization = () => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [nodes, setNodes] = useState<Node[]>([])
  const [links, setLinks] = useState<Link[]>([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)

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

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return

    const svg = d3.select(svgRef.current)
    const width = 800
    const height = 600

    svg.selectAll('*').remove()

    // Create force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(50))
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
      .data(links)
      .join('line')
      .attr('class', 'link')
      .style('stroke', '#00f3ff')
      .style('stroke-opacity', 0.6)
      .style('stroke-width', (d: any) => Math.sqrt(d.strength * 5))

    // Create nodes as person icons
    const nodeElements = container
      .selectAll('.node')
      .data(nodes)
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
      const baseSize = 8
      const size = baseSize + d.engagement * 6
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
      
      
      // Add a subtle glow effect
      group.append('circle')
        .attr('r', size * 0.9)
        .style('fill', 'none')
        .style('stroke', color)
        .style('stroke-width', 0.5)
        .style('opacity', 0.2)
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

  }, [nodes, links])

  return (
    <div className="cyber-card h-full">
      <div className="flex h-full">
        <div className="flex-1">
          <h2 className="text-2xl font-cyber text-neon-blue mb-4">
            Network Topology Scanner
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
          className="w-80 ml-6 cyber-card"
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
  )
}

export default NetworkVisualization