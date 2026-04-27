import { useState, useCallback } from "react";
import rawData from "./flow_data.json";
import Canvas from "./components/Canvas";
import EditPanel from "./components/EditPanel";
import PreviewChat from "./components/PreviewChat";
import Toolbar from "./components/Toolbar";

// Normalise the JSON
const initialNodes = rawData.nodes.map((n) => ({
  ...n,
  position: { ...n.position },
}));

const startNodeId =
  rawData.nodes.find((n) => n.type === "start")?.id ?? rawData.nodes[0].id;

export default function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [mode, setMode] = useState("editor"); // 'editor' | 'preview'
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [history, setHistory] = useState([initialNodes]); // undo stack
  const [historyIndex, setHistoryIndex] = useState(0);

  // ── helpers 
  const pushHistory = useCallback(
    (nextNodes) => {
      setHistory((prev) => {
        const trimmed = prev.slice(0, historyIndex + 1);
        return [...trimmed, nextNodes];
      });
      setHistoryIndex((i) => i + 1);
    },
    [historyIndex],
  );

  const updateNode = useCallback(
    (nodeId, updates) => {
      setNodes((prev) => {
        const next = prev.map((n) =>
          n.id === nodeId ? { ...n, ...updates } : n,
        );
        pushHistory(next);
        return next;
      });
    },
    [pushHistory],
  );

  const updateNodePosition = useCallback((nodeId, x, y) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, position: { x, y } } : n)),
    );
    // position changes don't push to history on every mouse-move;
    // history push happens on mouse-up (see Canvas)
  }, []);

  const commitPositionHistory = useCallback(() => {
    setNodes((current) => {
      pushHistory(current);
      return current;
    });
  }, [pushHistory]);

  const undo = useCallback(() => {
    if (historyIndex === 0) return;
    const prev = history[historyIndex - 1];
    setNodes(prev);
    setHistoryIndex((i) => i - 1);
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    const next = history[historyIndex + 1];
    setNodes(next);
    setHistoryIndex((i) => i + 1);
  }, [history, historyIndex]);

  const resetLayout = useCallback(() => {
    const reset = initialNodes.map((n) => ({
      ...n,
      position: { ...n.position },
    }));
    setNodes(reset);
    pushHistory(reset);
  }, [pushHistory]);

  const exportJSON = useCallback(() => {
    const data = { ...rawData, nodes };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "flow_data.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [nodes]);

  const handleToggleMode = useCallback(() => {
    setMode((m) => (m === "editor" ? "preview" : "editor"));
    setSelectedNodeId(null);
  }, []);

  // ── selected node 
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) ?? null;

  // ── render 
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-900 text-white">
      <Toolbar
        mode={mode}
        onToggleMode={handleToggleMode}
        onUndo={undo}
        onRedo={redo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onResetLayout={resetLayout}
        onExport={exportJSON}
      />

      <div className="flex flex-1 overflow-hidden">
        {mode === "editor" ? (
          <>
            <Canvas
              nodes={nodes}
              selectedNodeId={selectedNodeId}
              startNodeId={startNodeId}
              onSelectNode={setSelectedNodeId}
              onUpdatePosition={updateNodePosition}
              onCommitPosition={commitPositionHistory}
            />
            {selectedNode && (
              <EditPanel
                key={selectedNode.id}
                node={selectedNode}
                onUpdate={(updates) => updateNode(selectedNode.id, updates)}
                onClose={() => setSelectedNodeId(null)}
              />
            )}
          </>
        ) : (
          <PreviewChat nodes={nodes} startNodeId={startNodeId} />
        )}
      </div>
    </div>
  );
}
