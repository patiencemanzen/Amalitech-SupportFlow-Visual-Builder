import { useState, useEffect, useRef } from 'react'

export default function PreviewChat({ nodes, startNodeId }) {
  const nodeMap = {}
  nodes.forEach((n) => (nodeMap[n.id] = n))

  const [currentId, setCurrentId] = useState(startNodeId)
  const [chatLog, setChatLog] = useState([])   // [{ role: 'bot'|'user', text: string }]
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef(null)

  const currentNode = nodeMap[currentId] ?? null
  const isEnd = currentNode?.options.length === 0

  // Push bot message with a brief "typing" delay for realism
  const pushBotMessage = (text) => {
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setChatLog((prev) => [...prev, { role: 'bot', text }])
    }, 500)
  }

  // On mount — show the start node
  useEffect(() => {
    if (currentNode) pushBotMessage(currentNode.text)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatLog, isTyping])

  const handleOption = (opt) => {
    // Add user's choice to log
    setChatLog((prev) => [...prev, { role: 'user', text: opt.label }])

    // Advance to next node
    const next = nodeMap[opt.nextId]
    if (next) {
      setCurrentId(next.id)
      pushBotMessage(next.text)
    }
  }

  const handleRestart = () => {
    setChatLog([])
    setCurrentId(startNodeId)
    const start = nodeMap[startNodeId]
    if (start) pushBotMessage(start.text)
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-slate-900 p-6">
      <div className="w-full max-w-md flex flex-col bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden h-full max-h-[600px]">

        {/* Chat header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-indigo-600 flex-shrink-0">
          <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-lg">
            🤖
          </div>
          <div>
            <p className="text-sm font-semibold text-white">SupportFlow Bot</p>
            <p className="text-xs text-indigo-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
              Online · Preview Mode
            </p>
          </div>
        </div>

        {/* Message list */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {chatLog.map((msg, i) => (
            <div
              key={i}
              className={`flex bubble-in ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'bot' && (
                <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-xs flex-shrink-0 mr-2 mt-1">
                  🤖
                </div>
              )}
              <div
                className={`max-w-[75%] px-3.5 py-2.5 text-sm leading-snug rounded-2xl ${
                  msg.role === 'bot'
                    ? 'bg-slate-700 text-slate-100 rounded-tl-none'
                    : 'bg-indigo-600 text-white rounded-tr-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 bubble-in">
              <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-xs flex-shrink-0">
                🤖
              </div>
              <div className="bg-slate-700 px-4 py-3 rounded-2xl rounded-tl-none">
                <div className="flex gap-1 items-center h-3">
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="w-1.5 h-1.5 bg-slate-400 rounded-full inline-block"
                      style={{
                        animation: 'bounce 1.2s ease-in-out infinite',
                        animationDelay: `${d * 0.2}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Action bar — options or restart */}
        <div className="flex-shrink-0 border-t border-slate-700 px-4 py-3 space-y-2">
          {!isTyping && !isEnd && currentNode?.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleOption(opt)}
              className="w-full text-left px-4 py-2.5 bg-slate-700 hover:bg-indigo-600/30 border border-slate-600 hover:border-indigo-500 rounded-xl text-sm text-slate-200 transition-colors"
            >
              {opt.label}
            </button>
          ))}

          {!isTyping && isEnd && (
            <div className="flex flex-col items-center gap-2 pt-1">
              <p className="text-xs text-emerald-400 font-medium">
                ✓ Conversation complete
              </p>
              <button
                onClick={handleRestart}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-medium text-white transition-colors"
              >
                ↺ Restart Conversation
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40%            { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  )
}
