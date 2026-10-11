import { memo } from 'react'
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Tag,
  Building2,
  Globe2,
  LineChart,
  Boxes,
  ScrollText,
  CheckCircle2,
} from 'lucide-react'
import type { GraphNode, EntityClassification } from '../../types/graph'
import { cn } from '../../lib/utils'

export type CustomGraphNode = Node<GraphNode>

// Minimalist Entity Badge mapping (Mobbin Design: soft tints, neutral pills)
const getEntityBadgeStyle = (entity: EntityClassification) => {
  switch (entity) {
    case 'Commodity':
      return { label: 'Commodity', icon: Boxes }
    case 'Macro Indicator':
      return { label: 'Macro', icon: LineChart }
    case 'Sector':
      return { label: 'Sector', icon: Building2 }
    case 'Listed Company':
      return { label: 'Company', icon: Tag }
    case 'Regulatory Policy':
      return { label: 'Policy', icon: ScrollText }
    case 'Geopolitical':
      return { label: 'Geopolitics', icon: Globe2 }
    default:
      return { label: 'Entity', icon: Tag }
  }
}

// =========================================================================
// 1. RootEventNode: Epicenter Catalyst (Mobbin Featured Surface: #f3f3f3, 1.5px #141414 border, rounded-[20px])
// =========================================================================
export const RootEventNode = memo(({ data, selected }: NodeProps<CustomGraphNode>) => {
  const nodeData = data as unknown as GraphNode
  const entityStyle = getEntityBadgeStyle(nodeData.entityType)
  const EntityIcon = entityStyle.icon

  return (
    <div
      title="Click to inspect evidence & time-series"
      className={cn(
        'group relative w-[250px] rounded-[20px] bg-[#f3f3f3] p-3.5 transition-all duration-150 cursor-pointer',
        'border-2 border-[#141414]',
        'hover:bg-[#ebebeb]',
        selected && 'ring-2 ring-[#141414] ring-offset-2 ring-offset-[#ffffff]'
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !-left-1.5 !bg-[#141414] !border-2 !border-[#ffffff]"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !-right-1.5 !bg-[#141414] !border-2 !border-[#ffffff]"
      />

      {/* Row 1: Header (Entity Tag + Truth Dot) */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#e0e0e0]">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ffffff] text-[#141414] text-[11px] font-semibold border border-[#e0e0e0]">
          <EntityIcon className="w-3 h-3 text-[#707070]" />
          <span>{entityStyle.label}</span>
        </div>

        {/* Truth Pill */}
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#ffffff] border border-[#e0e0e0] text-[10px] font-medium text-[#141414]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1b5e20]" />
          <span>Fact</span>
        </div>
      </div>

      {/* Row 2: Headline (Strict 2 Lines, Truncated) */}
      <h3 className="text-xs font-semibold text-[#141414] tracking-tight leading-snug line-clamp-2 h-8 flex items-center">
        {nodeData.label}
      </h3>

      {/* Row 3: Bottom Pill Lockup */}
      <div className="mt-2.5 pt-2 border-t border-[#e0e0e0] flex items-center justify-between">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#141414] text-[#ffffff] text-[10px] font-semibold">
          Root Catalyst
        </span>

        {nodeData.estimatedMagnitude && (
          <span className="text-[11px] font-semibold text-[#141414]">
            {nodeData.estimatedMagnitude}
          </span>
        )}
      </div>
    </div>
  )
})

// =========================================================================
// 2. BackwardCauseNode: Upstream Verified Fact (#ffffff canvas, 1px #e0e0e0 hairline, rounded-[20px])
// =========================================================================
export const BackwardCauseNode = memo(({ data, selected }: NodeProps<CustomGraphNode>) => {
  const nodeData = data as unknown as GraphNode
  const entityStyle = getEntityBadgeStyle(nodeData.entityType)
  const EntityIcon = entityStyle.icon
  const isObserved = nodeData.truthStatus === 'observed_fact'

  return (
    <div
      title="Click to inspect evidence & time-series"
      className={cn(
        'group relative w-[240px] rounded-[20px] bg-[#ffffff] p-3.5 transition-all duration-150 cursor-pointer',
        'border border-[#e0e0e0]',
        'hover:border-[#141414] hover:bg-[#fafafa]',
        selected && 'ring-2 ring-[#141414] ring-offset-2 ring-offset-[#ffffff]'
      )}
    >
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !-right-1.5 !bg-[#141414] !border-2 !border-[#ffffff]"
      />

      {/* Row 1: Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#f0f0f0]">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f3f3f3] text-[#141414] text-[11px] font-semibold">
          <EntityIcon className="w-3 h-3 text-[#707070]" />
          <span>{entityStyle.label}</span>
        </div>

        {/* Truth Dot */}
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#f3f3f3] text-[10px] font-medium text-[#707070]">
          <span
            className={cn(
              'w-1.5 h-1.5 rounded-full',
              isObserved ? 'bg-[#1b5e20]' : 'bg-[#e65100]'
            )}
          />
          <span>{isObserved ? 'Fact' : 'Inferred'}</span>
        </div>
      </div>

      {/* Row 2: Headline */}
      <h4 className="text-xs font-semibold text-[#141414] tracking-tight leading-snug line-clamp-2 h-8 flex items-center">
        {nodeData.label}
      </h4>

      {/* Row 3: Bottom Metric */}
      <div className="mt-2.5 pt-2 border-t border-[#f0f0f0] flex items-center justify-between">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#f3f3f3] text-[#141414] text-[10px] font-medium">
          <CheckCircle2 className="w-3 h-3 text-[#707070]" />
          <span>Verified Driver</span>
        </span>

        {nodeData.tickerSymbol ? (
          <span className="text-[10px] font-mono text-[#141414] px-2 py-0.5 rounded-full bg-[#f0f0f0]">
            {nodeData.tickerSymbol}
          </span>
        ) : (
          <span className="text-[10px] text-[#707070] font-medium">
            {nodeData.confidenceScore}% Valid
          </span>
        )}
      </div>
    </div>
  )
})

// =========================================================================
// 3. ForwardImpactNode: Downstream Asset Impact (#ffffff canvas, #e0e0e0 hairline, rounded-[20px])
// =========================================================================
export const ForwardImpactNode = memo(({ data, selected }: NodeProps<CustomGraphNode>) => {
  const nodeData = data as unknown as GraphNode
  const entityStyle = getEntityBadgeStyle(nodeData.entityType)
  const EntityIcon = entityStyle.icon

  const direction = nodeData.impactDirection || 'neutral'
  const isPositive = direction === 'positive'
  const isNegative = direction === 'negative'
  const isObserved = nodeData.truthStatus === 'observed_fact'

  return (
    <div
      title="Click to inspect evidence & time-series"
      className={cn(
        'group relative w-[240px] rounded-[20px] bg-[#ffffff] p-3.5 transition-all duration-150 cursor-pointer',
        'border border-[#e0e0e0]',
        'hover:border-[#141414] hover:bg-[#fafafa]',
        selected && 'ring-2 ring-[#141414] ring-offset-2 ring-offset-[#ffffff]'
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !-left-1.5 !bg-[#141414] !border-2 !border-[#ffffff]"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !-right-1.5 !bg-[#141414] !border-2 !border-[#ffffff]"
      />

      {/* Row 1: Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#f0f0f0]">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f3f3f3] text-[#141414] text-[11px] font-semibold">
          <EntityIcon className="w-3 h-3 text-[#707070]" />
          <span>{entityStyle.label}</span>
        </div>

        {/* Truth Dot */}
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#f3f3f3] text-[10px] font-medium text-[#707070]">
          <span
            className={cn(
              'w-1.5 h-1.5 rounded-full',
              isObserved ? 'bg-[#1b5e20]' : 'bg-[#e65100]'
            )}
          />
          <span>{isObserved ? 'Fact' : 'Inferred'}</span>
        </div>
      </div>

      {/* Row 2: Headline */}
      <h4 className="text-xs font-semibold text-[#141414] tracking-tight leading-snug line-clamp-2 h-8 flex items-center">
        {nodeData.label}
      </h4>

      {/* Row 3: Bottom Direction Badge & Asset Pill */}
      <div className="mt-2.5 pt-2 border-t border-[#f0f0f0] flex items-center justify-between">
        {/* Polarity Pill (Subtle tint ladder) */}
        <span
          className={cn(
            'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold',
            isPositive && 'bg-[#edf7ed] text-[#1e4620] border border-[#c8e6c9]',
            isNegative && 'bg-[#fdeeed] text-[#5f2120] border border-[#ffcdd2]',
            !isPositive && !isNegative && 'bg-[#f3f3f3] text-[#141414]'
          )}
        >
          {isPositive && <TrendingUp className="w-3 h-3 text-[#1e4620]" />}
          {isNegative && <TrendingDown className="w-3 h-3 text-[#5f2120]" />}
          {!isPositive && !isNegative && <Minus className="w-3 h-3 text-[#707070]" />}
          <span>{nodeData.estimatedMagnitude || (isPositive ? '+Bullish' : isNegative ? '-Bearish' : 'Neutral')}</span>
        </span>

        {/* Ticker or Confidence Pill */}
        {nodeData.tickerSymbol ? (
          <span className="text-[10px] font-mono text-[#141414] px-2 py-0.5 rounded-full bg-[#f0f0f0]">
            {nodeData.tickerSymbol}
          </span>
        ) : (
          <span className="text-[10px] text-[#707070] font-medium">
            {nodeData.confidenceScore}% Conf
          </span>
        )}
      </div>
    </div>
  )
})

export const customNodeTypes = {
  root_event: RootEventNode,
  backward_cause: BackwardCauseNode,
  forward_impact: ForwardImpactNode,
}

export const nodeTypes = customNodeTypes
