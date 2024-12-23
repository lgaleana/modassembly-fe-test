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
      style: { 
        background: '#334155',
        color: '#fff',
        border: '1px solid #475569',
        borderRadius: '8px',
        padding: '10px'
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
        style: { stroke: '#475569' },
        animated: true
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
        method: 'POST'
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
        method: 'POST'
      })

      if (!graphResponse.ok) {
        const errorText = await graphResponse.text()
        throw new Error(errorText)
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
      <div className="min-h-screen bg-zinc-950 text-zinc-50 p-8">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">AI System Assembly Line</h1>
          </header>
          <div className="flex items-center justify-center p-12 bg-zinc-900 rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500 mx-auto mb-6"></div>
              <p className="text-xl mb-2">Deploying Your System</p>
              <p className="text-zinc-400">This may take a few moments...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold mb-2">AI System Assembly Line</h1>
          <p className="text-zinc-400">Generate and deploy autonomous software systems</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4 bg-zinc-900 p-6 rounded-lg">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              System Name
            </label>
            <input
              id="name"
              type="text"
              value={systemData.name}
              onChange={(e) => setSystemData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              User Story
            </label>
            <textarea
              id="description"
              value={systemData.description}
              onChange={(e) => setSystemData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              required
              placeholder="As a user, I want... so that..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed rounded font-medium transition-colors"
          >
            {loading ? 'Processing...' : 'Generate & Deploy System'}
          </button>
        </form>

        {error && (
          <div className="bg-red-900/50 border border-red-700 p-4 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {graph && (
          <div className="bg-zinc-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">System Dependency Graph</h2>
            <div style={{ height: '500px', background: '#18181b' }} className="rounded-lg">
              <ReactFlow
                {...convertGraphToNodesAndEdges(graph)}
                fitView
                className="bg-zinc-900"
              >
                <Background />
                <Controls />
              </ReactFlow>
            </div>
            <button
              onClick={handleDeploy}
              disabled={loading}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Deploying...' : 'Deploy This App'}
            </button>
          </div>
        )}

        {deployedUrl && (
          <div className="bg-zinc-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Deployment Status</h2>
            <p className="text-green-400 mb-2">✓ System successfully deployed</p>
            <a
              href={deployedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              View Deployed System →
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
