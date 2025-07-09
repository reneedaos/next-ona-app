'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { ERGMSimulation, ERGMParameters, ERGMNode, ERGMEdge } from '@/lib/ergm-simulation';

interface NetworkParams {
  nodes: number;
  density: number;
  homophily: number;
  preferentialAttachment: number;
  clustering: number;
  growthMode?: boolean;
  growthRate?: number;
}

interface ThreeNetworkVisualizationProps {
  isSimulating: boolean;
  simulationSpeed: number;
  networkParams: NetworkParams;
  onReset?: () => void;
  onStatisticsUpdate?: (stats: any) => void;
  resetTrigger?: number;
}

const departments = [
  { name: 'Engineering', color: '#00f3ff' },
  { name: 'Marketing', color: '#bf00ff' },
  { name: 'Sales', color: '#39ff14' },
  { name: 'HR', color: '#ff6b35' },
  { name: 'Finance', color: '#ffd700' }
];

// Node component
function NetworkNode({ 
  node, 
  isSelected, 
  onClick,
  onPositionUpdate
}: { 
  node: ERGMNode; 
  isSelected: boolean; 
  onClick: () => void; 
  onPositionUpdate?: (nodeId: string, position: THREE.Vector3) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation - use absolute position instead of incremental
      const nodeId = parseInt(node.id.slice(1)) || 0;
      const baseY = node.position.y;
      const floatOffset = Math.sin(state.clock.elapsedTime * 2 + nodeId) * 0.1;
      const newPosition = new THREE.Vector3(node.position.x, baseY + floatOffset, node.position.z);
      meshRef.current.position.copy(newPosition);
      
      // Update the position for edge rendering
      if (onPositionUpdate) {
        onPositionUpdate(node.id, newPosition);
      }
      
      // Pulsing effect when selected
      if (isSelected) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.2;
        meshRef.current.scale.setScalar(scale);
      } else {
        meshRef.current.scale.setScalar(hovered ? 1.3 : 1);
      }
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
        }}
      >
        <sphereGeometry args={[node.size, 16, 16]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={isSelected ? 0.8 : hovered ? 0.4 : 0.2}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  );
}

// Edge component
function NetworkEdge({ 
  edge,
  sourcePos,
  targetPos
}: { 
  edge: ERGMEdge;
  sourcePos: THREE.Vector3;
  targetPos: THREE.Vector3;
}) {
  const lineRef = useRef<THREE.BufferGeometry>(null);
  
  useEffect(() => {
    if (lineRef.current) {
      const points = [sourcePos, targetPos];
      lineRef.current.setFromPoints(points);
    }
  }, [sourcePos, targetPos]);

  const getEdgeColor = (type: string) => {
    switch (type) {
      case 'formal': return '#00f3ff';
      case 'informal': return '#bf00ff';
      case 'collaborative': return '#39ff14';
      default: return '#00f3ff';
    }
  };

  return (
    <line>
      <bufferGeometry ref={lineRef} />
      <lineBasicMaterial
        color={getEdgeColor(edge.type)}
        transparent
        opacity={0.2 + edge.strength * 0.6}
        linewidth={edge.strength * 3}
      />
    </line>
  );
}

