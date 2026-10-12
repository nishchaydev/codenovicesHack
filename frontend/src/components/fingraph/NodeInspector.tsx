import React from 'react'
import {
  X,
  ExternalLink,
  ShieldCheck,
  BrainCircuit,
  History,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  Building2,
  Tag,
  LineChart,
  Boxes,
  ScrollText,
  Globe2,
} from 'lucide-react'
import type { GraphNode, EntityClassification, EvidenceItem } from '../../types/fingraph'
import { cn } from '../../lib/utils'
import { MiniPriceChart } from './MiniPriceChart'

interface NodeInspectorProps {
  node: GraphNode | null
  onClose: () => void
  children?: React.ReactNode
}

const getEntityBadgeStyle = (entity: EntityClassification) => {
  switch (entity) {
    case 'Commodity':
      return { icon: Boxes, label: 'Commodity' }
    case 'Macro Indicator':
      return { icon: LineChart, label: 'Macro Indicator' }
    case 'Sector':
      return { icon: Building2, label: 'Sector' }
    case 'Listed Company':
      return { icon: Tag, label: 'Listed Company' }
    case 'Regulatory Policy':
      return { icon: ScrollText, label: 'Regulatory Policy' }
    case 'Geopolitical':
      return { icon: Globe2, label: 'Geopolitical' }
    default:
      return { icon: Tag, label: 'Entity' }
  }
}

const getExchangeLabel = (ticker?: string) => {
  if (!ticker) return null
  if (ticker.startsWith('NSE:')) return 'NSE'
  if (ticker.startsWith('BSE:')) return 'BSE'
  if (ticker.startsWith('NYSE:')) return 'NYSE'
  if (ticker.startsWith('NASDAQ:')) return 'NASDAQ'
  if (ticker.includes('MCX')) return 'MCX (India)'
  if (ticker.includes('COMEX') || ticker.includes('NYMEX')) return 'NYMEX'
  if (ticker.endsWith('.NS')) return 'NSE (India)'
  if (ticker === 'CL=F' || ticker === 'BZ=F') return 'Global Crude'
  if (ticker === 'INR=X') return 'FX (Forex)'
  return 'Global Market'
}

const resolveEvidenceUrl = (item: EvidenceItem): string => {
  if (
    item.url &&
    item.url.startsWith('http') &&
    !item.url.includes('example.com') &&
    item.url.replace(/^https?:\/\/[^/]+/, '').length > 5
  ) {
    return item.url
  }
  const query = `${item.sourceName || ''} ${item.headline || ''}`.trim()
  return `https://news.google.com/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en`
}

const extractDomain = (url: string, sourceName: string): string => {
  try {
    const parsed = new URL(url)
    return parsed.hostname.replace('www.', '')
  } catch {
    const s = sourceName.toLowerCase().replace(/[^a-z0-9]/g, '')
    if (s.includes('reuters')) return 'reuters.com'
    if (s.includes('bloomberg')) return 'bloomberg.com'
    if (s.includes('economic')) return 'economictimes.indiatimes.com'
    if (s.includes('mint')) return 'livemint.com'
    if (s.includes('pib')) return 'pib.gov.in'
    if (s.includes('rbi')) return 'rbi.org.in'
    if (s.includes('ft')) return 'ft.com'
    if (s.includes('wsj')) return 'wsj.com'
    return 'news.google.com'
  }
}

