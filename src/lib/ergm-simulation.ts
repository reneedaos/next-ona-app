import * as THREE from 'three';

export interface ERGMNode {
  id: string;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  attributes: {
    department: string;
    seniority: number;
    skills: string[];
    performance: number;
  };
  connections: string[];
  degree: number;
  color: string;
  size: number;
}

export interface ERGMEdge {
  source: string;
  target: string;
  weight: number;
  type: 'formal' | 'informal' | 'collaborative';
  strength: number;
  age: number; // Time since edge was created
}

export interface ERGMParameters {
  nodes: number;
  density: number;
  homophily: number;
  preferentialAttachment: number;
  clustering: number;
  transitivity: number;
  reciprocity: number;
  temporalDecay: number;
  growthMode: boolean;
  growthRate: number;
}

export interface SimulationState {
  nodes: ERGMNode[];
  edges: ERGMEdge[];
  time: number;
  statistics: NetworkStatistics;
}

export interface NetworkStatistics {
  nodeCount: number;
  edgeCount: number;
  density: number;
  averageDegree: number;
  clusteringCoefficient: number;
  assortativity: number;
  transitivity: number;
  reciprocity: number;
  departmentHomophily: number;
  degreeDistribution: { [key: number]: number };
}

const departments = [
  { name: 'Engineering', color: '#00f3ff', skills: ['Programming', 'Architecture', 'DevOps'] },
  { name: 'Marketing', color: '#bf00ff', skills: ['Analytics', 'Content', 'SEO'] },
  { name: 'Sales', color: '#39ff14', skills: ['Negotiation', 'CRM', 'Presentations'] },
  { name: 'HR', color: '#ff6b35', skills: ['Recruiting', 'Training', 'Compliance'] },
  { name: 'Finance', color: '#ffd700', skills: ['Accounting', 'Analysis', 'Reporting'] }
];

export class ERGMSimulation {
  private state: SimulationState;
  private parameters: ERGMParameters;
  private timeStep: number = 0.1;
  private targetNodes: number;
  private nextNodeId: number = 0;

  constructor(parameters: ERGMParameters) {
    this.parameters = parameters;
    this.targetNodes = parameters.nodes;
    this.state = this.initializeNetwork();
  }

  private initializeNetwork(): SimulationState {
    const nodes: ERGMNode[] = [];
    const edges: ERGMEdge[] = [];

    // Reset node counter
    this.nextNodeId = 0;

    // Create nodes based on growth mode
    const initialNodes = this.parameters.growthMode ? 0 : this.parameters.nodes;
    
    for (let i = 0; i < initialNodes; i++) {
      nodes.push(this.createNode());
    }

    // Create initial edges using ERGM principles
    if (nodes.length > 1) {
      this.createInitialEdges(nodes, edges);
    }

    const statistics = this.calculateStatistics(nodes, edges);

    return {
      nodes,
      edges,
      time: 0,
      statistics
    };
  }

