import React from 'react'
import ReactFlow from 'reactflow'
import 'reactflow/dist/style.css'

function App() {
  return (
    <div className="w-screen h-screen">
      <h1 className="text-3xl font-bold text-center py-4">Architecture Graph</h1>
      <div className="w-full h-[calc(100vh-4rem)]">
        <ReactFlow />
      </div>
    </div>
  )
}

export default App
