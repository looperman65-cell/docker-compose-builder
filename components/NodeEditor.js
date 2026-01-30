'use client'

import { useState, useEffect } from 'react'

export default function NodeEditor({ node, onUpdate, onClose }) {
  const [label, setLabel] = useState('')
  const [port, setPort] = useState('')
  const [envVars, setEnvVars] = useState({})
  const [newEnvKey, setNewEnvKey] = useState('')
  const [newEnvValue, setNewEnvValue] = useState('')

  // Загружаем данные при открытии
  useEffect(() => {
    if (node) {
      setLabel(node.data.label || '')
      setPort(node.data.port || '')
      setEnvVars(node.data.env || {})
    }
  }, [node])

  if (!node) return null

  const handleSave = () => {
    onUpdate({
      ...node,
      data: {
        ...node.data,
        label,
        port: parseInt(port) || node.data.port,
        env: envVars,
      }
    })
  }

  const handleAddEnv = () => {
    if (newEnvKey && newEnvValue) {
      setEnvVars({
        ...envVars,
        [newEnvKey]: newEnvValue
      })
      setNewEnvKey('')
      setNewEnvValue('')
    }
  }

  const handleDeleteEnv = (key) => {
    const updated = { ...envVars }
    delete updated[key]
    setEnvVars(updated)
  }

  return (
    <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl border-l z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {node.data.icon} Edit Container
        </h2>
        <button
          onClick={onClose}
          className="text-white hover:bg-blue-700 rounded px-2 py-1"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        
        {/* Container Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Container Name
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g. Node.js"
          />
        </div>

        {/* Port */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Port
          </label>
          <input
            type="number"
            value={port}
            onChange={(e) => setPort(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g. 3000"
          />
          <p className="text-xs text-gray-500 mt-1">
            Will map to: {port}:{port}
          </p>
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Docker Image
          </label>
          <input
            type="text"
            value={node.data.image}
            disabled
            className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-600"
          />
          <p className="text-xs text-gray-500 mt-1">
            (Cannot be changed)
          </p>
        </div>

        {/* Environment Variables */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Environment Variables
          </label>
          
          {/* Existing env vars */}
          <div className="space-y-2 mb-3">
            {Object.entries(envVars).map(([key, value]) => (
              <div key={key} className="flex gap-2 items-center bg-gray-50 p-2 rounded">
                <div className="flex-1">
                  <div className="text-xs font-mono text-gray-700">{key}</div>
                  <div className="text-xs font-mono text-gray-500">{value}</div>
                </div>
                <button
                  onClick={() => handleDeleteEnv(key)}
                  className="text-red-500 hover:bg-red-50 rounded px-2 py-1 text-sm"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          {/* Add new env var */}
          <div className="border-t pt-3">
            <div className="space-y-2">
              <input
                type="text"
                value={newEnvKey}
                onChange={(e) => setNewEnvKey(e.target.value)}
                placeholder="KEY"
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
              <input
                type="text"
                value={newEnvValue}
                onChange={(e) => setNewEnvValue(e.target.value)}
                placeholder="value"
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
              <button
                onClick={handleAddEnv}
                className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                + Add Variable
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-white border-t p-4 flex gap-3">
        <button
          onClick={handleSave}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          Save Changes
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}