import { useState } from 'react'
import ReactFlow, { Node, Edge, Controls, Background, BackgroundVariant, MarkerType } from 'reactflow'
import 'reactflow/dist/style.css'
import './App.css'

const convertGraphToNodesAndEdges = (graph: Record<string, string[]>) => {
  const nodes: Node[] = []
  const edges: Edge[] = []
  const nodePositions = new Map<string, { x: number, y: number }>()

  // Calculate layout dimensions
  const nodesPerRow = 3
  const horizontalSpacing = 280  // Increased spacing between nodes
  const verticalSpacing = 120    // Increased spacing between rows
  const startX = 50
  const startY = 50

  // First pass: create nodes with positions
  Object.keys(graph).forEach((nodeName, index) => {
    const row = Math.floor(index / nodesPerRow)
    const col = index % nodesPerRow
    const x = startX + (col * horizontalSpacing)
    const y = startY + (row * verticalSpacing)
    
    nodePositions.set(nodeName, { x, y })
    nodes.push({
      id: nodeName,
      position: { x, y },
      data: { label: nodeName },
      style: { 
        background: '#ffffff',
        color: '#1f2937',  // Darker text for better contrast
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        minWidth: '150px',  // Ensure consistent node width
        textAlign: 'center' as const
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
          strokeWidth: 2,
          opacity: 0.7
        },
        animated: false,  // Remove animation for cleaner look
        type: 'smoothstep',
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#59D78F',
          width: 20,
          height: 20
        }
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
            <h1 className="text-4xl font-bold mb-2">Modular Assembly</h1>
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-deep-blue-start to-deep-blue-end text-white p-8 relative">
        <div className="absolute inset-0 bg-orbit-pattern opacity-10" />
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Modular Assembly</h1>
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
          <h1 className="text-4xl font-bold mb-2">Modular Assembly</h1>
          <p className="text-gray-300">AI-native E2E software platform</p>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-accent focus:border-transparent transition-all text-gray-900"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-accent focus:border-transparent transition-all min-h-[100px] text-gray-900"
                required
                placeholder="The user should..."
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
                className="bg-white"
                defaultEdgeOptions={{
                  type: 'smoothstep',
                  animated: false
                }}
                nodesDraggable={false}
                nodesConnectable={false}
                zoomOnScroll={false}
              >
                <Background 
                  color="#e5e7eb"
                  variant={BackgroundVariant.Dots}
                  gap={16}
                  size={1}
                />
                <Controls  
                  className="bg-white shadow-lg border border-gray-200"
                  showInteractive={false}
                />
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