// Main network scene
function NetworkScene({ 
  isSimulating, 
  simulationSpeed, 
  networkParams,
  onStatisticsUpdate,
  resetTrigger
}: { 
  isSimulating: boolean; 
  simulationSpeed: number; 
  networkParams: NetworkParams;
  onStatisticsUpdate?: (stats: any) => void;
  resetTrigger?: number;
}) {
  const [simulation, setSimulation] = useState<ERGMSimulation | null>(null);
  const [nodes, setNodes] = useState<ERGMNode[]>([]);
  const [edges, setEdges] = useState<ERGMEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [nodePositions, setNodePositions] = useState<Map<string, THREE.Vector3>>(new Map());
  const { camera } = useThree();

  // Initialize network
  useEffect(() => {
    const ergmParams: ERGMParameters = {
      nodes: networkParams.nodes,
      density: networkParams.density,
      homophily: networkParams.homophily,
      preferentialAttachment: networkParams.preferentialAttachment,
      clustering: networkParams.clustering,
      transitivity: networkParams.clustering,
      reciprocity: 0.3,
      temporalDecay: 0.01,
      growthMode: networkParams.growthMode || false,
      growthRate: networkParams.growthRate || 0.5
    };
    
    const newSimulation = new ERGMSimulation(ergmParams);
    setSimulation(newSimulation);
    
    const state = newSimulation.getState();
    setNodes(state.nodes);
    setEdges(state.edges);
    
    if (onStatisticsUpdate) {
      onStatisticsUpdate(state.statistics);
    }
  }, [networkParams, onStatisticsUpdate]);

  // Handle reset
  useEffect(() => {
    if (simulation && resetTrigger !== undefined && resetTrigger > 0) {
      simulation.reset();
      const state = simulation.getState();
      setNodes([...state.nodes]);
      setEdges([...state.edges]);
      setNodePositions(new Map());
      
      if (onStatisticsUpdate) {
        onStatisticsUpdate(state.statistics);
      }
    }
  }, [resetTrigger, simulation, onStatisticsUpdate]);

  // Handle node position updates
  const handleNodePositionUpdate = (nodeId: string, position: THREE.Vector3) => {
    setNodePositions(prev => {
      const newMap = new Map(prev);
      newMap.set(nodeId, position.clone());
      return newMap;
    });
  };

  // Animation loop with throttling
  const lastUpdateRef = useRef(0);
  useFrame((state, delta) => {
    if (!isSimulating || !simulation) return;

    // Throttle updates based on simulation speed
    const updateInterval = 1 / Math.max(0.1, simulationSpeed * 10); // Convert speed to update frequency
    lastUpdateRef.current += delta;
    
    if (lastUpdateRef.current >= updateInterval) {
      const newState = simulation.step();
      setNodes([...newState.nodes]);
      setEdges([...newState.edges]);
      
      if (onStatisticsUpdate) {
        onStatisticsUpdate(newState.statistics);
      }
      
      lastUpdateRef.current = 0;
    }
  });

  return (
    <>
      {/* Nodes */}
      {nodes.map(node => (
        <NetworkNode
          key={node.id}
          node={node}
          isSelected={selectedNode === node.id}
          onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
          onPositionUpdate={handleNodePositionUpdate}
        />
      ))}

      {/* Edges */}
      {edges.map(edge => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);
        
        if (sourceNode && targetNode) {
          // Use actual rendered positions if available, otherwise fall back to simulation positions
          const sourcePos = nodePositions.get(edge.source) || sourceNode.position;
          const targetPos = nodePositions.get(edge.target) || targetNode.position;
          
          return (
            <NetworkEdge
              key={`${edge.source}-${edge.target}`}
              edge={edge}
              sourcePos={sourcePos}
              targetPos={targetPos}
            />
          );
        }
        return null;
      })}

      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.4} color="#bf00ff" />
    </>
  );
}

export default function ThreeNetworkVisualization({
  isSimulating,
  simulationSpeed,
  networkParams,
  onReset,
  onStatisticsUpdate,
  resetTrigger
}: ThreeNetworkVisualizationProps) {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        style={{ background: 'transparent' }}
        onCreated={({ gl }) => {
          gl.domElement.style.touchAction = 'none';
        }}
      >
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={50}
          zoomSpeed={0.5}
          panSpeed={0.5}
          rotateSpeed={0.5}
          enableDamping={true}
          dampingFactor={0.05}
          screenSpacePanning={false}
        />
        
        <NetworkScene
          isSimulating={isSimulating}
          simulationSpeed={simulationSpeed}
          networkParams={networkParams}
          onStatisticsUpdate={onStatisticsUpdate}
          resetTrigger={resetTrigger}
        />
        
        {/* Particle background */}
        <mesh position={[0, 0, -30]}>
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial
            color="#000011"
            transparent
            opacity={0.1}
          />
        </mesh>
      </Canvas>
    </div>
  );
}