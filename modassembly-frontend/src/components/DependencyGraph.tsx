import { useMemo } from 'react'
import { Group } from '@visx/group'
import { Graph } from '@visx/network'
import { LinearGradient } from '@visx/gradient'

interface NodeData {
  id: string
  name: string
  type: string
  is_endpoint: boolean
  x: number
  y: number
}

interface SimulationLink {
  source: string
  target: string
}

interface SimulationData {
  nodes: NodeData[]
  links: SimulationLink[]
}

interface DependencyGraphProps {
  width: number
  height: number
  architecture: Array<{
    type: string
    name: string
    purpose: string
    uses: string[]
    is_endpoint: boolean
  }>
}

export function DependencyGraph({ width, height, architecture }: DependencyGraphProps) {
  const nodesMap = useMemo(() => {
    const map = new Map<string, NodeData>()
    
    // Create nodes first
    architecture.forEach((item, index) => {
      const angle = (2 * Math.PI * index) / architecture.length
      const radius = Math.min(width, height) * 0.35 // Leave space for labels
      
      map.set(item.name, {
        id: item.name,
        x: width / 2 + radius * Math.cos(angle),
        y: height / 2 + radius * Math.sin(angle),
        name: item.name,
        type: item.type,
        is_endpoint: item.is_endpoint
      })
    })
    return map
  }, [width, height, architecture])

  const simulationData = useMemo<SimulationData>(() => {
    const nodes = Array.from(nodesMap.values())
    
    // Create links based on 'uses' relationships
    const links: SimulationLink[] = []
    architecture.forEach(item => {
      const sourceNode = nodesMap.get(item.name)
      if (sourceNode) {
        item.uses.forEach(targetName => {
          const targetNode = nodesMap.get(targetName)
          if (targetNode) {
            links.push({
              source: sourceNode.id,
              target: targetNode.id
            })
          }
        })
      }
    })

    return {
      nodes,
      links
    }
  }, [nodesMap, architecture])

  return (
    <svg width={width} height={height}>
      <LinearGradient
        id="node-gradient"
        from="#1a1a1a"
        to="#333333"
        vertical={false}
      />
      <LinearGradient
        id="link-gradient"
        from="rgba(255,255,255,0.2)"
        to="rgba(255,255,255,0.1)"
      />
      <rect
        width={width}
        height={height}
        fill="black"
        rx={14}
      />
      <Graph
        graph={simulationData}
        linkComponent={({ link }: { link: SimulationLink }) => {
          const sourceNode = nodesMap.get(link.source)
          const targetNode = nodesMap.get(link.target)
          if (!sourceNode || !targetNode) return null
          return (
            <line
              x1={sourceNode.x}
              y1={sourceNode.y}
              x2={targetNode.x}
              y2={targetNode.y}
              stroke="url(#link-gradient)"
              strokeWidth={1.5}
            />
          )
        }}
        nodeComponent={({ node }: { node: NodeData }) => (
          <Group>
            <circle
              cx={node.x}
              cy={node.y}
              r={node.is_endpoint ? 24 : 20}
              fill="url(#node-gradient)"
              stroke={node.is_endpoint ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)"}
              strokeWidth={1.5}
            />
            <text
              x={node.x}
              y={node.y + 30}
              textAnchor="middle"
              fill="white"
              fontSize={12}
              fontFamily="monospace"
            >
              {node.name}
            </text>
          </Group>
        )}
      />
    </svg>
  )
}
