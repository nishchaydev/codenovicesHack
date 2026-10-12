import React, { useMemo, useEffect, useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  ReactFlow,
  Background,
  Controls,
  ControlButton,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  BackgroundVariant,
  type Node,
  type Edge,
  type NodeMouseHandler,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import {
  Maximize2,
  Minimize2,
  RefreshCw,
  GitBranch,
  BarChart3,
  ShieldCheck,
  BrainCircuit,
  ChevronUp,
  ChevronDown,
  Lock,
  Unlock,
  Scan,
} from 'lucide-react'
import type { EventDataset, GraphNode } from '../../types/fingraph'
import { nodeTypes } from './CustomNodes'
import type { VerificationFilter } from './UncertaintyBanner'
import { cn } from '../../lib/utils'

interface GraphCanvasProps {
  dataset: EventDataset
  selectedNodeId?: string | null
  verificationFilter?: VerificationFilter
  onFilterChange?: (filter: VerificationFilter) => void
  onSelectNode: (node: GraphNode | null) => void
}

const InnerGraphCanvas: React.FC<GraphCanvasProps> = ({
  dataset,
  selectedNodeId,
  verificationFilter = 'all',
  onFilterChange,
  onSelectNode,
}) => {
  const { fitView } = useReactFlow()
  const [isMetricsExpanded, setIsMetricsExpanded] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLocked, setIsLocked] = useState(false)

  // Listen for Escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen])

  // Recalibrate Fit View whenever Fullscreen is toggled
  useEffect(() => {
    const timer = setTimeout(() => {
      fitView({ padding: 0.16, duration: 400 })
    }, 120)
    return () => clearTimeout(timer)
  }, [isFullscreen, fitView])

  // 1. Tier-based Horizontal Auto-Layout Calculation Engine
  const { layoutNodes, layoutEdges } = useMemo(() => {
    const rawNodes = dataset.nodes
    const rawEdges = dataset.edges
    const rootId = dataset.rootNodeId

    const directFromRootTargets = new Set(
      rawEdges.filter((e) => e.source === rootId).map((e) => e.target)
    )

    const tierMinus1: GraphNode[] = []
    const tier0: GraphNode[] = []
    const tierPlus1: GraphNode[] = []
    const tierPlus2: GraphNode[] = []

    rawNodes.forEach((node) => {
      if (node.nodeType === 'backward_cause') {
        tierMinus1.push(node)
      } else if (node.nodeType === 'root_event' || node.id === rootId) {
        tier0.push(node)
      } else if (directFromRootTargets.has(node.id)) {
        tierPlus1.push(node)
      } else {
        tierPlus2.push(node)
      }
    })

    const NODE_HEIGHT = 110
    const Y_SPACING = 24
    const BASE_TOP_PADDING = 90

    const calculateYPositions = (count: number) => {
      const totalHeight = count * NODE_HEIGHT + (count - 1) * Y_SPACING
      const startY = Math.max(BASE_TOP_PADDING, 280 - totalHeight / 2)
      return Array.from({ length: count }, (_, i) => startY + i * (NODE_HEIGHT + Y_SPACING))
    }

    const yMinus1 = calculateYPositions(tierMinus1.length)
    const y0 = calculateYPositions(tier0.length)
    const yPlus1 = calculateYPositions(tierPlus1.length)
    const yPlus2 = calculateYPositions(tierPlus2.length)

    const nodeMap = new Map<string, GraphNode>()
    rawNodes.forEach((n) => nodeMap.set(n.id, n))

    const connectedNodeIds = new Set<string>()
    const connectedEdgeIds = new Set<string>()

    if (selectedNodeId) {
      connectedNodeIds.add(selectedNodeId)
      rawEdges.forEach((e) => {
        if (e.source === selectedNodeId) {
          connectedNodeIds.add(e.target)
          connectedEdgeIds.add(e.id)
        }
        if (e.target === selectedNodeId) {
          connectedNodeIds.add(e.source)
          connectedEdgeIds.add(e.id)
        }
      })
    }

    const matchesVerificationFilter = (node: GraphNode) => {
      if (verificationFilter === 'all') return true
      if (verificationFilter === 'facts_only') {
        return node.truthStatus === 'observed_fact' || node.nodeType === 'root_event'
      }
      if (verificationFilter === 'high_confidence') {
        return (node.confidenceScore ?? 100) >= 75 || node.nodeType === 'root_event'
      }
      return true
    }

    const positionedNodes: Node[] = []

    const addPositionedNode = (node: GraphNode, x: number, y: number) => {
      const isSelectedChainDimmed = selectedNodeId ? !connectedNodeIds.has(node.id) : false
      const isFilterDimmed = !matchesVerificationFilter(node)
      const isDimmed = isSelectedChainDimmed || isFilterDimmed

      positionedNodes.push({
        id: node.id,
        type: node.nodeType,
        position: { x, y },
        data: node as any,
        style: {
          opacity: isDimmed ? 0.2 : 1,
          transition: 'all 0.3s ease',
        },
      })
    }

    tierMinus1.forEach((node, idx) => addPositionedNode(node, 50, yMinus1[idx]))
    tier0.forEach((node, idx) => addPositionedNode(node, 450, y0[idx]))
    tierPlus1.forEach((node, idx) => addPositionedNode(node, 850, yPlus1[idx]))
    tierPlus2.forEach((node, idx) => addPositionedNode(node, 1250, yPlus2[idx]))

    // 2. Dynamic Edge Styling
    const styledEdges: Edge[] = rawEdges.map((edge) => {
      const sourceNode = nodeMap.get(edge.source)
      const targetNode = nodeMap.get(edge.target)
      const isNegative = targetNode?.impactDirection === 'negative'
      const isPositive = targetNode?.impactDirection === 'positive'
      const confidence = targetNode?.confidenceScore ?? 100
      const isLowConfidence = confidence < 75

      const strokeColor = isPositive
        ? '#10B981'
        : isNegative
        ? '#F43F5E'
        : '#06B6D4'

      const isSelectedChainDimmed = selectedNodeId ? !connectedEdgeIds.has(edge.id) : false
      const isFilterDimmed =
        (sourceNode && !matchesVerificationFilter(sourceNode)) ||
        (targetNode && !matchesVerificationFilter(targetNode))
      const isDimmed = isSelectedChainDimmed || isFilterDimmed
      const isHighlighted = selectedNodeId ? connectedEdgeIds.has(edge.id) : false

      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        animated: edge.animated || isLowConfidence || isHighlighted,
        label: edge.label,
        type: 'smoothstep',
        style: {
          stroke: strokeColor,
          strokeWidth: isHighlighted ? 3.5 : Math.max(1.5, edge.weight * 2.8),
          strokeDasharray: isLowConfidence ? '6,6' : undefined,
          opacity: isDimmed ? 0.15 : 1,
          transition: 'all 0.3s ease',
        },
        labelStyle: {
          fill: isHighlighted ? '#1e293b' : '#64748b',
          fontSize: 10,
          fontFamily: 'monospace',
          fontWeight: 600,
        },
        labelBgStyle: {
          fill: '#ffffff',
          fillOpacity: 0.95,
          rx: 4,
          ry: 4,
          stroke: isHighlighted ? strokeColor : '#e2e8f0',
          strokeWidth: 1,
        },
        labelBgPadding: [6, 3] as [number, number],
      }
    })

    return { layoutNodes: positionedNodes, layoutEdges: styledEdges }
  }, [dataset, selectedNodeId, verificationFilter])

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutEdges)

  useEffect(() => {
    setNodes(layoutNodes)
    setEdges(layoutEdges)
  }, [layoutNodes, layoutEdges, setNodes, setEdges])

  useEffect(() => {
    const timer = setTimeout(() => {
      fitView({ padding: 0.16, duration: 800 })
    }, 80)
    return () => clearTimeout(timer)
  }, [dataset.id, fitView])

  const handleNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      const foundNode = dataset.nodes.find((n) => n.id === node.id)
      if (foundNode) {
        onSelectNode(foundNode.id === selectedNodeId ? null : foundNode)
      }
    },
    [dataset.nodes, selectedNodeId, onSelectNode]
  )

  const handlePaneClick = useCallback(() => {
    if (selectedNodeId) {
      onSelectNode(null)
    }
  }, [selectedNodeId, onSelectNode])

  const totalNodes = dataset.nodes.length
  const factCount = dataset.nodes.filter((n) => n.truthStatus === 'observed_fact').length
  const factRatio = totalNodes > 0 ? Math.round((factCount / totalNodes) * 100) : 0
  const inferenceRatio = 100 - factRatio
  const totalConfidence = dataset.nodes.reduce((s, n) => s + (n.confidenceScore || 0), 0)
  const avgConfidence = totalNodes > 0 ? (totalConfidence / totalNodes).toFixed(1) : '0'

  const canvasContent = (
    <div
      className={cn(
        "relative w-full overflow-hidden transition-all duration-200 select-none",
        isFullscreen
          ? "fixed inset-0 z-[999999] w-screen h-screen bg-[#ffffff] rounded-none p-3 flex flex-col"
          : "h-full min-h-[500px] bg-[#ffffff] rounded-[24px] border border-slate-200/80 shadow-xs"
      )}
    >
      {/* 0. Active Lock Status Floating Pill */}
      {isLocked && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500 text-white text-xs font-semibold shadow-lg animate-in fade-in slide-in-from-top-1 duration-150">
          <Lock className="w-3.5 h-3.5" />
          <span>Canvas Locked — Panning & Dragging Frozen</span>
          <button
            type="button"
            onClick={() => setIsLocked(false)}
            className="ml-1 px-2 py-0.5 rounded-full bg-white/20 hover:bg-white/30 text-[10px] font-bold text-white transition-colors cursor-pointer"
          >
            Unlock
          </button>
        </div>
      )}

      {/* 1. Floating Top-Center Bar: Verification filter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 p-1 rounded-full bg-[#f3f3f3] border border-[#e0e0e0] shadow-xs">
        <button
          type="button"
          onClick={() => onFilterChange && onFilterChange('all')}
          className={cn(
            'px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer',
            verificationFilter === 'all'
              ? 'bg-[#ffffff] text-[#141414] shadow-2xs'
              : 'text-[#707070] hover:text-[#141414]'
          )}
        >
          All
        </button>

        <button
          type="button"
          onClick={() => onFilterChange && onFilterChange('facts_only')}
          className={cn(
            'flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer',
            verificationFilter === 'facts_only'
              ? 'bg-[#ffffff] text-[#141414] shadow-2xs'
              : 'text-[#707070] hover:text-[#141414]'
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#1b5e20]" />
          <span>Facts Only</span>
        </button>

        <button
          type="button"
          onClick={() => onFilterChange && onFilterChange('high_confidence')}
          className={cn(
            'flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer',
            verificationFilter === 'high_confidence'
              ? 'bg-[#ffffff] text-[#141414] shadow-2xs'
              : 'text-[#707070] hover:text-[#141414]'
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#e65100]" />
          <span>High Conf</span>
        </button>
      </div>

      {/* 2. Top-Left: Scenario Context Tag */}
      <div className="absolute top-4 left-4 z-20 hidden md:flex items-center gap-2 bg-[#f3f3f3] px-3 py-1.5 rounded-full border border-[#e0e0e0] text-xs font-medium text-[#141414] shadow-2xs">
        <GitBranch className="w-3.5 h-3.5 text-blue-600" />
        <span className="font-semibold truncate max-w-[220px]">{dataset.title}</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ffffff] text-[#707070] font-semibold border border-slate-200">
          {dataset.category}
        </span>
      </div>

      {/* 3. Top-Right: Quick Reset / Fit View / Lock / Fullscreen Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        {selectedNodeId && (
          <button
            type="button"
            onClick={() => onSelectNode(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ffffff] hover:bg-[#f3f3f3] border border-[#e0e0e0] text-xs font-semibold text-[#141414] transition-colors cursor-pointer shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#707070]" />
            <span>Reset Focus</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => fitView({ padding: 0.16, duration: 500 })}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ffffff] hover:bg-[#f3f3f3] border border-[#e0e0e0] text-xs font-semibold text-[#141414] transition-all cursor-pointer shadow-2xs"
          title="Fit graph to view bounds"
        >
          <Scan className="w-3.5 h-3.5 text-blue-600" />
          <span>Fit View</span>
        </button>

        <button
          type="button"
          onClick={() => setIsLocked(!isLocked)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer shadow-2xs",
            isLocked
              ? "bg-amber-50 border-amber-300 text-amber-800"
              : "bg-[#ffffff] hover:bg-[#f3f3f3] border-[#e0e0e0] text-[#141414]"
          )}
          title={isLocked ? "Canvas is locked (click to unlock panning/drag)" : "Lock canvas panning & dragging"}
        >
          {isLocked ? (
            <Lock className="w-3.5 h-3.5 text-amber-600" />
          ) : (
            <Unlock className="w-3.5 h-3.5 text-[#707070]" />
          )}
          <span>{isLocked ? "Locked" : "Lock"}</span>
        </button>

        <button
          type="button"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer shadow-2xs",
            isFullscreen
              ? "bg-slate-900 text-white border-slate-900 hover:bg-slate-800"
              : "bg-[#ffffff] hover:bg-[#f3f3f3] border-[#e0e0e0] text-[#141414]"
          )}
          title={isFullscreen ? "Exit Fullscreen (Esc)" : "Full Form / Fullscreen Mode"}
        >
          {isFullscreen ? (
            <>
              <Minimize2 className="w-3.5 h-3.5 text-white" />
              <span>Exit Fullscreen</span>
              <kbd className="px-1 py-0.2 bg-slate-800 border border-slate-700 rounded text-[9px] text-slate-300 font-mono">
                Esc
              </kbd>
            </>
          ) : (
            <>
              <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Full Screen</span>
            </>
          )}
        </button>
      </div>

      {/* 4. Bottom-Left: Collapsible Metrics Bar */}
      <div className="absolute bottom-4 left-4 z-20 flex flex-col items-start gap-1.5">
        <button
          type="button"
          onClick={() => setIsMetricsExpanded(!isMetricsExpanded)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f3f3f3] hover:bg-[#ebebeb] border border-[#e0e0e0] text-xs font-semibold text-[#141414] transition-colors cursor-pointer shadow-2xs"
        >
          <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
          <span>Metrics</span>
          {isMetricsExpanded ? (
            <ChevronDown className="w-3 h-3 text-[#707070]" />
          ) : (
            <ChevronUp className="w-3 h-3 text-[#707070]" />
          )}
        </button>

        {isMetricsExpanded && (
          <div className="flex flex-wrap items-center gap-2 p-2 rounded-[20px] bg-[#ffffff] border border-[#e0e0e0] text-xs animate-in fade-in duration-150 shadow-md">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f3f3f3]">
              <span className="text-[11px] text-[#707070]">Nodes:</span>
              <span className="text-[#141414] font-semibold">{totalNodes}</span>
              <span className="text-[10px] text-[#adadad]">({dataset.edges.length} edges)</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f3f3f3]">
              <ShieldCheck className="w-3 h-3 text-[#1b5e20]" />
              <span className="text-[#141414] font-semibold">{factRatio}% Facts</span>
              <span className="text-[#adadad]">/</span>
              <span className="text-[#707070] font-semibold">{inferenceRatio}% Inferred</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f3f3f3]">
              <BrainCircuit className="w-3 h-3 text-[#0066ff]" />
              <span className="text-[11px] text-[#707070]">Avg Conf:</span>
              <span className="text-[#141414] font-semibold">{avgConfidence}%</span>
            </div>
          </div>
        )}
      </div>

      {/* 5. Main React Flow Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes as any}
        colorMode="light"
        proOptions={{ hideAttribution: true }}
        minZoom={0.2}
        maxZoom={1.8}
        nodesDraggable={!isLocked}
        nodesConnectable={false}
        elementsSelectable={!isLocked}
        panOnDrag={!isLocked}
        zoomOnScroll={!isLocked}
        zoomOnPinch={!isLocked}
        preventScrolling={!isLocked}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.2}
          color="#e0e0e0"
        />

        {/* Docked Canvas Controls with custom Fit View, Fullscreen (Full Form), and Lock button */}
        <Controls
          showInteractive={false}
          showFitView={false}
          className="!bg-[#ffffff] !border-[#e0e0e0] !rounded-[16px] !fill-[#141414] !p-1 !bottom-4 !right-4 !left-auto shadow-md"
        >
          <ControlButton
            onClick={() => fitView({ padding: 0.16, duration: 500 })}
            title="Fit View"
          >
            <Scan className="w-3.5 h-3.5 text-slate-700" />
          </ControlButton>

          <ControlButton
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Exit Fullscreen (Esc)" : "Full Form / Fullscreen Mode"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5 text-blue-600" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5 text-slate-700" />
            )}
          </ControlButton>

          <ControlButton
            onClick={() => setIsLocked(!isLocked)}
            title={isLocked ? "Canvas is Locked (Click to Unlock)" : "Canvas is Unlocked (Click to Lock Panning & Dragging)"}
            className={cn(isLocked && "!bg-amber-100 !text-amber-800")}
          >
            {isLocked ? (
              <Lock className="w-3.5 h-3.5 text-amber-600" />
            ) : (
              <Unlock className="w-3.5 h-3.5 text-slate-700" />
            )}
          </ControlButton>
        </Controls>
      </ReactFlow>
    </div>
  )

  if (isFullscreen) {
    return createPortal(canvasContent, document.body)
  }

  return canvasContent
}

export const GraphCanvas: React.FC<GraphCanvasProps> = (props) => {
  return (
    <ReactFlowProvider>
      <InnerGraphCanvas {...props} />
    </ReactFlowProvider>
  )
}
