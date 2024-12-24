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
        background: '#ffffff',
        color: '#374151',
        border: '1px solid #e5e7eb',
        borderRadius: '6px',
        padding: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500'
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
          stroke: '#59D78F',
          strokeWidth: 1.5,
          opacity: 0.8
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
      <div className="min-h-screen bg-gradient-to-b from-deep-blue-start to-deep-blue-end text-white p-8 relative">
        <div className="absolute inset-0 bg-orbit-pattern opacity-10" />
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">AI System Assembly</h1>
          </header>
          <div className="bg-white/5 backdrop-blur-sm p-12 rounded-lg shadow-lg border border-white/10">
            <div className="text-center relative z-10">
              <div className="loading-spinner mx-auto mb-6"></div>
              <p className="text-xl mb-2">Deploying Your System</p>
              <p className="text-gray-300">Please wait while we set up your environment...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-deep-blue-start to-deep-blue-end text-white p-8 relative">
      <div className="absolute inset-0 bg-orbit-pattern opacity-10" />
      <div className="max-w-4xl mx-auto space-y-8 relative">
        <header className="text-center">
          <h1 className="text-4xl font-bold mb-2">AI System Assembly</h1>
          <p className="text-gray-300">Next Generation Data Aggregation</p>
        </header>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-700">
                System Name
              </label>
              <input
                id="name"
                type="text"
                value={systemData.name}
                onChange={(e) => setSystemData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-accent focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1 text-gray-700">
                User Story
              </label>
              <textarea
                id="description"
                value={systemData.description}
                onChange={(e) => setSystemData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-accent focus:border-transparent transition-all min-h-[100px]"
                required
                placeholder="As a user, I want... so that..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-accent text-white py-2 px-4 rounded-md font-medium hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <span className="inline-flex items-center justify-center space-x-2">
                  <span className="loading-spinner w-5 h-5"></span>
                  <span>Processing</span>
                </span>
              ) : (
                'Generate System'
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">⚠</div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {graph && (
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">System Dependency Graph</h2>
            <div style={{ height: '500px' }} className="rounded-lg overflow-hidden border border-gray-200">
              <ReactFlow
                {...convertGraphToNodesAndEdges(graph)}
                fitView
                className="bg-gray-50"
              >
                <Background color="#f3f4f6" />
                <Controls />
              </ReactFlow>
            </div>
            <button
              onClick={handleDeploy}
              disabled={loading}
              className="mt-4 bg-green-accent text-white px-6 py-2 rounded-md font-medium hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <span className="inline-flex items-center space-x-2">
                  <span className="loading-spinner w-5 h-5"></span>
                  <span>Deploying</span>
                </span>
              ) : (
                'Deploy This App'
              )}
            </button>
          </div>
        )}

        {deployedUrl && (
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Deployment Status</h2>
            <p className="text-green-600 mb-2 flex items-center">
              <span className="mr-2">✓</span>
              System successfully deployed
            </p>
            <a
              href={deployedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-green-accent hover:text-opacity-80 transition-all"
            >
              View Deployed System
              <span className="ml-1">→</span>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
