import yaml from 'js-yaml'

export function generateDockerCompose(nodes, edges) {
  if (!nodes || nodes.length === 0) {
    return `version: '3.8'\nservices:\n  # Drag containers to canvas to generate config`
  }

  const services = {}

  // Генерируем сервисы из nodes
  nodes.forEach(node => {
    const { label, image, port, env, command } = node.data
    const serviceName = label.toLowerCase().replace(/[^a-z0-9]/g, '-')
    
    const service = {
      image: image,
      ports: [`${port}:${port}`],
      container_name: `${serviceName}_container`,
    }

    // Добавляем environment если есть
    if (env && Object.keys(env).length > 0) {
      service.environment = env
    }

    // Добавляем command если есть
    if (command) {
      service.command = command
    }

    services[serviceName] = service
  })

  // Добавляем depends_on на основе edges (связей)
  edges.forEach(edge => {
    const sourceNode = nodes.find(n => n.id === edge.source)
    const targetNode = nodes.find(n => n.id === edge.target)
    
    if (sourceNode && targetNode) {
      const sourceName = sourceNode.data.label.toLowerCase().replace(/[^a-z0-9]/g, '-')
      const targetName = targetNode.data.label.toLowerCase().replace(/[^a-z0-9]/g, '-')
      
      if (!services[sourceName].depends_on) {
        services[sourceName].depends_on = []
      }
      services[sourceName].depends_on.push(targetName)
    }
  })

  const composeConfig = {
    version: '3.8',
    services: services,
  }

  return yaml.dump(composeConfig, { indent: 2 })
}