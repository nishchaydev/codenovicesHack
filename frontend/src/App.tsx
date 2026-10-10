import React, { useEffect, useState } from "react";
import { GraphData, GraphNode, GraphLink, Scenario, SimulationResponse } from "./types";
import { fetchGraph, fetchScenarios, runSimulation, resetGraph } from "./api";
import { Header } from "./components/Header";
import { AppSelectorBar } from "./components/AppSelectorBar";
import { ScenarioBar } from "./components/ScenarioBar";
import { InteractiveGraph } from "./components/InteractiveGraph";
import { CascadeDrawer } from "./components/CascadeDrawer";
import { SingleAppProfile } from "./components/SingleAppProfile";
import { LinkDetailPanel } from "./components/LinkDetailPanel";

export const App: React.FC = () => {
  const [graphData, setGraphData] = useState<GraphData>({
    nodes: [],
    links: [],
    total_nodes: 0,
    total_links: 0,
  });
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [simulation, setSimulation] = useState<SimulationResponse | null>(null);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [selectedLink, setSelectedLink] = useState<GraphLink | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [devilsAdvocate, setDevilsAdvocate] = useState<boolean>(false);
  const [activeShockEvent, setActiveShockEvent] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"all" | "single">("all");

  // Load Initial Graph & Scenarios
  useEffect(() => {
    fetchGraph()
      .then((data) => setGraphData(data))
      .catch((err) => console.error("Error loading graph:", err));

    fetchScenarios()
      .then((s) => setScenarios(s))
      .catch((err) => console.error("Error loading scenarios:", err));
  }, []);

  // Selected App Node Object
  const selectedAppNode = React.useMemo(() => {
    if (!selectedAppId) return null;
    return graphData.nodes.find((n) => n.id === selectedAppId) || null;
  }, [selectedAppId, graphData.nodes]);

  // Handle Scenario Execution
  const handleSelectScenario = async (scenario: Scenario) => {
    setIsLoading(true);
    setSelectedScenarioId(scenario.id);
    setSelectedLink(null);

    try {
      const res = await runSimulation({
        headline: scenario.headline,
        scenario_id: scenario.id,
        magnitude: 100.0,
      });
      setSimulation(res);
      setGraphData(res.graph);
      setActiveShockEvent(res.headline);
    } catch (err) {
      console.error("Simulation run error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Custom What-If Execution
  const handleSimulateCustom = async (text: string) => {
    setIsLoading(true);
    setSelectedScenarioId(null);
    setSelectedLink(null);

    try {
      const res = await runSimulation({
        headline: text,
        magnitude: 100.0,
      });
      setSimulation(res);
      setGraphData(res.graph);
      setActiveShockEvent(res.headline);
    } catch (err) {
      console.error("Custom simulation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate shock targeted at single app
  const handleSimulateAppShock = async (appName: string, ticker?: string) => {
    const headline = `Critical supply chain disruption and margin shock reported at ${appName}${ticker ? ` (${ticker})` : ""}`;
    await handleSimulateCustom(headline);
  };

  // Handle Reset
  const handleReset = async () => {
    setIsLoading(true);
    try {
      const freshGraph = await resetGraph();
      setGraphData(freshGraph);
      setSimulation(null);
      setSelectedScenarioId(null);
      setSelectedAppId(null);
      setSelectedLink(null);
      setActiveShockEvent(null);
      setViewMode("all");
    } catch (err) {
      console.error("Reset graph error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectApp = (appId: string | null) => {
    setSelectedAppId(appId);
    if (appId) {
      setViewMode("single");
      setSelectedLink(null);
    } else {
      setViewMode("all");
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#ffffff] text-[#141414] font-sans antialiased">
      {/* 1. Header with Mode Toggle & Search */}
      <Header
        nodeCount={graphData.total_nodes || graphData.nodes.length}
        linkCount={graphData.total_links || graphData.links.length}
        activeShockEvent={activeShockEvent}
        onReset={handleReset}
        onSimulateCustom={handleSimulateCustom}
        isLoading={isLoading}
        devilsAdvocate={devilsAdvocate}
        onToggleDevilsAdvocate={() => setDevilsAdvocate((prev) => !prev)}
        viewMode={viewMode}
        onChangeViewMode={(mode) => {
          setViewMode(mode);
          if (mode === "all") setSelectedAppId(null);
        }}
      />

      {/* 2. Single App Selector Carousel */}
      <AppSelectorBar
        nodes={graphData.nodes}
        selectedAppId={selectedAppId}
        onSelectApp={handleSelectApp}
      />

      {/* 3. Pre-loaded Scenario Bar */}
      <ScenarioBar
        scenarios={scenarios}
        selectedScenarioId={selectedScenarioId}
        onSelectScenario={handleSelectScenario}
        isLoading={isLoading}
      />

      {/* 4. Main Canvas & Cascade Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative w-full h-full">
        {/* Left / Center Graph Area */}
        <div className="flex-1 relative h-full w-full p-3">
          <InteractiveGraph
            nodes={graphData.nodes}
            links={graphData.links}
            onSelectNode={(node) => {
              if (node) {
                setSelectedAppId(node.id);
                setViewMode("single");
              } else {
                setSelectedAppId(null);
              }
              setSelectedLink(null);
            }}
            onSelectLink={(link) => {
              setSelectedLink(link);
            }}
            selectedNodeId={selectedAppId}
            selectedAppId={viewMode === "single" ? selectedAppId : null}
          />

          {/* Single App Profile Card */}
          {selectedAppNode && (
            <SingleAppProfile
              app={selectedAppNode}
              allLinks={graphData.links}
              allNodes={graphData.nodes}
              onClose={() => {
                setSelectedAppId(null);
                setViewMode("all");
              }}
              onSimulateAppShock={handleSimulateAppShock}
              onSelectConnectedNode={(nodeId) => setSelectedAppId(nodeId)}
            />
          )}

          {/* Link Detail Inspector */}
          <LinkDetailPanel
            link={selectedLink}
            onClose={() => setSelectedLink(null)}
          />

          {/* Gallery Topology Legend */}
          <div className="absolute bottom-6 left-6 z-10 bg-[#ffffff] border border-[#e0e0e0] px-3.5 py-2.5 rounded-[16px] text-[11px] font-sans text-[#707070] space-y-1 shadow-sm pointer-events-none hidden md:block">
            <div className="text-[10px] font-semibold text-[#141414] pb-1 border-b border-[#f0f0f0]">
              Network Guide
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#141414]" />
                <span className="text-[#262626]">Tech / Chips</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f3f3f3] border border-[#e0e0e0]" />
                <span className="text-[#262626]">Commodities</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0066ff]" />
                <span className="text-[#262626]">Selected App</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                <span className="text-[#262626]">Shock Risk</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Propagation Cascade Drawer */}
        <div className="w-full lg:w-96 h-72 lg:h-full shrink-0 border-t lg:border-t-0">
          <CascadeDrawer
            simulation={simulation}
            devilsAdvocate={devilsAdvocate}
            onSelectNodeById={(id) => {
              setSelectedAppId(id);
              setViewMode("single");
            }}
          />
        </div>
      </div>
    </div>
  );
};