export const NodeInspector: React.FC<NodeInspectorProps> = ({
  node,
  onClose,
  children,
}) => {
  if (!node) return null

  const entityStyle = getEntityBadgeStyle(node.entityType)
  const EntityIcon = entityStyle.icon
  const exchangeLabel = getExchangeLabel(node.tickerSymbol)
  const isObserved = node.truthStatus === 'observed_fact'

  const isPositive = node.impactDirection === 'positive'
  const isNegative = node.impactDirection === 'negative'

  return (
    <aside
      className={cn(
        'absolute top-0 right-0 z-40 h-full w-full sm:w-[420px] md:w-[450px] bg-[#ffffff]',
        'border-l border-[#e0e0e0] flex flex-col shadow-2xl',
        'transition-all duration-200 ease-in-out'
      )}
    >
      {/* 1. Header Panel */}
      <div className="sticky top-0 z-10 border-b border-[#f0f0f0] bg-[#ffffff] px-6 py-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f3f3f3] text-[#141414] text-[11px] font-semibold">
              <EntityIcon className="w-3 h-3 text-[#707070]" />
              <span>{entityStyle.label}</span>
            </span>

            {isObserved ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#edf7ed] text-[#1e4620] text-[11px] font-semibold border border-[#c8e6c9]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1b5e20]" />
                <span>Observed Fact</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fff8e1] text-[#b78103] text-[11px] font-semibold border border-[#ffe082]">
                <BrainCircuit className="w-3.5 h-3.5 text-[#e65100]" />
                <span>Inferred</span>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#f3f3f3] text-[#707070] hover:text-[#141414] hover:bg-[#ebebeb] transition-colors cursor-pointer"
            aria-label="Close Inspector"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Node Title & Magnitude */}
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-base font-semibold text-[#141414] tracking-tight leading-snug">
            {node.label}
          </h2>
          {node.estimatedMagnitude && (
            <span
              className={cn(
                'text-xs font-semibold shrink-0 flex items-center gap-1 px-2.5 py-0.5 rounded-full',
                isPositive && 'bg-[#edf7ed] text-[#1e4620]',
                isNegative && 'bg-[#fdeeed] text-[#5f2120]',
                !isPositive && !isNegative && 'bg-[#f3f3f3] text-[#141414]'
              )}
            >
              {isPositive && <TrendingUp className="w-3 h-3" />}
              {isNegative && <TrendingDown className="w-3 h-3" />}
              {!isPositive && !isNegative && <Minus className="w-3 h-3" />}
              {node.estimatedMagnitude}
            </span>
          )}
        </div>

        {/* Confidence Score Indicator Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="text-[#707070]">Model Confidence</span>
            <span className="font-semibold text-[#141414]">
              {node.confidenceScore}%
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#f0f0f0] overflow-hidden">
            <div
              className="h-full bg-[#141414] transition-all duration-300"
              style={{ width: `${node.confidenceScore}%` }}
            />
          </div>
        </div>

        {/* Quick Ticker Chip */}
        {node.tickerSymbol && (
          <div className="mt-3 flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#f0f0f0] text-[#141414] font-mono text-[11px] font-semibold">
              {node.tickerSymbol}
            </span>
            {exchangeLabel && (
              <span className="text-[11px] text-[#707070] px-2 py-0.5 rounded-full bg-[#f3f3f3]">
                {exchangeLabel}
              </span>
            )}
          </div>
        )}
      </div>

      {/* 2. Scrollable Content Body */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        {/* Time-Series Sparkline / Indicator Slot */}
        <div id="node-price-chart-slot" className="rounded-[20px] border border-[#e0e0e0] bg-[#ffffff] p-4">
          {children ? (
            children
          ) : node.tickerSymbol ? (
            <MiniPriceChart ticker={node.tickerSymbol} />
          ) : (
            <MiniPriceChart fallbackTitle={node.label} />
          )}
        </div>

        {/* Economic Transmission Mechanism */}
        <section className="space-y-2.5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#707070]">
            Transmission Logic
          </h3>

          <div className="rounded-[20px] bg-[#f3f3f3] p-4 text-xs text-[#262626] leading-relaxed space-y-2.5">
            <p className="text-[#141414] font-medium">{node.transmissionLogic}</p>

            <ul className="space-y-1.5 text-[11px] text-[#707070] list-disc list-inside">
              <li>
                <strong className="text-[#141414]">Elasticity:</strong> Direct pass-through along supply chain dependencies.
              </li>
              <li>
                <strong className="text-[#141414]">Market Absorption:</strong> Asset pricing adjusts dynamically to forward expectations.
              </li>
            </ul>
          </div>

          {/* Historical Precedent Box */}
          {node.historicalPrecedent && (
            <div className="rounded-[20px] bg-[#f8f9fa] border border-[#e0e0e0] p-4 flex items-start gap-3">
              <History className="w-4 h-4 text-[#707070] mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-semibold text-[#707070] block mb-0.5">
                  Historical Precedent
                </span>
                <p className="text-xs text-[#141414] font-medium">
                  {node.historicalPrecedent}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Evidence & Source Citations */}
        <section className="space-y-2.5 pb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#707070]">
              Verified Grounding
            </h3>
            <span className="text-[11px] text-[#adadad]">
              {node.evidence?.length || 0} Sources
            </span>
          </div>

          {node.evidence && node.evidence.length > 0 ? (
            <div className="space-y-2">
              {node.evidence.map((item, idx) => {
                const targetUrl = resolveEvidenceUrl(item)
                const domainLabel = extractDomain(targetUrl, item.sourceName)

                return (
                  <a
                    key={idx}
                    href={targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-[16px] bg-[#ffffff] border border-[#e0e0e0] p-3.5 hover:bg-[#f3f3f3] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-[11px] text-[#707070] mb-1.5">
                      <span className="font-semibold text-[#141414] flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1b5e20]" />
                        {item.sourceName}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#f3f3f3] text-[#707070]">
                        {domainLabel}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-[#141414] leading-snug mb-2.5">
                      {item.headline}
                    </p>

                    <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#f0f0f0]">
                      <span className="text-[#adadad]">
                        {item.publishedAt || 'Verified Timestamp'}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[#0066ff] font-medium group-hover:underline">
                        <span>Read Source</span>
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  </a>
                )
              })}
            </div>
          ) : (
            <div className="rounded-[16px] bg-[#f3f3f3] p-4 text-center text-xs text-[#707070]">
              No direct external citations indexed.
            </div>
          )}
        </section>
      </div>
    </aside>
  )
}
