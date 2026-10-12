import { FinGraphScenario, RadialCardNode } from '../types'
import {
  EventDataset,
  GraphNode,
  GraphEdge,
  EntityClassification,
  TruthStatus,
  ImpactDirection,
} from '../types/fingraph'

const mapCategoryToEntityType = (
  cat?: string
): EntityClassification => {
  switch (cat) {
    case 'commodity':
      return 'Commodity'
    case 'economic_variable':
      return 'Macro Indicator'
    case 'sector':
      return 'Sector'
    case 'company':
      return 'Listed Company'
    default:
      return 'Sector'
  }
}

export function convertFinGraphScenarioToEventDataset(
  scenario: FinGraphScenario
): EventDataset {
  const rootId = scenario.centerNode.id || 'root-1'
  const nodes: GraphNode[] = []
  const edges: GraphEdge[] = []

  // 1. Synthesize Backward Causes (Tier -1)
  if (scenario.collidingEvent) {
    const { catalystA, catalystB } = scenario.collidingEvent
    nodes.push({
      id: 'bc-1',
      label: catalystA.title,
      description: catalystA.summary,
      nodeType: 'backward_cause',
      entityType: 'Macro Indicator',
      truthStatus: 'observed_fact',
      confidenceScore: 95,
      impactDirection: 'negative',
      estimatedMagnitude: 'Precondition Factor',
      transmissionLogic: `${catalystA.source} reported: ${catalystA.summary}`,
      evidence: [
        {
          sourceName: catalystA.source,
          headline: catalystA.title,
          url: `https://news.google.com/search?q=${encodeURIComponent(catalystA.title)}`,
        },
      ],
    })

    nodes.push({
      id: 'bc-2',
      label: catalystB.title,
      description: catalystB.summary,
      nodeType: 'backward_cause',
      entityType: 'Geopolitical',
      truthStatus: 'observed_fact',
      confidenceScore: 93,
      impactDirection: 'negative',
      estimatedMagnitude: 'Catalytic Pressure',
      transmissionLogic: `${catalystB.source} reported: ${catalystB.summary}`,
      evidence: [
        {
          sourceName: catalystB.source,
          headline: catalystB.title,
          url: `https://news.google.com/search?q=${encodeURIComponent(catalystB.title)}`,
        },
      ],
    })

    edges.push({
      id: 'e-bc1-root',
      source: 'bc-1',
      target: rootId,
      label: 'Causal Precondition',
      weight: 0.94,
      animated: true,
    })

    edges.push({
      id: 'e-bc2-root',
      source: 'bc-2',
      target: rootId,
      label: 'Geopolitical Catalyst Collision',
      weight: 0.91,
      animated: true,
    })
  } else {
    // Fallback backward causes
    nodes.push({
      id: 'bc-1',
      label: `${scenario.centerNode.title} Supply Constraint`,
      description: 'Upstream supply and pricing buffer depletion across benchmark channels.',
      nodeType: 'backward_cause',
      entityType: 'Macro Indicator',
      truthStatus: 'observed_fact',
      confidenceScore: 94,
      impactDirection: 'negative',
      estimatedMagnitude: 'Elevated Benchmark',
      transmissionLogic: 'Macroeconomic backdrop forcing systemic transmission into regional supply chains.',
      evidence: [
        {
          sourceName: scenario.source || 'Bloomberg Terminal',
          headline: `${scenario.title} - Global Macro Telemetry`,
          url: scenario.sourceUrl || 'https://news.google.com',
        },
      ],
    })

    nodes.push({
      id: 'bc-2',
      label: 'Cross-Border Trade Flows',
      description: 'Physical transport routes and inventory restocking cycles adjust to international tensions.',
      nodeType: 'backward_cause',
      entityType: 'Commodity',
      truthStatus: 'observed_fact',
      confidenceScore: 90,
      impactDirection: 'neutral',
      estimatedMagnitude: 'Trade Friction',
      transmissionLogic: 'Logistics and freight tariff adjustments preceding broader price reaction.',
      evidence: [
        {
          sourceName: 'Financial Feeds',
          headline: 'Shipping and Freight Rate Adjustments',
          url: 'https://news.google.com',
        },
      ],
    })

    edges.push({
      id: 'e-bc1-root',
      source: 'bc-1',
      target: rootId,
      label: 'Upstream Supply Strain',
      weight: 0.92,
      animated: true,
    })

    edges.push({
      id: 'e-bc2-root',
      source: 'bc-2',
      target: rootId,
      label: 'Physical Flow Distortion',
      weight: 0.88,
      animated: true,
    })
  }

  // 2. Synthesize Root Catalyst Node (Tier 0)
  const centerNode = scenario.centerNode
  const rootDirection: ImpactDirection =
    centerNode.metricColor === 'green'
      ? 'positive'
      : centerNode.metricColor === 'blue'
      ? 'neutral'
      : 'negative'

  nodes.push({
    id: rootId,
    label: centerNode.title,
    description: scenario.narrative || centerNode.subtitle,
    nodeType: 'root_event',
    entityType: mapCategoryToEntityType(centerNode.category),
    truthStatus: 'observed_fact',
    confidenceScore: 98,
    impactDirection: rootDirection,
    estimatedMagnitude: centerNode.metric,
    tickerSymbol: centerNode.tickers?.[0] || 'CL=F',
    transmissionLogic:
      centerNode.causalReason ||
      'Primary catalyst driving cross-asset repricing across downstream sectors.',
    evidence: scenario.evidenceSources.map((ev) => ({
      sourceName: ev.source,
      headline: ev.title,
      url: `https://news.google.com/search?q=${encodeURIComponent(ev.title)}`,
      publishedAt: ev.date,
    })),
    historicalPrecedent: scenario.dropdownLabel,
  })

  // 3. Synthesize Forward Impacts (Tier +1 and Tier +2)
  const radialNodes = scenario.radialNodes || []
  const tier1NodeIds: string[] = []

  radialNodes.forEach((rNode, idx) => {
    const isP1 = rNode.priority === 'P1 Critical' || idx < 4
    const truthStatus: TruthStatus = isP1 ? 'observed_fact' : 'inferred_relationship'
    const direction: ImpactDirection =
      rNode.metricColor === 'green'
        ? 'positive'
        : rNode.metricColor === 'blue'
        ? 'neutral'
        : 'negative'

    nodes.push({
      id: rNode.id,
      label: rNode.title,
      description: rNode.subtitle,
      nodeType: 'forward_impact',
      entityType: mapCategoryToEntityType(rNode.category),
      truthStatus,
      confidenceScore: rNode.impactScore || (isP1 ? 92 : 84),
      impactDirection: direction,
      estimatedMagnitude: rNode.metric,
      tickerSymbol: rNode.tickers?.[0],
      transmissionLogic:
        rNode.causalReason ||
        `Direct operational and margin exposure propagating from ${centerNode.title}.`,
      evidence: (rNode.refLinks || []).map((l) => ({
        sourceName: l.publisher,
        headline: l.title,
        url: l.url,
      })),
      historicalPrecedent: rNode.timeHorizon
        ? `Transmission Horizon: ${rNode.timeHorizon}`
        : undefined,
    })

    tier1NodeIds.push(rNode.id)

    // Direct edge from root to tier 1
    edges.push({
      id: `e-root-${rNode.id}`,
      source: rootId,
      target: rNode.id,
      label: rNode.timeHorizon ? `${rNode.timeHorizon} pass-through` : 'Direct Propagation',
      weight: isP1 ? 0.92 : 0.82,
      animated: isP1,
    })

    // If node has extended children (satellite 2nd order nodes)
    if (rNode.extendedChildren && rNode.extendedChildren.length > 0) {
      rNode.extendedChildren.forEach((child) => {
        nodes.push({
          id: child.id,
          label: child.title,
          description: child.subtitle,
          nodeType: 'forward_impact',
          entityType: mapCategoryToEntityType(child.category),
          truthStatus: 'inferred_relationship',
          confidenceScore: 78,
          impactDirection: child.metricColor === 'green' ? 'positive' : 'negative',
          estimatedMagnitude: child.metric,
          tickerSymbol: child.tickers?.[0],
          transmissionLogic: child.causalReason || `Secondary ripple exposure following ${rNode.title}.`,
          evidence: [],
        })

        edges.push({
          id: `e-${rNode.id}-${child.id}`,
          source: rNode.id,
          target: child.id,
          label: '2nd-Order Ripple',
          weight: 0.72,
          animated: true,
        })
      })
    }
  })

  // 4. Map cross-pathway hops into graph edges if available
  if (scenario.pathways && scenario.pathways.length > 0) {
    scenario.pathways.forEach((hop, idx) => {
      // Find matching source and target node
      const srcNode = nodes.find(
        (n) =>
          n.label.toLowerCase().includes(hop.source.toLowerCase()) ||
          hop.source.toLowerCase().includes(n.label.toLowerCase())
      )
      const tgtNode = nodes.find(
        (n) =>
          n.label.toLowerCase().includes(hop.target.toLowerCase()) ||
          hop.target.toLowerCase().includes(n.label.toLowerCase())
      )

      if (srcNode && tgtNode && srcNode.id !== tgtNode.id) {
        const edgeId = `e-path-${srcNode.id}-${tgtNode.id}-${idx}`
        const exists = edges.some(
          (e) => (e.source === srcNode.id && e.target === tgtNode.id) || e.id === edgeId
        )
        if (!exists) {
          edges.push({
            id: edgeId,
            source: srcNode.id,
            target: tgtNode.id,
            label: hop.timeframe ? `${hop.timeframe}: ${hop.impactLabel}` : hop.impactLabel,
            weight: 0.85,
            animated: true,
          })
        }
      }
    })
  }

  // Detect market region
  const isIndia =
    scenario.title.toLowerCase().includes('rbi') ||
    scenario.title.toLowerCase().includes('india') ||
    scenario.title.toLowerCase().includes('ethanol') ||
    scenario.title.toLowerCase().includes('sugar') ||
    radialNodes.some((n) => n.tickers?.some((t) => t.includes('.NS')))

  return {
    id: scenario.id,
    title: scenario.title,
    market: isIndia ? 'india' : 'global',
    category: scenario.dropdownLabel || 'Macro Shock',
    summary: scenario.narrative,
    rootNodeId: rootId,
    nodes,
    edges,
  }
}
