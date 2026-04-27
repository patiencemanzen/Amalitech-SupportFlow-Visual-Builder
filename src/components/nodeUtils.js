// Shared geometry constants
export const NODE_WIDTH = 248

// Estimate a node's rendered height based on its content.
// Used to anchor SVG connector lines to the bottom centre of each card.
export function estimateNodeHeight(node) {
  const HEADER_H    = 34
  const PADDING_V   = 20          // top + bottom padding of the question text area
  const LINE_H      = 20          // px per line of text
  const CHARS_LINE  = 28          // ~chars per line at NODE_WIDTH
  const OPTION_H    = 34          // height of one option pill
  const OPTIONS_PAD = 12          // extra padding above/below options section

  const lines       = Math.max(2, Math.ceil(node.text.length / CHARS_LINE))
  const questionH   = lines * LINE_H + PADDING_V
  const optionsH    = node.options.length > 0
    ? OPTIONS_PAD + node.options.length * OPTION_H
    : 0

  return HEADER_H + questionH + optionsH
}

// Build a list of { from, to, optionLabel } connection objects from the node array
export function buildConnections(nodes) {
  const map = {}
  nodes.forEach((n) => (map[n.id] = n))

  const connections = []
  nodes.forEach((parent) => {
    parent.options.forEach((opt) => {
      const child = map[opt.nextId]
      if (child) {
        connections.push({ from: parent, to: child, label: opt.label })
      }
    })
  })
  return connections
}

// Cubic-bezier SVG path string between two (x,y) points
export function bezierPath(x1, y1, x2, y2) {
  const midY = (y1 + y2) / 2
  return `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`
}
