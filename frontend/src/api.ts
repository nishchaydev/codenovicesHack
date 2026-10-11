import { GraphData, Scenario, SimulationResponse, StockHistory } from "./types";

const API_BASE = "";

export async function fetchGraph(): Promise<GraphData> {
  const res = await fetch(`${API_BASE}/api/graph`);
  if (!res.ok) throw new Error("Failed to fetch knowledge graph");
  return res.json();
}

export async function fetchScenarios(): Promise<Scenario[]> {
  const res = await fetch(`${API_BASE}/api/scenarios`);
  if (!res.ok) throw new Error("Failed to fetch scenarios");
  return res.json();
}

export async function runSimulation(params: {
  headline: string;
  scenario_id?: string;
  magnitude?: number;
  use_llm?: boolean;
}): Promise<SimulationResponse> {
  const res = await fetch(`${API_BASE}/api/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error("Simulation execution failed");
  return res.json();
}

export async function resetGraph(): Promise<GraphData> {
  const res = await fetch(`${API_BASE}/api/reset`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to reset graph");
  return res.json();
}

export async function fetchStockHistory(ticker: string): Promise<StockHistory> {
  const res = await fetch(`${API_BASE}/api/stock/${encodeURIComponent(ticker)}`);
  if (!res.ok) throw new Error(`Failed to fetch history for ${ticker}`);
  return res.json();
}

export async function searchStocks(query: string) {
  const res = await fetch(`${API_BASE}/api/stocks/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Failed to search stocks");
  return res.json();
}

export async function fetchStockProfile(ticker: string) {
  const res = await fetch(`${API_BASE}/api/stocks/${encodeURIComponent(ticker)}/profile`);
  if (!res.ok) throw new Error(`Failed to fetch profile for ${ticker}`);
  return res.json();
}

export async function generateStockScenario(ticker: string, headline?: string) {
  const res = await fetch(`${API_BASE}/api/stocks/scenario`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ticker, headline }),
  });
  if (!res.ok) throw new Error("Failed to generate stock scenario");
  return res.json();
}