  private createNode(): ERGMNode {
    const department = departments[Math.floor(Math.random() * departments.length)];
    const node: ERGMNode = {
      id: `N${this.nextNodeId++}`,
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 25
      ),
      velocity: new THREE.Vector3(0, 0, 0),
      attributes: {
        department: department.name,
        seniority: Math.random() * 10,
        skills: this.selectRandomSkills(department.skills),
        performance: 0.5 + Math.random() * 0.5
      },
      connections: [],
      degree: 0,
      color: department.color,
      size: 0.2 + Math.random() * 0.3
    };
    return node;
  }

  private selectRandomSkills(availableSkills: string[]): string[] {
    const numSkills = Math.floor(Math.random() * availableSkills.length) + 1;
    return availableSkills.slice(0, numSkills);
  }

  private createInitialEdges(nodes: ERGMNode[], edges: ERGMEdge[]): void {
    const targetEdges = Math.floor(this.parameters.nodes * this.parameters.density * this.parameters.nodes / 2);
    
    for (let attempt = 0; attempt < targetEdges * 3; attempt++) {
      const sourceIdx = Math.floor(Math.random() * nodes.length);
      let targetIdx = Math.floor(Math.random() * nodes.length);
      
      if (targetIdx === sourceIdx) continue;
      
      const source = nodes[sourceIdx];
      const target = nodes[targetIdx];
      
      // Check if edge already exists
      const edgeExists = edges.some(e => 
        (e.source === source.id && e.target === target.id) ||
        (e.source === target.id && e.target === source.id)
      );
      
      if (edgeExists) continue;
      
      // Calculate edge probability based on ERGM parameters
      const edgeProbability = this.calculateEdgeProbability(source, target, nodes, edges);
      
      if (Math.random() < edgeProbability) {
        const edge: ERGMEdge = {
          source: source.id,
          target: target.id,
          weight: 0.5 + Math.random() * 0.5,
          type: this.selectEdgeType(source, target),
          strength: 0.3 + Math.random() * 0.7,
          age: 0
        };
        
        edges.push(edge);
        source.connections.push(target.id);
        target.connections.push(source.id);
        source.degree++;
        target.degree++;
      }
    }
  }

  private calculateEdgeProbability(
    source: ERGMNode, 
    target: ERGMNode, 
    nodes: ERGMNode[], 
    edges: ERGMEdge[]
  ): number {
    let probability = this.parameters.density;
    
    // Homophily effect (same department)
    if (source.attributes.department === target.attributes.department) {
      probability *= (1 + this.parameters.homophily);
    }
    
    // Preferential attachment (high degree nodes more likely to connect)
    const degreeEffect = (source.degree + target.degree) / (nodes.length * 2);
    probability *= (1 + this.parameters.preferentialAttachment * degreeEffect);
    
    // Clustering effect (mutual connections)
    const mutualConnections = this.getMutualConnections(source, target);
    if (mutualConnections > 0) {
      probability *= (1 + this.parameters.clustering * mutualConnections / 10);
    }
    
    // Skill similarity
    const skillSimilarity = this.calculateSkillSimilarity(source, target);
    probability *= (1 + skillSimilarity * 0.3);
    
    return Math.min(probability, 1);
  }

  private getMutualConnections(source: ERGMNode, target: ERGMNode): number {
    return source.connections.filter(conn => target.connections.includes(conn)).length;
  }

  private calculateSkillSimilarity(source: ERGMNode, target: ERGMNode): number {
    const sourceSkills = new Set(source.attributes.skills);
    const targetSkills = new Set(target.attributes.skills);
    const intersection = new Set(Array.from(sourceSkills).filter(skill => targetSkills.has(skill)));
    const union = new Set([...Array.from(sourceSkills), ...Array.from(targetSkills)]);
    
    return intersection.size / union.size;
  }

  private selectEdgeType(source: ERGMNode, target: ERGMNode): 'formal' | 'informal' | 'collaborative' {
    if (source.attributes.department === target.attributes.department) {
      return Math.random() < 0.4 ? 'formal' : 'collaborative';
    }
    return Math.random() < 0.3 ? 'formal' : 'informal';
  }

  public step(): SimulationState {
    this.state.time += this.timeStep;
    
    // Handle node growth if in growth mode
    if (this.parameters.growthMode && this.state.nodes.length < this.targetNodes) {
      this.handleNodeGrowth();
    }
    
    // Update node positions using force-directed layout
    this.updateNodePositions();
    
    // Evolve network structure
    this.evolveNetwork();
    
    // Age existing edges
    this.state.edges.forEach(edge => {
      edge.age += this.timeStep;
      // Apply temporal decay
      edge.strength *= (1 - this.parameters.temporalDecay * this.timeStep);
    });
    
    // Remove weak edges
    this.state.edges = this.state.edges.filter(edge => edge.strength > 0.1);
    
    // Update node connections and degrees
    this.updateNodeConnections();
    
    // Recalculate statistics
    this.state.statistics = this.calculateStatistics(this.state.nodes, this.state.edges);
    
    return { ...this.state };
  }

  private handleNodeGrowth(): void {
    // Add nodes based on growth rate
    const growthProbability = this.parameters.growthRate * this.timeStep;
    
    if (Math.random() < growthProbability) {
      const newNode = this.createNode();
      this.state.nodes.push(newNode);
      
      // New nodes may connect to existing nodes based on preferential attachment
      this.connectNewNode(newNode);
    }
  }

  private connectNewNode(newNode: ERGMNode): void {
    // Connect new node to existing nodes with probability based on their degree (preferential attachment)
    this.state.nodes.forEach(existingNode => {
      if (existingNode.id !== newNode.id) {
        const connectionProbability = this.calculateEdgeProbability(newNode, existingNode, this.state.nodes, this.state.edges);
        
        if (Math.random() < connectionProbability) {
          const edge: ERGMEdge = {
            source: newNode.id,
            target: existingNode.id,
            weight: 0.5 + Math.random() * 0.5,
            type: this.selectEdgeType(newNode, existingNode),
            strength: 0.3 + Math.random() * 0.7,
            age: 0
          };
          
          this.state.edges.push(edge);
        }
      }
    });
  }

  private updateNodePositions(): void {
    const repulsionStrength = 0.5;
    const attractionStrength = 0.1;
    const damping = 0.95;
    
    this.state.nodes.forEach(node => {
      const force = new THREE.Vector3(0, 0, 0);
      
      // Repulsion from all other nodes
      this.state.nodes.forEach(other => {
        if (other.id !== node.id) {
          const distance = node.position.distanceTo(other.position);
          if (distance > 0 && distance < 8) {
            const repulsion = node.position.clone()
              .sub(other.position)
              .normalize()
              .multiplyScalar(repulsionStrength / (distance * distance));
            force.add(repulsion);
          }
        }
      });
      
      // Attraction to connected nodes
      node.connections.forEach(connectionId => {
        const connectedNode = this.state.nodes.find(n => n.id === connectionId);
        if (connectedNode) {
          const distance = node.position.distanceTo(connectedNode.position);
          const edge = this.state.edges.find(e => 
            (e.source === node.id && e.target === connectionId) ||
            (e.source === connectionId && e.target === node.id)
          );
          const edgeStrength = edge ? edge.strength : 0.5;
          
          if (distance > 2) {
            const attraction = connectedNode.position.clone()
              .sub(node.position)
              .normalize()
              .multiplyScalar(attractionStrength * edgeStrength);
            force.add(attraction);
          }
        }
      });
      
      // Center attraction (weak)
      const centerAttraction = node.position.clone().multiplyScalar(-0.02);
      force.add(centerAttraction);
      
      // Update velocity and position
      node.velocity.add(force.multiplyScalar(this.timeStep));
      node.velocity.multiplyScalar(damping);
      node.position.add(node.velocity.clone().multiplyScalar(this.timeStep));
    });
  }

  private evolveNetwork(): void {
    // Probability of network change per time step
    const changeRate = 0.02;
    
    if (Math.random() < changeRate) {
      if (Math.random() < 0.6) {
        // Add new edge
        this.addRandomEdge();
      } else {
        // Remove existing edge
        this.removeRandomEdge();
      }
    }
  }

  private addRandomEdge(): void {
    if (this.state.nodes.length < 2) return;
    
    const sourceIdx = Math.floor(Math.random() * this.state.nodes.length);
    let targetIdx = Math.floor(Math.random() * this.state.nodes.length);
    
    while (targetIdx === sourceIdx) {
      targetIdx = Math.floor(Math.random() * this.state.nodes.length);
    }
    
    const source = this.state.nodes[sourceIdx];
    const target = this.state.nodes[targetIdx];
    
    // Check if edge already exists
    const edgeExists = this.state.edges.some(e => 
      (e.source === source.id && e.target === target.id) ||
      (e.source === target.id && e.target === source.id)
    );
    
    if (!edgeExists) {
      const edgeProbability = this.calculateEdgeProbability(source, target, this.state.nodes, this.state.edges);
      
      if (Math.random() < edgeProbability) {
        const edge: ERGMEdge = {
          source: source.id,
          target: target.id,
          weight: 0.5 + Math.random() * 0.5,
          type: this.selectEdgeType(source, target),
          strength: 0.3 + Math.random() * 0.7,
          age: 0
        };
        
        this.state.edges.push(edge);
      }
    }
  }

  private removeRandomEdge(): void {
    if (this.state.edges.length === 0) return;
    
    const edgeIdx = Math.floor(Math.random() * this.state.edges.length);
    this.state.edges.splice(edgeIdx, 1);
  }

  private updateNodeConnections(): void {
    // Reset connections and degrees
    this.state.nodes.forEach(node => {
      node.connections = [];
      node.degree = 0;
    });
    
    // Rebuild connections from current edges
    this.state.edges.forEach(edge => {
      const source = this.state.nodes.find(n => n.id === edge.source);
      const target = this.state.nodes.find(n => n.id === edge.target);
      
      if (source && target) {
        source.connections.push(target.id);
        target.connections.push(source.id);
        source.degree++;
        target.degree++;
      }
    });
  }

  private calculateStatistics(nodes: ERGMNode[], edges: ERGMEdge[]): NetworkStatistics {
    const nodeCount = nodes.length;
    const edgeCount = edges.length;
    const maxPossibleEdges = nodeCount * (nodeCount - 1) / 2;
    const density = maxPossibleEdges > 0 ? edgeCount / maxPossibleEdges : 0;
    const averageDegree = nodeCount > 0 ? (edgeCount * 2) / nodeCount : 0;
    
    // Calculate clustering coefficient
    let totalClustering = 0;
    let nodesWithDegreeGT1 = 0;
    
    nodes.forEach(node => {
      if (node.degree > 1) {
        const neighbors = node.connections;
        let triangles = 0;
        
        for (let i = 0; i < neighbors.length; i++) {
          for (let j = i + 1; j < neighbors.length; j++) {
            const edgeExists = edges.some(e => 
              (e.source === neighbors[i] && e.target === neighbors[j]) ||
              (e.source === neighbors[j] && e.target === neighbors[i])
            );
            if (edgeExists) triangles++;
          }
        }
        
        const maxTriangles = neighbors.length * (neighbors.length - 1) / 2;
        totalClustering += maxTriangles > 0 ? triangles / maxTriangles : 0;
        nodesWithDegreeGT1++;
      }
    });
    
    const clusteringCoefficient = nodesWithDegreeGT1 > 0 ? totalClustering / nodesWithDegreeGT1 : 0;
    
    // Calculate department homophily
    let sameDepEdges = 0;
    edges.forEach(edge => {
      const source = nodes.find(n => n.id === edge.source);
      const target = nodes.find(n => n.id === edge.target);
      if (source && target && source.attributes.department === target.attributes.department) {
        sameDepEdges++;
      }
    });
    
    const departmentHomophily = edgeCount > 0 ? sameDepEdges / edgeCount : 0;
    
    // Calculate degree distribution
    const degreeDistribution: { [key: number]: number } = {};
    nodes.forEach(node => {
      degreeDistribution[node.degree] = (degreeDistribution[node.degree] || 0) + 1;
    });
    
    return {
      nodeCount,
      edgeCount,
      density,
      averageDegree,
      clusteringCoefficient,
      assortativity: 0, // TODO: Implement assortativity calculation
      transitivity: clusteringCoefficient,
      reciprocity: 0, // TODO: Implement reciprocity calculation
      departmentHomophily,
      degreeDistribution
    };
  }

  public getState(): SimulationState {
    return { ...this.state };
  }

  public updateParameters(newParams: ERGMParameters): void {
    this.parameters = { ...newParams };
  }

  public reset(): void {
    this.nextNodeId = 0;
    this.state = this.initializeNetwork();
  }
}