# SupportFlow Visual Builder

A visual decision-tree editor for configuring customer-support chatbot flows. Built with React + Vite, zero graph libraries, and hand-rolled SVG connector logic.

**[Live Demo →]()**  
**[Design File (Figma) →](https://www.figma.com/design/JuVJbkGphV1z5UO13LcPMU/Amalitech---SupportFlow-Visual-Builder?node-id=0-1&t=EW9l65q4wgyWVGoN-1)**

---

## Overview

SupportFlow Visual Builder lets support managers create and test automated conversation flows — without touching a spreadsheet or writing a line of JSON. Nodes representing bot messages are rendered on an infinite canvas, connected by animated SVG Bezier curves. A one-click Preview Mode turns the editor into a live chat simulation.

---

## Features

### Core

| Feature          | Description                                                                                                      |
| ---------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Visual Graph** | Nodes rendered at absolute positions from `flow_data.json`, connected by SVG cubic-Bezier curves with arrowheads |
| **Live Editor**  | Click any node to open the Edit Panel; changes to text and option labels reflect on the canvas instantly         |
| **Preview Mode** | Simulates the end-user chat experience — select answers, traverse the graph, restart at any leaf                 |

### Wildcard Feature — Drag to Reposition Nodes

Managers can drag any node to a new position on the canvas. The SVG connectors recalculate in real time as the card moves.

**Why this feature?** The JSON data only expresses a logical flow — it has no opinion about visual layout. As flows grow, the default auto-layout becomes cluttered and hard to reason about. Drag-to-reposition gives non-technical managers direct control over the canvas without needing a developer to edit coordinate values in JSON. It also directly demonstrates DOM coordinate mastery — computing mouse-delta offsets, translating them to canvas space, and re-drawing SVG paths on every frame — which is precisely the engineering skill this tool exists to showcase.

### Bonus Extras

- **Undo / Redo** — full history stack for all node edits and position changes
- **Reset Layout** — restores all nodes to their original `flow_data.json` positions
- **Export JSON** — downloads the current state (including repositioned nodes and edited text) as a valid `flow_data.json`
- **Add / Remove Options** — extend or trim a node's answer options directly in the Edit Panel
- **Typing Indicator** — subtle animated dots in Preview Mode for a realistic chat feel

---

## Tech Stack

| Layer           | Choice                                                                  |
| --------------- | ----------------------------------------------------------------------- |
| Framework       | React 18                                                                |
| Build tool      | Vite                                                                    |
| Styling         | Tailwind CSS (custom components only — no UI library)                   |
| Graph rendering | Hand-written SVG + DOM coordinates (no react-flow, jsPlumb, or mermaid) |
| State           | React `useState` / `useCallback` — no external state library            |
| Deployment      | Vercel                                                                  |

---

## Local Setup

```bash
# 1. Clone your fork
git clone https://github.com/patiencemanzen/Amalitech-SupportFlow-Visual-Builder
cd AAmalitech-SupportFlow-Visual-Builder

# 2. Install dependencies
npm install

# 3. Run dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Project Structure

```
src/
├── App.jsx                  # Root — owns all state (nodes, mode, history)
├── flow_data.json           # Source-of-truth decision tree data
├── index.css                # Tailwind imports + canvas grid + animations
├── main.jsx                 # React entry point
└── components/
    ├── Canvas.jsx           # Flowchart canvas; drag logic; SVG layer
    ├── EditPanel.jsx        # Right-side edit panel for selected node
    ├── NodeCard.jsx         # Individual draggable node card
    ├── nodeUtils.js         # Geometry helpers (heights, connections, bezier paths)
    ├── PreviewChat.jsx      # Chat-style bot simulation
    └── Toolbar.jsx          # Top navigation bar
```

---

## SVG Connector Logic

Each connection is drawn as a **cubic Bezier curve**:

```
M x1 y1  C x1 midY, x2 midY, x2 y2
```

- `(x1, y1)` — bottom-centre of the parent node  
- `(x2, y2)` — top-centre of the child node  
- Control points share the horizontal midpoint, creating a smooth S-curve

Node heights are estimated from text length and option count so the line origin always appears to leave the card from the bottom, with no library assistance.

---

## Deployment

```bash
npm run build
# Deploy the `dist/` folder to Vercel, Netlify, or any static host
```

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
