import { useState } from 'react'
import ReactFlow, { Node, Edge, Controls, Background } from 'reactflow'
import 'reactflow/dist/style.css'
import './App.css'

const convertGraphToNodesAndEdges = (graph: Record<string, string[]>) => {
  const nodes: Node[] = []
  const edges: Edge[] = []
  const nodePositions = new Map<string, { x: number, y: number }>()

  // First pass: create nodes with positions
  Object.keys(graph).forEach((nodeName, index) => {
    const x = (index % 3) * 250 + 50  // 3 nodes per row, 250px apart
    const y = Math.floor(index / 3) * 100 + 50  // 100px between rows
    nodePositions.set(nodeName, { x, y })
    nodes.push({
      id: nodeName,
      position: { x, y },
      data: { label: nodeName },
      className: 'group',
      style: { 
        background: 'rgba(15, 23, 42, 0.8)',
        color: '#00f0ff',
        border: '2px solid rgba(0, 240, 255, 0.3)',
        borderRadius: '8px',
        padding: '12px',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 0 15px rgba(0, 240, 255, 0.2), inset 0 0 10px rgba(0, 240, 255, 0.1)',
        transition: 'all 0.3s ease-in-out',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        letterSpacing: '0.5px',
        transform: 'translateZ(0)'
      }
    })
  })

  // Second pass: create edges
  Object.entries(graph).forEach(([source, targets]) => {
    targets.forEach((target) => {
      edges.push({
        id: `${source}-${target}`,
        source,
        target,
        style: { 
          stroke: '#00f0ff', // neon-cyan
          strokeWidth: 2,
          opacity: 0.6,
          filter: 'drop-shadow(0 0 8px rgba(0, 240, 255, 0.4))'
        },
        animated: true,
        type: 'smoothstep'
      })
    })
  })

  return { nodes, edges }
}

interface SystemData {
  name: string
  description: string
}

function App() {
  const [systemData, setSystemData] = useState<SystemData>({ name: '', description: '' })
  const [loading, setLoading] = useState(false)
  const [isDeploying, setIsDeploying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [graph, setGraph] = useState<Record<string, string[]> | null>(null)
  const [deployedUrl, setDeployedUrl] = useState<string | null>(null)

  const handleDeploy = async () => {
    setLoading(true)
    setIsDeploying(true)
    setError(null)
    try {
      const deployResponse = await fetch(`/api/implement_app/?${new URLSearchParams({
          app_name: systemData.name
        })}`, {
        method: 'POST',
        headers: {
          'accept': 'application/json'
        },
        body: ''
      })

      if (!deployResponse.ok) {
        throw new Error(await deployResponse.text())
      }

      const { url } = await deployResponse.json()
      setDeployedUrl(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setGraph(null)
    setDeployedUrl(null)

    try {
      const graphResponse = await fetch(`/api/create-app/?${new URLSearchParams({
          app_name: systemData.name,
          description: systemData.description
        })}`, {
        method: 'POST',
        headers: {
          'accept': 'application/json'
        },
        body: ''
      })

      if (!graphResponse.ok) {
        const errorText = await graphResponse.text()
        let errorMessage = errorText
        try {
          const errorJson = JSON.parse(errorText)
          if (errorJson.detail && errorJson.detail.includes("already exists")) {
            errorMessage = "An app with this name already exists. Please choose a different name."
          }
        } catch (e) {
          // If error text is not JSON, use it as is
        }
        throw new Error(errorMessage)
      }

      const graphData = await graphResponse.json()
      setGraph(graphData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
      setIsDeploying(false)
    }
  }

  if (isDeploying) {
    return (
      <div className="min-h-screen bg-deep-space text-zinc-50 p-8 cyber-grid">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 neon-text">AI System Assembly Line</h1>
          </header>
          <div className="loading-container holographic p-12 rounded-lg">
            <div className="text-center relative z-10">
              <div className="loading-spinner mx-auto mb-6"></div>
              <p className="text-xl mb-2 loading-text neon-text">Deploying Your System</p>
              <p className="text-neon-cyan opacity-70">Initializing deployment sequence...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-deep-space text-zinc-50 p-8 cyber-grid relative">
      <div className="absolute inset-0 bg-gradient-to-b from-deep-space/80 to-transparent opacity-50 pointer-events-none"></div>
      <div className="max-w-4xl mx-auto space-y-8 relative">
        <header className="text-center">
          <h1 className="text-4xl font-bold mb-2 neon-text">AI System Assembly Line</h1>
          <p className="text-zinc-400">Generate and deploy autonomous software systems</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4 holographic p-6 rounded-lg hover:glow-cyan transition-all duration-300">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium mb-1 text-neon-cyan">
              System Name
            </label>
            <input
              id="name"
              type="text"
              value={systemData.name}
              onChange={(e) => setSystemData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 bg-zinc-800/80 rounded border border-zinc-700/50 focus:outline-none focus:glow-cyan hover:glow-blue transition-all duration-300 holographic"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium mb-1 text-neon-cyan">
              User Story
            </label>
            <textarea
              id="description"
              value={systemData.description}
              onChange={(e) => setSystemData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 bg-zinc-800/80 rounded border border-zinc-700/50 focus:outline-none focus:glow-cyan hover:glow-blue transition-all duration-300 holographic min-h-[100px]"
              required
              placeholder="As a user, I want... so that..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-neon-blue hover:glow-blue disabled:opacity-50 disabled:cursor-not-allowed rounded font-medium transition-all duration-300 holographic"
          >
            {loading ? (
              <span className="inline-flex items-center justify-center space-x-2">
                <span className="loading-spinner w-5 h-5"></span>
                <span className="loading-text">Processing</span>
              </span>
            ) : (
              'Generate System'
            )}
          </button>
        </form>

        {error && (
          <div className="holographic border-red-500/50 p-4 rounded-lg text-red-200 glow-red animate-pulse-glow">
            <span className="inline-flex items-center">
              <span className="mr-2">⚠</span>
              {error}
            </span>
          </div>
        )}

        {graph && (
          <div className="holographic p-6 rounded-lg hover:glow-cyan transition-all duration-300">
            <h2 className="text-xl font-semibold mb-4 neon-text">System Dependency Graph</h2>
            <div style={{ height: '500px' }} className="rounded-lg overflow-hidden holographic">
              <ReactFlow
                {...convertGraphToNodesAndEdges(graph)}
                fitView
                className="bg-deep-space cyber-grid"
              >
                <Background />
                <Controls />
              </ReactFlow>
            </div>
            <button
              onClick={handleDeploy}
              disabled={loading}
              className="mt-4 bg-neon-blue hover:glow-blue text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {loading ? (
                <span className="inline-flex items-center">
                  <span className="animate-pulse-glow">Deploying</span>
                  <span className="animate-pulse">...</span>
                </span>
              ) : (
                'Deploy This App'
              )}
            </button>
          </div>
        )}

        {deployedUrl && (
          <div className="holographic p-6 rounded-lg hover:glow-cyan transition-all duration-300">
            <h2 className="text-xl font-semibold mb-4 neon-text">Deployment Status</h2>
            <p className="text-neon-cyan mb-2 flex items-center">
              <span className="mr-2">✓</span>
              <span className="animate-pulse-glow">System successfully deployed</span>
            </p>
            <a
              href={deployedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-neon-blue hover:glow-blue transition-all duration-300"
            >
              View Deployed System
              <span className="ml-1 animate-float">→</span>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
