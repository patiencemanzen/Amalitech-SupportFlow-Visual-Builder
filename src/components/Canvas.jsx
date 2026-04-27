import { useRef, useState, useCallback } from 'react'
import NodeCard from './NodeCard'
import { NODE_WIDTH, estimateNodeHeight, buildConnections, bezierPath } from './nodeUtils'

const CANVAS_PADDING = 120

export default function Canvas({
  nodes,
  selectedNodeId,
  startNodeId,
  onSelectNode,
  onUpdatePosition,
  onCommitPosition,
}) {
  const containerRef = useRef(null)
  const [drag, setDrag] = useState(null)
  // drag = { nodeId, startMouseX, startMouseY, startNodeX, startNodeY, moved }

  // ── Canvas dimensions ──────────────────────────────────────────────────────
  const canvasW = Math.max(
    ...nodes.map((n) => n.position.x + NODE_WIDTH + CANVAS_PADDING),
    900
  )
  const canvasH = Math.max(
    ...nodes.map((n) => n.position.y + estimateNodeHeight(n) + CANVAS_PADDING),
    600
  )

  // ── SVG connections ────────────────────────────────────────────────────────
  const connections = buildConnections(nodes)

  // ── Drag handlers ──────────────────────────────────────────────────────────
  const handleNodeMouseDown = useCallback((e, node) => {
    e.stopPropagation()
    setDrag({
      nodeId: node.id,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startNodeX: node.position.x,
      startNodeY: node.position.y,
      moved: false,
    })
  }, [])

  const handleMouseMove = useCallback(
    (e) => {
      if (!drag) return
      const dx = e.clientX - drag.startMouseX
      const dy = e.clientY - drag.startMouseY
      if (!drag.moved && Math.abs(dx) < 4 && Math.abs(dy) < 4) return

      if (!drag.moved) setDrag((d) => ({ ...d, moved: true }))

      const newX = Math.max(0, drag.startNodeX + dx)
      const newY = Math.max(0, drag.startNodeY + dy)
      onUpdatePosition(drag.nodeId, newX, newY)
    },
    [drag, onUpdatePosition]
  )

  const handleMouseUp = useCallback(() => {
    if (!drag) return
    if (!drag.moved) {
      // treat as click → select node
      onSelectNode(drag.nodeId)
    } else {
      // commit position to undo history
      onCommitPosition()
    }
    setDrag(null)
  }, [drag, onSelectNode, onCommitPosition])

  const handleCanvasClick = useCallback(() => {
    onSelectNode(null)
  }, [onSelectNode])

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-auto canvas-bg"
      style={{ cursor: drag?.moved ? 'grabbing' : 'default' }}
    >
      <div
        className="relative"
        style={{ width: canvasW, height: canvasH }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleCanvasClick}
      >
        {/* ── SVG connector layer ──────────────────────────────────────────── */}
        <svg
          className="absolute inset-0 pointer-events-none overflow-visible"
          width={canvasW}
          height={canvasH}
        >
          <defs>
            {/* Arrowhead marker */}
            <marker
              id="arrow"
              markerWidth="8"
              markerHeight="8"
              refX="7"
              refY="3"
              orient="auto"
            >
              <path d="M0,0 L8,3 L0,6 Z" fill="#6366f1" opacity="0.85" />
            </marker>

            {/* Glow filter for selected paths */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {connections.map((conn, i) => {
            const fromH = estimateNodeHeight(conn.from)
            const x1 = conn.from.position.x + NODE_WIDTH / 2
            const y1 = conn.from.position.y + fromH
            const x2 = conn.to.position.x + NODE_WIDTH / 2
            const y2 = conn.to.position.y

            const isActive =
              conn.from.id === selectedNodeId || conn.to.id === selectedNodeId

            return (
              <g key={i}>
                {/* Shadow / halo path */}
                <path
                  d={bezierPath(x1, y1, x2, y2)}
                  fill="none"
                  stroke={isActive ? '#818cf8' : '#4f46e5'}
                  strokeWidth={isActive ? 3 : 2}
                  opacity={isActive ? 0.35 : 0.2}
                  strokeLinecap="round"
                  style={{ filter: isActive ? 'url(#glow)' : 'none' }}
                />
                {/* Main path */}
                <path
                  d={bezierPath(x1, y1, x2, y2)}
                  fill="none"
                  stroke={isActive ? '#818cf8' : '#6366f1'}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  opacity={isActive ? 0.9 : 0.55}
                  strokeLinecap="round"
                  markerEnd="url(#arrow)"
                />
              </g>
            )
          })}
        </svg>

        {/* ── Node cards ───────────────────────────────────────────────────── */}
        {nodes.map((node) => (
          <NodeCard
            key={node.id}
            node={node}
            isSelected={node.id === selectedNodeId}
            isStart={node.id === startNodeId || node.type === 'start'}
            isDragging={drag?.nodeId === node.id && drag?.moved}
            onMouseDown={(e) => handleNodeMouseDown(e, node)}
          />
        ))}

        {/* ── Empty-canvas hint ─────────────────────────────────────────────*/}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-600 text-sm select-none">
            No nodes in flow_data.json
          </div>
        )}
      </div>
    </div>
  )
}
