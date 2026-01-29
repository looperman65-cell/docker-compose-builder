'use client'

import { useState, useCallback, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { generateDockerCompose } from '../utils/yamlGenerator'

const FlowCanvas = dynamic(() => import('../components/FlowCanvas'), {
  ssr: false,
  loading: () => <div className="h-full flex items-center justify-center">Loading canvas...</div>
})

export default function Home() {
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])

  // ...existing code...
  const generatedYaml = useMemo(() => {
    const yaml = generateDockerCompose(nodes, edges)
    return yaml || `version: '3.8'\nservices:\n  # Drag containers to canvas to generate config`
  }, [nodes, edges])

  const handleNodesChange = useCallback((newNodes) => {
    setNodes(newNodes)
  }, [])

  const handleEdgesChange = useCallback((newEdges) => {
    setEdges(newEdges)
  }, [])

  const handleAddContainer = (type) => {
    if (window.addContainer) {
      window.addContainer(type)
    } else {
      console.warn('addContainer not ready yet')
    }
  }

  const handleDownload = () => {
    const blob = new Blob([generatedYaml], { type: 'text/yaml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'docker-compose.yml'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            🐳 Docker Compose Builder
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Visual drag-and-drop builder for docker-compose.yml
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="col-span-3 bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold mb-4">Available Containers</h2>
            <div className="space-y-2">
              <button onClick={() => handleAddContainer('nodejs')} className="w-full p-3 border rounded hover:bg-blue-50 hover:border-blue-300 cursor-pointer text-left transition">
                🟢 Node.js
              </button>
              <button onClick={() => handleAddContainer('postgres')} className="w-full p-3 border rounded hover:bg-blue-50 hover:border-blue-300 cursor-pointer text-left transition">
                🐘 PostgreSQL
              </button>
              <button onClick={() => handleAddContainer('mysql')} className="w-full p-3 border rounded hover:bg-blue-50 hover:border-blue-300 cursor-pointer text-left transition">
                🐬 MySQL
              </button>
              <button onClick={() => handleAddContainer('redis')} className="w-full p-3 border rounded hover:bg-blue-50 hover:border-blue-300 cursor-pointer text-left transition">
                🔴 Redis
              </button>
              <button onClick={() => handleAddContainer('mongo')} className="w-full p-3 border rounded hover:bg-blue-50 hover:border-blue-300 cursor-pointer text-left transition">
                🍃 MongoDB
              </button>
              <button onClick={() => handleAddContainer('nginx')} className="w-full p-3 border rounded hover:bg-blue-50 hover:border-blue-300 cursor-pointer text-left transition">
                🌐 Nginx
              </button>
              <button onClick={() => handleAddContainer('rabbitmq')} className="w-full p-3 border rounded hover:bg-blue-50 hover:border-blue-300 cursor-pointer text-left transition">
                🐰 RabbitMQ
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className="col-span-6 bg-white rounded-lg shadow overflow-hidden">
            <div className="h-[600px]">
              <FlowCanvas
                onNodesChange={handleNodesChange}
                onEdgesChange={handleEdgesChange}
              />
            </div>
          </div>

          {/* YAML */}
          <div className="col-span-3 bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Generated YAML</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => navigator.clipboard.writeText(generatedYaml)}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  Copy
                </button>
                <button
                  onClick={handleDownload}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  Download
                </button>
              </div>
            </div>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded text-xs overflow-auto h-[540px] font-mono">
              {generatedYaml}
            </pre>
          </div>
        </div>
      </main>
    </div>
  )
}