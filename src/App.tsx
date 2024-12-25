import { useCallback, useState, FormEvent, useEffect } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Architecture, ArchitectureState } from './types'
import { CustomNode } from './components/CustomNode'

// Initial architecture data for demonstration
const initialArchitectureData: Architecture = {
  "architecture": [
    {
      "type": "function",
      "name": "main",
      "purpose": "The main FastAPI script",
      "uses": ["load_config", "get_db", "get_item", "list_items", "create_item", "update_item", "delete_item"],
      "pypi_packages": ["fastapi==0.115.6", "pydantic==2.10.3", "python-dotenv==1.0.1", "uvicorn==0.34.0"],
      "is_endpoint": false
    },
    {
      "type": "function",
      "name": "get_db",
      "purpose": "Context manager for getting a database session",
      "uses": [],
      "pypi_packages": ["psycopg2-binary==2.9.10", "sqlalchemy==2.0.36"],
      "is_endpoint": false
    },
    {
      "type": "function",
      "name": "load_config",
      "purpose": "Load configuration from environment variables or a configuration file",
      "uses": [],
      "pypi_packages": ["python-dotenv==1.0.1"],
      "is_endpoint": false
    },
    {
      "type": "function",
      "name": "get_item",
      "purpose": "Fetch details of a specific item",
      "uses": ["fetch_item"],
      "pypi_packages": ["fastapi==0.115.6"],
      "is_endpoint": true
    },
    {
      "type": "function",
      "name": "list_items",
      "purpose": "Retrieve a list of all items",
      "uses": ["fetch_all_items"],
      "pypi_packages": ["fastapi==0.115.6"],
      "is_endpoint": true
    },
    {
      "type": "function",
      "name": "create_item",
      "purpose": "Add a new item to the inventory",
      "uses": ["add_item"],
      "pypi_packages": ["fastapi==0.115.6"],
      "is_endpoint": true
    },
    {
      "type": "function",
      "name": "update_item",
      "purpose": "Update details of an existing item",
      "uses": ["modify_item"],
      "pypi_packages": ["fastapi==0.115.6"],
      "is_endpoint": true
    },
    {
      "type": "function",
      "name": "delete_item",
      "purpose": "Remove an item from the inventory",
      "uses": ["remove_item"],
      "pypi_packages": ["fastapi==0.115.6"],
      "is_endpoint": true
    },
    {
      "type": "function",
      "name": "fetch_item",
      "purpose": "Validate and retrieve an item using the repository",
      "uses": ["validate_item_id", "get_item_by_id"],
      "pypi_packages": [],
      "is_endpoint": false
    },
    {
      "type": "function",
      "name": "fetch_all_items",
      "purpose": "Validate and retrieve all items using the repository",
      "uses": ["get_all_items"],
      "pypi_packages": [],
      "is_endpoint": false
    },
    {
      "type": "function",
      "name": "add_item",
      "purpose": "Validate and add a new item using the repository",
      "uses": ["validate_item_data", "insert_item"],
      "pypi_packages": [],
      "is_endpoint": false
    },
    {
      "type": "function",
      "name": "modify_item",
      "purpose": "Validate and update an item using the repository",
      "uses": ["validate_item_id", "validate_item_data", "update_item_in_db"],
      "pypi_packages": [],
      "is_endpoint": false
    },
    {
      "type": "function",
      "name": "remove_item",
      "purpose": "Validate and delete an item using the repository",
      "uses": ["validate_item_id", "delete_item_from_db"],
      "pypi_packages": [],
      "is_endpoint": false
    },
    {
      "type": "function",
      "name": "validate_item_data",
      "purpose": "Ensure item data meets required criteria",
      "uses": [],
      "pypi_packages": [],
      "is_endpoint": false
    },
    {
      "type": "function",
      "name": "validate_item_id",
      "purpose": "Ensure the item ID is valid",
      "uses": [],
      "pypi_packages": [],
      "is_endpoint": false
    },
    {
      "type": "function",
      "name": "get_item_by_id",
      "purpose": "Retrieve an item from the database",
      "uses": ["get_db"],
      "pypi_packages": ["sqlalchemy==2.0.36"],
      "is_endpoint": false
    },
    {
      "type": "function",
      "name": "get_all_items",
      "purpose": "Retrieve all items from the database",
      "uses": ["get_db"],
      "pypi_packages": ["sqlalchemy==2.0.36"],
      "is_endpoint": false
    },
    {
      "type": "function",
      "name": "insert_item",
      "purpose": "Insert a new item into the database",
      "uses": ["get_db"],
      "pypi_packages": ["sqlalchemy==2.0.36"],
      "is_endpoint": false
    },
    {
      "type": "function",
      "name": "update_item_in_db",
      "purpose": "Update an existing item in the database",
      "uses": ["get_db"],
      "pypi_packages": ["sqlalchemy==2.0.36"],
      "is_endpoint": false
    },
    {
      "type": "function",
      "name": "delete_item_from_db",
      "purpose": "Delete an item from the database",
      "uses": ["get_db"],
      "pypi_packages": ["sqlalchemy==2.0.36"],
      "is_endpoint": false
    }
  ],
  "external_infrastructure": ["database"],
  "app_name": "example"
}

