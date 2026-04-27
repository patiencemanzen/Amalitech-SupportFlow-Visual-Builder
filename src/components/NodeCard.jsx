import { NODE_WIDTH } from './nodeUtils'

// Visual config per node type
const TYPE_STYLES = {
  start: {
    header: 'bg-indigo-600 text-white',
    border: 'border-indigo-500/60',
    bg: 'bg-slate-800',
    badge: '▶ Start',
    badgeColor: 'bg-indigo-700/60 text-indigo-200',
  },
  question: {
    header: 'bg-slate-700 text-slate-100',
    border: 'border-slate-600/60',
    bg: 'bg-slate-800',
    badge: '◆ Question',
    badgeColor: 'bg-slate-600/60 text-slate-300',
  },
  end: {
    header: 'bg-emerald-700 text-emerald-50',
    border: 'border-emerald-600/40',
    bg: 'bg-slate-800',
    badge: '✓ End',
    badgeColor: 'bg-emerald-800/60 text-emerald-300',
  },
}

export default function NodeCard({ node, isSelected, isStart, isDragging, onMouseDown }) {
  const typeKey = isStart ? 'start' : node.type ?? 'question'
  const style = TYPE_STYLES[typeKey] ?? TYPE_STYLES.question

  return (
    <div
      onMouseDown={onMouseDown}
      className={[
        'absolute rounded-xl border-2 overflow-hidden select-none transition-all duration-150',
        style.border,
        style.bg,
        isSelected ? 'border-indigo-400 node-selected' : '',
        isDragging
          ? 'scale-[1.02] shadow-2xl shadow-indigo-900/50 cursor-grabbing opacity-90 z-20'
          : 'cursor-grab z-10 hover:border-slate-500',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        left: node.position.x,
        top: node.position.y,
        width: NODE_WIDTH,
      }}
    >
      {/* ── Header bar ──────────────────────────────────────────────────────── */}
      <div className={`flex items-center justify-between px-3 py-2 ${style.header}`}>
        <span className="text-xs font-bold tracking-wide uppercase opacity-90">
          {style.badge}
        </span>
        <span className="text-xs font-mono opacity-50">#{node.id}</span>
      </div>

      {/* ── Question / message text ──────────────────────────────────────────── */}
      <div className="px-3 pt-2.5 pb-2 text-sm text-slate-200 leading-snug">
        {node.text}
      </div>

      {/* ── Options ─────────────────────────────────────────────────────────── */}
      {node.options.length > 0 ? (
        <div className="px-3 pb-3 space-y-1.5">
          {node.options.map((opt, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 text-xs bg-slate-700/70 border border-slate-600/50 rounded-md px-2.5 py-1.5 text-slate-300"
            >
              <span className="text-indigo-400 font-bold">→</span>
              <span className="truncate">{opt.label}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="px-3 pb-3">
          <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-900/30 border border-emerald-700/40 rounded-md px-2 py-1">
            ✓ Conversation ends here
          </span>
        </div>
      )}
    </div>
  )
}
