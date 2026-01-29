'use client'

import { useCallback, useEffect, useState } from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
} from 'reactflow'
import 'reactflow/dist/style.css'

const nodeTypes = {
  container: ({ data }) => (
    <div className="px-4 py-3 shadow-lg rounded-lg bg-white border-2 border-gray-300 min-w-[180px] relative" style={{ cursor: 'grab' }}>
      <Handle type="source" position={Position.Right} id="source" className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
      <Handle type="target" position={Position.Left} id="target" className="w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
      <div className="flex items-center gap-2 pointer-events-none">
        <span className="text-xl">{data.icon}</span>
        <div>
          <div className="font-semibold text-sm">{data.label}</div>
          <div className="text-xs text-gray-500">:{data.port || '????'}</div>
        </div>
      </div>
    </div>
  ),
}

export default function FlowCanvas({ onNodesChange, onEdgesChange }) {
  const [nodes, setNodes, onNodesChangeInternal] = useNodesState([])
  const [edges, setEdges, onEdgesChangeInternal] = useEdgesState([])

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  const addContainer = useCallback((type) => {
    const newNode = {
      id: `${type}-${Date.now()}`,
      type: 'container',
      position: { x: Math.random() * 500, y: Math.random() * 400 },
      data: getContainerData(type),
    }
    setNodes((nds) => [...nds, newNode])
  }, [setNodes])

  // Передаём изменения наверх
  useEffect(() => {
    if (onNodesChange) onNodesChange(nodes)
  }, [nodes, onNodesChange])

  useEffect(() => {
    if (onEdgesChange) onEdgesChange(edges)
  }, [edges, onEdgesChange])

  // Делаем addContainer доступным глобально
  useEffect(() => {
    window.addContainer = addContainer
    return () => {
      delete window.addContainer
    }
  }, [addContainer])

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChangeInternal}
        onEdgesChange={onEdgesChangeInternal}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background variant="dots" gap={12} size={1} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  )
}

function getContainerData(type) {
  const configs = {
    nodejs: { icon: '🟢', label: 'Node.js', port: 3000, image: 'node:18-alpine', env: {} },
    postgres: { icon: '🐘', label: 'PostgreSQL', port: 5432, image: 'postgres:15-alpine', env: { POSTGRES_PASSWORD: 'password', POSTGRES_USER: 'user', POSTGRES_DB: 'database' } },
    mysql: { icon: '🐬', label: 'MySQL', port: 3306, image: 'mysql:8.0', env: { MYSQL_ROOT_PASSWORD: 'rootpassword', MYSQL_DATABASE: 'mydb', MYSQL_USER: 'user', MYSQL_PASSWORD: 'password' } },
    redis: { icon: '🔴', label: 'Redis', port: 6379, image: 'redis:7-alpine', command: 'redis-server --appendonly yes', env: {} },
    mongo: { icon: '🍃', label: 'MongoDB', port: 27017, image: 'mongo:7', env: { MONGO_INITDB_ROOT_USERNAME: 'root', MONGO_INITDB_ROOT_PASSWORD: 'password' } },
    nginx: { icon: '🌐', label: 'Nginx', port: 80, image: 'nginx:alpine', env: {} },
    rabbitmq: { icon: '🐰', label: 'RabbitMQ', port: 5672, image: 'rabbitmq:3-management', env: { RABBITMQ_DEFAULT_USER: 'guest', RABBITMQ_DEFAULT_PASS: 'guest' } },
  }
  return configs[type] || {}
}