const createNodes = (data: Architecture): Node[] => {
  return data.architecture.map((node, index) => ({
    id: node.name,
    type: 'custom',
    position: { x: 100 + (index % 4) * 350, y: 100 + Math.floor(index / 4) * 250 },
    data: node,
  }))
}

const createEdges = (data: Architecture): Edge[] => {
  const edges: Edge[] = []
  data.architecture.forEach((node) => {
    node.uses.forEach((target) => {
      edges.push({
        id: `${node.name}-${target}`,
        source: node.name,
        target,
        animated: true,
        style: { 
          stroke: '#6366f1',
          strokeWidth: 2,
        },
      })
    })
  })
  return edges
}

function App() {
  const [appName, setAppName] = useState('');
  const [systemDescription, setSystemDescription] = useState('');
  const [storedAppName, setStoredAppName] = useState('');
  const [currentArchitecture, setCurrentArchitecture] = useState<ArchitectureState>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [implementationUrl, setImplementationUrl] = useState<string | null>(null);
  const [isImplementing, setIsImplementing] = useState(false);
  
  const [nodes, setNodes, onNodesChange] = useNodesState(currentArchitecture ? createNodes(currentArchitecture) : [])
  const [edges, setEdges, onEdgesChange] = useEdgesState(currentArchitecture ? createEdges(currentArchitecture) : [])

  useEffect(() => {
    if (currentArchitecture) {
      const newNodes = createNodes(currentArchitecture);
      const newEdges = createEdges(currentArchitecture);
      setNodes(newNodes);
      setEdges(newEdges);
    } else {
      setNodes([]);
      setEdges([]);
    }
  }, [currentArchitecture, setNodes, setEdges]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch('http://34.135.155.158:8000/create-architecture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ app_name: appName, system_description: systemDescription })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setCurrentArchitecture({ ...data, app_name: appName });
      setStoredAppName(appName);
      setAppName('');
      setSystemDescription('');
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate architecture. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onConnect = useCallback((params: any) => {
    setEdges((eds) => addEdge(params, eds))
  }, [setEdges])

  const nodeTypes = {
    custom: CustomNode,
  }

  const handleImplement = async () => {
    if (!currentArchitecture) return;
    
    setError(null);
    setIsImplementing(true);
    try {
      const response = await fetch('http://34.135.155.158:8000/implement-architecture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ app_name: storedAppName })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const url = await response.text();
      setImplementationUrl(url);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to implement architecture. Please try again.');
    } finally {
      setIsImplementing(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-gray-50">
      <div className="p-4 bg-white shadow-sm">
        <h1 className="text-3xl font-bold text-center text-gray-900">Architecture Graph</h1>
        <p className="text-center text-gray-600 mt-2">System Architecture Visualization</p>
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="mt-4 flex gap-4 items-start justify-center">
          <div>
            <label htmlFor="appName" className="block text-sm font-medium text-gray-700">App Name</label>
            <input
              id="appName"
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              placeholder="Enter app name"
              className="mt-1 block w-48 rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="systemDescription" className="block text-sm font-medium text-gray-700">System Description</label>
            <textarea
              id="systemDescription"
              value={systemDescription}
              onChange={(e) => setSystemDescription(e.target.value)}
              placeholder="Describe your system"
              rows={3}
              className="mt-1 block w-96 rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`mt-7 rounded px-4 py-2 text-sm font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              isLoading 
                ? 'bg-indigo-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-500'
            }`}
          >
            {isLoading ? 'Generating...' : 'Generate Architecture'}
          </button>
        </form>
      </div>
      <div className="w-full h-[calc(100vh-8rem)]">
        {currentArchitecture ? (
          <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.1}
          maxZoom={1.5}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: true,
          }}
        >
          <Background color="#6366f1" gap={32} />
          <Controls />
          <MiniMap 
            nodeColor="#6366f1"
            maskColor="rgb(243, 244, 246, 0.7)"
          />
          <div className="absolute bottom-4 right-4 flex flex-col items-end gap-4">
            <button
              onClick={handleImplement}
              disabled={isImplementing}
              className={`rounded px-4 py-2 text-sm font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                isImplementing 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-500'
              }`}
            >
              {isImplementing ? 'Implementing...' : 'Implement'}
            </button>
            {implementationUrl && (
              <div className="bg-white p-4 rounded-md shadow-sm">
                <p className="text-sm font-medium text-gray-700">Implementation URL:</p>
                <a 
                  href={implementationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-500 break-all"
                >
                  {implementationUrl}
                </a>
              </div>
            )}
          </div>
        </ReactFlow>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <p className="text-gray-500 text-lg">Submit the form above to generate and visualize the architecture</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
