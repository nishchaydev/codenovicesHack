import React, { useMemo, useEffect, useCallback, useState } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
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
  RefreshCw,
  GitBranch,
  BarChart3,
  ShieldCheck,
  BrainCircuit,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'
import type { EventDataset, GraphNode } from '../../types/graph'
import { nodeTypes } from './CustomNodes'
import type { VerificationFilter } from '../metrics/UncertaintyBanner'
import { cn } from '../../lib/utils'

interface GraphCanvasProps {
  dataset: EventDataset
  selectedNodeId?: string | null
  verificationFilter?: VerificationFilter
  onFilterChange?: (filter: VerificationFilter) => void
  onSelectNode: (node: GraphNode | null) => void
}

// Inner canvas component wrapped in ReactFlowProvider
const InnerGraphCanvas: React.FC<GraphCanvasProps> = ({
  dataset,
  selectedNodeId,
  verificationFilter = 'all',
  onFilterChange,
  onSelectNode,
}) => {
  const { fitView } = useReactFlow()
  const [isMetricsExpanded, setIsMetricsExpanded] = useState(true)

  // -------------------------------------------------------------------------
  // 1. Tier-based Horizontal Auto-Layout Calculation Engine
  // -------------------------------------------------------------------------
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

    // Y-spacing: evenly distribute compact sibling nodes vertically
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

    // -------------------------------------------------------------------------
    // 2. Dynamic Edge Styling & Color Transmission
    // -------------------------------------------------------------------------
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
          fill: isHighlighted ? '#F8FAFC' : '#94A3B8',
          fontSize: 10,
          fontFamily: 'monospace',
          fontWeight: 600,
        },
        labelBgStyle: {
          fill: '#0F172A',
          fillOpacity: 0.9,
          rx: 4,
          ry: 4,
          stroke: isHighlighted ? strokeColor : '#1E293B',
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

  // Center canvas automatically on load and dataset change
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

  // Metric calculation helpers
  const totalNodes = dataset.nodes.length
  const factCount = dataset.nodes.filter((n) => n.truthStatus === 'observed_fact').length
  const factRatio = totalNodes > 0 ? Math.round((factCount / totalNodes) * 100) : 0
  const inferenceRatio = 100 - factRatio
  const totalConfidence = dataset.nodes.reduce((s, n) => s + (n.confidenceScore || 0), 0)
  const avgConfidence = totalNodes > 0 ? (totalConfidence / totalNodes).toFixed(1) : '0'

  return (
    <div className="relative w-full h-[calc(100vh-64px)] bg-[#ffffff] overflow-hidden">
      {/* 1. Floating Top-Center Bar: DESIGN.md segmented-control in #f3f3f3 with white active pill */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 p-1 rounded-full bg-[#f3f3f3] border border-[#e0e0e0]">
        <button
          type="button"
          onClick={() => onFilterChange && onFilterChange('all')}
          className={cn(
            'px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer',
            verificationFilter === 'all'
              ? 'bg-[#ffffff] text-[#141414]'
              : 'text-[#707070] hover:text-[#141414]'
          )}
        >
          All
        </button>

        <button
          type="button"
          onClick={() => onFilterChange && onFilterChange('facts_only')}
          className={cn(
            'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer',
            verificationFilter === 'facts_only'
              ? 'bg-[#ffffff] text-[#141414]'
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
            'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer',
            verificationFilter === 'high_confidence'
              ? 'bg-[#ffffff] text-[#141414]'
              : 'text-[#707070] hover:text-[#141414]'
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#e65100]" />
          <span>High Confidence</span>
        </button>
      </div>

      {/* 2. Top-Left: Scenario Context Tag (pill-soft in #f3f3f3) */}
      <div className="absolute top-4 left-6 z-20 hidden md:flex items-center gap-2.5 bg-[#f3f3f3] px-3.5 py-2 rounded-full border border-[#e0e0e0] text-xs font-medium text-[#141414]">
        <GitBranch className="w-3.5 h-3.5 text-[#707070]" />
        <span className="font-semibold truncate max-w-xs">{dataset.title}</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ffffff] text-[#707070] font-semibold">
          {dataset.category}
        </span>
      </div>

      {/* 3. Top-Right: Quick Reset / Fit View Controls (button-outline: #ffffff fill, #e0e0e0 border, rounded-full) */}
      <div className="absolute top-4 right-6 z-20 flex items-center gap-2">
        {selectedNodeId && (
          <button
            type="button"
            onClick={() => onSelectNode(null)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#ffffff] hover:bg-[#f3f3f3] border border-[#e0e0e0] text-xs font-semibold text-[#141414] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#707070]" />
            <span>Reset Focus</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => fitView({ padding: 0.16, duration: 500 })}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#ffffff] hover:bg-[#f3f3f3] border border-[#e0e0e0] text-xs font-semibold text-[#141414] transition-all cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5 text-[#707070]" />
          <span>Fit View</span>
        </button>
      </div>

      {/* 4. Bottom-Left: Collapsible Metrics Bar in Mobbin styling */}
      <div className="absolute bottom-6 left-6 z-20 flex flex-col items-start gap-1.5">
        <button
          type="button"
          onClick={() => setIsMetricsExpanded(!isMetricsExpanded)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f3f3f3] hover:bg-[#ebebeb] border border-[#e0e0e0] text-xs font-semibold text-[#141414] transition-colors cursor-pointer"
        >
          <BarChart3 className="w-3.5 h-3.5 text-[#707070]" />
          <span>Metrics</span>
          {isMetricsExpanded ? (
            <ChevronDown className="w-3 h-3 text-[#707070]" />
          ) : (
            <ChevronUp className="w-3 h-3 text-[#707070]" />
          )}
        </button>

        {isMetricsExpanded && (
          <div className="flex flex-wrap items-center gap-2 p-2 rounded-[20px] bg-[#ffffff] border border-[#e0e0e0] text-xs animate-in fade-in duration-150">
            {/* Stat 1 */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f3f3f3]">
              <span className="text-[11px] text-[#707070]">Nodes:</span>
              <span className="text-[#141414] font-semibold">{totalNodes}</span>
              <span className="text-[10px] text-[#adadad]">({dataset.edges.length} edges)</span>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f3f3f3]">
              <ShieldCheck className="w-3 h-3 text-[#1b5e20]" />
              <span className="text-[#141414] font-semibold">{factRatio}% Facts</span>
              <span className="text-[#adadad]">/</span>
              <span className="text-[#707070] font-semibold">{inferenceRatio}% Inferences</span>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f3f3f3]">
              <BrainCircuit className="w-3 h-3 text-[#0066ff]" />
              <span className="text-[11px] text-[#707070]">Avg Confidence:</span>
              <span className="text-[#141414] font-semibold">{avgConfidence}%</span>
            </div>
          </div>
        )}
      </div>

      {/* 5. Main React Flow Canvas (Gallery-White mode) */}
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
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.2}
          color="#e0e0e0"
        />

        <Controls className="!bg-[#ffffff] !border-[#e0e0e0] !rounded-[16px] !fill-[#141414] !p-1 !bottom-6 !right-6 !left-auto" />

        <MiniMap
          nodeStrokeColor={(n) => {
            if (n.type === 'root_event') return '#141414'
            if (n.type === 'backward_cause') return '#707070'
            return '#0066ff'
          }}
          nodeColor="#f3f3f3"
          maskColor="rgba(255, 255, 255, 0.7)"
          className="!bg-[#ffffff] !border !border-[#e0e0e0] !rounded-[16px] !overflow-hidden !bottom-20 !right-6"
        />
      </ReactFlow>
    </div>
  )

}

export const GraphCanvas: React.FC<GraphCanvasProps> = (props) => {
  return (
    <ReactFlowProvider>
      <InnerGraphCanvas {...props} />
    </ReactFlowProvider>
  )
}
