import React, { useState, useMemo } from 'react'
import { FinGraphScenario } from '../../types'
import type { GraphNode } from '../../types/fingraph'
import { convertFinGraphScenarioToEventDataset } from '../../lib/scenarioConverter'
import { GraphCanvas } from './GraphCanvas'
import { NodeInspector } from './NodeInspector'
import { type VerificationFilter } from './UncertaintyBanner'

interface FinGraphEngineViewProps {
  scenario: FinGraphScenario
  onToggleViewMode?: () => void
  onOpenStockDrilldown?: (node: any) => void
}

export const FinGraphEngineView: React.FC<FinGraphEngineViewProps> = ({
  scenario,
  onToggleViewMode: _onToggleViewMode,
  onOpenStockDrilldown: _onOpenStockDrilldown,
}) => {
  const [verificationFilter, setVerificationFilter] = useState<VerificationFilter>('all')
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)

  // Convert current active scenario to EventDataset format
  const currentDataset = useMemo(() => {
    return convertFinGraphScenarioToEventDataset(scenario)
  }, [scenario])

  return (
    <div className="relative w-full flex-1 flex flex-col min-h-[580px] h-full select-none">
      {/* Main Canvas Viewport Area */}
      <div className="relative flex-1 w-full min-h-[500px] h-[calc(100vh-215px)] rounded-[24px] overflow-hidden border border-slate-200/90 shadow-md">
        <GraphCanvas
          dataset={currentDataset}
          selectedNodeId={selectedNode?.id || null}
          verificationFilter={verificationFilter}
          onFilterChange={setVerificationFilter}
          onSelectNode={setSelectedNode}
        />

        {/* Slide-over Inspector Sidebar */}
        <NodeInspector
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      </div>
    </div>
  )
}
