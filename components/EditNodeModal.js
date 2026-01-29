'use client'

import { useState, useEffect } from 'react';

export default function EditNodeModal({ isOpen, onClose, node, onSave }) {
  if (!isOpen || !node) return null;

  const [port, setPort] = useState(node.data.port || '');
  const [env, setEnv] = useState(
    node.data.env ? Object.entries(node.data.env).map(([k, v]) => `${k}=${v}`).join('\n') : ''
  );

  const handleSave = () => {
    const newEnv = {};
    env.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key.trim()) {
        newEnv[key.trim()] = valueParts.join('=').trim();
      }
    });

    onSave({
      ...node,
      data: {
        ...node.data,
        port: Number(port) || node.data.port,
        env: Object.keys(newEnv).length > 0 ? newEnv : undefined,
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit {node.data.label}</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Port (host:container)</label>
          <input
            type="number"
            value={port}
            onChange={e => setPort(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="e.g. 3000"
          />
          <p className="text-xs text-gray-500 mt-1">Will map {port || '?'}:{port || '?'} in docker-compose</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Environment variables</label>
          <textarea
            value={env}
            onChange={e => setEnv(e.target.value)}
            rows={6}
            className="w-full border rounded px-3 py-2 font-mono text-sm"
            placeholder="KEY=value&#10;ANOTHER=secret"
          />
          <p className="text-xs text-gray-500 mt-1">One per line, format: KEY=value</p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}