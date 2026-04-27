export default function Toolbar({
  mode,
  onToggleMode,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onResetLayout,
  onExport,
}) {
  return (
    <header className="h-14 flex-shrink-0 flex items-center justify-between px-5 bg-slate-800 border-b border-slate-700 z-10">
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold select-none">
          ⚡
        </div>
        <span className="font-semibold text-white text-sm tracking-tight">
          SupportFlow
        </span>
        <span className="text-slate-500 text-sm">/ Visual Builder</span>
      </div>

      {/* Centre actions (editor only) */}
      {mode === 'editor' && (
        <div className="flex items-center gap-1">
          <ToolBtn onClick={onUndo} disabled={!canUndo} title="Undo (Ctrl+Z)">
            ↩
          </ToolBtn>
          <ToolBtn onClick={onRedo} disabled={!canRedo} title="Redo (Ctrl+Y)">
            ↪
          </ToolBtn>
          <div className="w-px h-5 bg-slate-600 mx-1" />
          <ToolBtn onClick={onResetLayout} title="Reset node positions to default">
            ⟳ Reset Layout
          </ToolBtn>
          <ToolBtn onClick={onExport} title="Download flow_data.json">
            ↓ Export JSON
          </ToolBtn>
        </div>
      )}

      {/* Mode toggle */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-500 hidden sm:block">
          {mode === 'editor' ? '✏️ Editor Mode' : '▶ Preview Mode'}
        </span>
        <button
          onClick={onToggleMode}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            mode === 'editor'
              ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
              : 'bg-slate-600 hover:bg-slate-500 text-white'
          }`}
        >
          {mode === 'editor' ? '▶  Preview Bot' : '← Back to Editor'}
        </button>
      </div>
    </header>
  )
}

function ToolBtn({ children, onClick, disabled, title }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
        disabled
          ? 'text-slate-600 cursor-not-allowed'
          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
      }`}
    >
      {children}
    </button>
  )
}
