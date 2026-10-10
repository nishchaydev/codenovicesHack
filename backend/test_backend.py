import asyncio
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_full_pipeline():
    print("Testing /health ...")
    r = client.get("/health")
    assert r.status_code == 200, f"Health check failed: {r.text}"
    health_data = r.json()
    print(f"Health OK: {health_data['nodes']} nodes, {health_data['edges']} edges")

    print("\nTesting /api/graph ...")
    r = client.get("/api/graph")
    assert r.status_code == 200, f"Graph check failed: {r.text}"
    g = r.json()
    print(f"Graph loaded with {len(g['nodes'])} nodes and {len(g['links'])} links")
    assert len(g['nodes']) >= 20, "Should have at least 20 nodes"

    print("\nTesting /api/scenarios ...")
    r = client.get("/api/scenarios")
    assert r.status_code == 200
    scenarios = r.json()
    print(f"Found {len(scenarios)} preloaded scenarios")

    print("\nTesting /api/stock/AAPL ...")
    r = client.get("/api/stock/AAPL")
    assert r.status_code == 200
    stock_data = r.json()
    print(f"Stock data AAPL: price={stock_data['current_price']}, source={stock_data['data_source']}")

    print("\nTesting /api/simulate (Crude Oil 12% rise - Problem Statement Benchmark) ...")
    sim_payload = {
        "headline": "Crude oil rises 12% after surprise OPEC+ production cuts announced in Vienna",
        "magnitude": 100.0,
        "use_llm": False # Test deterministic pipeline first
    }
    r = client.post("/api/simulate", json=sim_payload)
    assert r.status_code == 200, f"Simulation failed: {r.text}"
    res = r.json()
    print(f"Simulation OK! Event ID: {res['event_id']}, Severity: {res['severity']}")
    print(f"Affected nodes count: {len(res['affected_nodes'])}")
    print(f"Propagation hops count: {len(res['propagation_paths'])}")
    
    # Print top 5 impacted nodes
    sorted_affected = sorted(res['affected_nodes'].items(), key=lambda x: x[1], reverse=True)[:6]
    print("\nTop Impacted Nodes:")
    for nid, score in sorted_affected:
        print(f" - {nid}: {score} shock score")

    print("\nSample Propagation Step:")
    if res['propagation_paths']:
        step = res['propagation_paths'][0]
        print(f"Hop {step['hop']}: {step['source_name']} -> {step['target_name']} | Impact: {step['impact']} | {step['explanation']}")

    print("\nALL BACKEND PIPELINE TESTS PASSED SUCCESS!")

if __name__ == "__main__":
    test_full_pipeline()
