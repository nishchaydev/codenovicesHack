import { useState, useMemo } from 'react'
import { SleekHeader } from './components/layout/SleekHeader'
import { GraphCanvas } from './components/graph/GraphCanvas'
import { NodeInspector } from './components/inspector/NodeInspector'
import { DemoTour } from './components/tour/DemoTour'
import { type PersonaType } from './components/persona/PersonaBar'
import { type VerificationFilter } from './components/metrics/UncertaintyBanner'
import { mockEvents } from './data/mockEvents'
import type { GraphNode, EventDataset } from './types/graph'
import { CheckCircle2 } from 'lucide-react'

export function App() {
  const [persona, setPersona] = useState<PersonaType>('india')
  const [verificationFilter, setVerificationFilter] = useState<VerificationFilter>('all')
  const [activeDatasetId, setActiveDatasetId] = useState<string>('sugar-ethanol-policy-2024')
  const [customDataset, setCustomDataset] = useState<EventDataset | null>(null)
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [isTourOpen, setIsTourOpen] = useState(false)

  // Current active dataset: custom simulation or mock benchmark dataset
  const currentDataset = useMemo<EventDataset>(() => {
    if (customDataset) {
      return customDataset
    }
    const found = mockEvents.find((e) => e.id === activeDatasetId)
    return found || mockEvents[0]
  }, [customDataset, activeDatasetId])

  // Handle Persona preset switch from header dropdown
  const handleSelectPersona = (
    newPersona: PersonaType,
    newDatasetId: string,
    message: string
  ) => {
    setPersona(newPersona)
    setActiveDatasetId(newDatasetId)
    setCustomDataset(null)
    setSelectedNode(null)
    setVerificationFilter('all')

    setToastMessage(message)
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev))
    }, 4000)
  }

  // Handle AI graph generation from header search bar
  const handleGraphGenerated = (newDataset: EventDataset, rootNode: GraphNode | null) => {
    setCustomDataset(newDataset)
    setSelectedNode(rootNode)
    setVerificationFilter('all')

    const message = `Synthesized Impact Graph: "${newDataset.title}" (${newDataset.nodes.length} nodes)`
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev))
    }, 4500)
  }

  return (
    <div className="h-screen w-screen bg-[#ffffff] text-[#141414] flex flex-col font-sans overflow-hidden select-none">
      {/* 1. Floating Status Toast Notification (DESIGN.md ex-toast: canvas fill, hairline border, shadow-none, rounded-full) */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#141414] text-[#ffffff] text-xs font-medium border border-[#262626] animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#0066ff] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 2. Sleek Single Top Bar (Height: 56px, Zero Clutter) */}
      <SleekHeader
        currentPersona={persona}
        onSelectPersona={handleSelectPersona}
        onGraphGenerated={handleGraphGenerated}
        onStartTour={() => setIsTourOpen(true)}
      />

      {/* 3. Canvas-First Main Viewport: Takes 100% of remaining vertical height */}
      <main className="flex-1 w-full h-[calc(100vh-56px)] relative overflow-hidden">
        <GraphCanvas
          dataset={currentDataset}
          selectedNodeId={selectedNode?.id || null}
          verificationFilter={verificationFilter}
          onFilterChange={setVerificationFilter}
          onSelectNode={setSelectedNode}
        />
      </main>

      {/* 4. Slide-over Inspector Sidebar */}
      <NodeInspector
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
      />

      {/* 5. Guided Walkthrough Tour Modal */}
      <DemoTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
      />
    </div>
  )
}

export default App
