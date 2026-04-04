import dagre from "dagre"
import type { Node, Edge } from "@xyflow/react"

const NODE_WIDTH = 160
const NODE_HEIGHT = 60

export function getLayoutedElements(
  nodes: Node[],
  edges: Edge[]
): { nodes: Node[]; edges: Edge[] } {
  if (nodes.length === 0) return { nodes, edges }

  const g = new dagre.graphlib.Graph()
  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({
    rankdir: "TB",
    nodesep: 60,
    ranksep: 80,
    marginx: 20,
    marginy: 20,
  })

  for (const node of nodes) {
    const w = node.type === "source" ? 40 : node.type === "center" ? 80 : NODE_WIDTH
    const h = node.type === "source" ? 40 : node.type === "center" ? 80 : NODE_HEIGHT
    g.setNode(node.id, { width: w, height: h })
  }

  for (const edge of edges) {
    g.setEdge(edge.source, edge.target)
  }

  dagre.layout(g)

  const layoutedNodes = nodes.map((node) => {
    const pos = g.node(node.id)
    if (!pos) return node

    const w = node.type === "source" ? 40 : node.type === "center" ? 80 : NODE_WIDTH
    const h = node.type === "source" ? 40 : node.type === "center" ? 80 : NODE_HEIGHT

    return {
      ...node,
      position: {
        x: pos.x - w / 2,
        y: pos.y - h / 2,
      },
    }
  })

  return { nodes: layoutedNodes, edges }
}
