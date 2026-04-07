import type { Node, Edge } from "@xyflow/react"

// Radial campus layout for the institution view
// - Institution node at center (0,0)
// - 10 lab groups in a circle at radius ~1200px
// - Agents within each lab positioned relative to parent group

const LAB_WIDTH = 500
const LAB_HEIGHT = 420
const CAMPUS_RADIUS = 2000

function getLabPosition(index: number): { x: number; y: number } {
  const angle = (2 * Math.PI / 10) * index - Math.PI / 2 // start from top
  return {
    x: CAMPUS_RADIUS * Math.cos(angle) - LAB_WIDTH / 2,
    y: CAMPUS_RADIUS * Math.sin(angle) - LAB_HEIGHT / 2,
  }
}

// Positions within a lab group (relative to parent)
const PI_POS = { x: 160, y: 30 }
const RA_POSITIONS = [
  { x: 30, y: 180 },
  { x: 190, y: 180 },
  { x: 350, y: 180 },
]
const SPEC_POSITIONS = [
  { x: 110, y: 310 },
  { x: 270, y: 310 },
]

// For Lab 10 (synthesis lab) which has different agent composition
const SYNTH_POSITIONS: Record<string, { x: number; y: number }> = {
  ra1: { x: 30, y: 180 },
  ra2: { x: 190, y: 180 },
  evidence_grader: { x: 350, y: 180 },
  report_writer: { x: 110, y: 310 },
  exec_summarizer: { x: 270, y: 310 },
}

function getAgentPositionInLab(agentId: string): { x: number; y: number } | null {
  const match = agentId.match(/^lab(\d+)_(.+)$/)
  if (!match) return null
  const labNum = parseInt(match[1], 10)
  const role = match[2]

  if (role === "pi") return PI_POS
  if (role === "group") return null // group nodes are handled separately

  if (labNum === 10) {
    return SYNTH_POSITIONS[role] ?? SPEC_POSITIONS[0]
  }

  if (role === "ra1") return RA_POSITIONS[0]
  if (role === "ra2") return RA_POSITIONS[1]
  if (role === "ra3") return RA_POSITIONS[2]
  if (role === "spec1") return SPEC_POSITIONS[0]

  return SPEC_POSITIONS[0]
}

export function getInstitutionLayout(nodes: Node[], edges: Edge[]): { nodes: Node[]; edges: Edge[] } {
  const layoutedNodes = nodes.map((node) => {
    // Institution center node
    if (node.type === "institution") {
      return { ...node, position: { x: -60, y: -60 } }
    }

    // Lab group nodes — radial placement
    if (node.type === "labGroup") {
      const labId = (node.data.labId as number) ?? 1
      const pos = getLabPosition(labId - 1)
      return {
        ...node,
        position: pos,
        style: { ...node.style, width: LAB_WIDTH, height: LAB_HEIGHT },
      }
    }

    // PI agent nodes — special node type
    if (node.type === "piAgent") {
      const pos = getAgentPositionInLab(node.id)
      return { ...node, position: pos ?? PI_POS }
    }

    // Regular agent nodes inside labs
    if (node.parentId?.includes("_group")) {
      const pos = getAgentPositionInLab(node.id)
      return { ...node, position: pos ?? { x: 100, y: 200 } }
    }

    // Finding, source, insight nodes — position relative to their source
    if (node.type === "finding" || node.type === "source" || node.type === "insight") {
      // These are placed by React Flow's auto-positioning since they don't have parentId
      // We'll position them in an outer ring
      const sourceEdge = edges.find((e) => e.target === node.id)
      if (sourceEdge) {
        const sourceNode = nodes.find((n) => n.id === sourceEdge.source)
        if (sourceNode) {
          // Try to get an absolute position for the source
          const labMatch = sourceEdge.source.match(/^lab(\d+)_/)
          if (labMatch) {
            const labId = parseInt(labMatch[1], 10)
            const labPos = getLabPosition(labId - 1)
            const agentPos = getAgentPositionInLab(sourceEdge.source)
            if (agentPos) {
              // Place findings outside the lab, pushed outward from center
              const angle = (2 * Math.PI / 10) * (labId - 1) - Math.PI / 2
              const outwardOffset = 350
              return {
                ...node,
                position: {
                  x: labPos.x + agentPos.x + Math.cos(angle) * outwardOffset,
                  y: labPos.y + agentPos.y + Math.sin(angle) * outwardOffset + 50,
                },
              }
            }
          }
        }
      }
      return { ...node, position: node.position }
    }

    return { ...node, position: node.position }
  })

  return { nodes: layoutedNodes, edges }
}
