import { useState } from 'react'

export default function EditPanel({ node, onUpdate, onClose }) {
  const [text, setText] = useState(node.text)
  const [options, setOptions] = useState(node.options.map((o) => ({ ...o })))

  // Live-update the canvas immediately as the user types
  const handleTextChange = (val) => {
    setText(val)
    onUpdate({ text: val, options })
  }

  const handleOptionLabelChange = (index, val) => {
    const next = options.map((o, i) => (i === index ? { ...o, label: val } : o))
    setOptions(next)
    onUpdate({ text, options: next })
  }

  const handleOptionNextIdChange = (index, val) => {
    const next = options.map((o, i) => (i === index ? { ...o, nextId: val } : o))
    setOptions(next)
    onUpdate({ text, options: next })
  }

  const addOption = () => {
    const next = [...options, { label: 'New option', nextId: '' }]
    setOptions(next)
    onUpdate({ text, options: next })
  }

  const removeOption = (index) => {
    const next = options.filter((_, i) => i !== index)
    setOptions(next)
    onUpdate({ text, options: next })
  }

  const isEnd = node.type === 'end'

  return (
    <aside className="w-72 flex-shrink-0 flex flex-col bg-slate-800 border-l border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Edit Node
          </p>
          <p className="text-sm font-mono text-slate-200 mt-0.5">#{node.id}</p>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:text-white hover:bg-slate-700 transition-colors text-xl leading-none"
        >
          ×
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Node type badge */}
        <div>
          <Label>Type</Label>
          <span
            className={`inline-block text-xs px-2 py-0.5 rounded font-medium mt-1 ${
              node.type === 'start'
                ? 'bg-indigo-700 text-indigo-100'
                : node.type === 'end'
                ? 'bg-emerald-700 text-emerald-100'
                : 'bg-slate-600 text-slate-200'
            }`}
          >
            {node.type}
          </span>
        </div>

        {/* Message / question text */}
        <div>
          <Label>Message text</Label>
          <textarea
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            rows={4}
            className="mt-1 w-full bg-slate-900 border border-slate-600 focus:border-indigo-500 rounded-lg px-3 py-2 text-sm text-white resize-none outline-none transition-colors"
            placeholder="Enter the bot's message…"
          />
        </div>

        {/* Options */}
        {!isEnd && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Answer Options</Label>
              <button
                onClick={addOption}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                + Add
              </button>
            </div>

            {options.length === 0 && (
              <p className="text-xs text-slate-500 italic">No options yet.</p>
            )}

            <div className="space-y-3">
              {options.map((opt, i) => (
                <div key={i} className="bg-slate-900/60 border border-slate-700 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">Option {i + 1}</span>
                    <button
                      onClick={() => removeOption(i)}
                      className="text-xs text-red-500 hover:text-red-400 transition-colors"
                    >
                      ✕ Remove
                    </button>
                  </div>

                  <div>
                    <span className="text-xs text-slate-500">Label</span>
                    <input
                      value={opt.label}
                      onChange={(e) => handleOptionLabelChange(i, e.target.value)}
                      className="mt-0.5 w-full bg-slate-800 border border-slate-600 focus:border-indigo-500 rounded px-2 py-1 text-xs text-white outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <span className="text-xs text-slate-500">Goes to node ID</span>
                    <input
                      value={opt.nextId}
                      onChange={(e) => handleOptionNextIdChange(i, e.target.value)}
                      className="mt-0.5 w-full bg-slate-800 border border-slate-600 focus:border-indigo-500 rounded px-2 py-1 text-xs text-white font-mono outline-none transition-colors"
                      placeholder="e.g. 4"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isEnd && (
          <div className="text-xs text-emerald-400 bg-emerald-900/20 border border-emerald-700/40 rounded-lg px-3 py-2.5">
            ✓ This is a leaf / end node. It has no onward options.
          </div>
        )}
      </div>

      {/* Footer hint */}
      <div className="px-4 py-3 border-t border-slate-700">
        <p className="text-xs text-slate-500">
          Changes update the canvas instantly. Use{' '}
          <span className="text-slate-400">Export JSON</span> to save.
        </p>
      </div>
    </aside>
  )
}

function Label({ children }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
      {children}
    </p>
  )
}
