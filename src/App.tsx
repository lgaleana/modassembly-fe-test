import { useState } from 'react'
import './App.css'

interface SystemData {
  name: string
  description: string
}

function App() {
  const [systemData, setSystemData] = useState<SystemData>({ name: '', description: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [graph, setGraph] = useState<Record<string, string[]> | null>(null)
  const [deployedUrl, setDeployedUrl] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setGraph(null)
    setDeployedUrl(null)

    try {
      // TODO: Replace with actual API endpoints
      const graphResponse = await fetch('/api/graph', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(systemData),
      })

      if (!graphResponse.ok) {
        const errorText = await graphResponse.text()
        throw new Error(errorText)
      }

      const graphData = await graphResponse.json()
      setGraph(graphData)

      const deployResponse = await fetch('/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: systemData.name }),
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
              System Description
            </label>
            <textarea
              id="description"
              value={systemData.description}
              onChange={(e) => setSystemData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              required
              placeholder="Describe what the system should do..."
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
            {/* TODO: Implement graph visualization */}
            <pre className="bg-zinc-800 p-4 rounded overflow-auto">
              {JSON.stringify(graph, null, 2)}
            </pre>
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
