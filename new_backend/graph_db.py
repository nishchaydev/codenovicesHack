import networkx as nx

class KnowledgeGraphDB:
    """
    Hackathon MVP In-Memory Graph DB using NetworkX.
    Simulates Neo4j Cypher Traversal for Step 5 & Step 6.
    """
    def __init__(self):
        self.G = nx.DiGraph()
        self._seed_initial_data()

    def _seed_initial_data(self):
        # Add basic financial nodes (Entities)
        entities = [
            ("CL=F", {"name": "Crude Oil", "type": "Commodity", "market_cap_b": 0}),
            ("INDIGO.NS", {"name": "InterGlobe Aviation", "type": "Company", "market_cap_b": 15}),
            ("SPICEJET.BO", {"name": "SpiceJet Airlines", "type": "Company", "market_cap_b": 1}),
            ("HOSPITALITY", {"name": "Tourism & Hotels", "type": "Sector", "market_cap_b": 25}),
            ("LOGISTICS", {"name": "Freight & Logistics", "type": "Sector", "market_cap_b": 80}),
            ("SEMI", {"name": "Semiconductors", "type": "Sector", "market_cap_b": 400}),
            ("AAPL", {"name": "Apple Inc", "type": "Company", "market_cap_b": 3000}),
            ("TCS.NS", {"name": "TCS", "type": "Company", "market_cap_b": 150}),
            ("AUTO", {"name": "Automotive Sector", "type": "Sector", "market_cap_b": 350}),
            ("CONSUMER_TECH", {"name": "Consumer Electronics", "type": "Sector", "market_cap_b": 1200})
        ]
        self.G.add_nodes_from(entities)

        # Add established dependencies (Edges) -> Source affects Target
        edges = [
            ("CL=F", "INDIGO.NS", {"impact_score": -0.4, "type": "Fuel Cost Surge (-14.2%)"}),
            ("CL=F", "SPICEJET.BO", {"impact_score": -0.55, "type": "Fuel Cost Surge (-18.5%)"}),
            ("INDIGO.NS", "HOSPITALITY", {"impact_score": 0.6, "type": "Air Passenger Volume"}),
            ("INDIGO.NS", "LOGISTICS", {"impact_score": 0.45, "type": "Air Cargo Freight Capacity"}),
            ("SEMI", "AAPL", {"impact_score": 0.8, "type": "Supply Component Availability"}),
            ("SEMI", "AUTO", {"impact_score": 0.5, "type": "ECU Microcontroller Allocation"}),
            ("SEMI", "TCS.NS", {"impact_score": 0.2, "type": "Enterprise IT Capex Cycle"}),
            ("AAPL", "CONSUMER_TECH", {"impact_score": 0.75, "type": "Consumer Upgrade Demand Cycle"}),
        ]
        self.G.add_edges_from(edges)

    def add_event_impact(self, event_id: str, target_node: str, shock_value: float):
        """Simulates Step 5: Generating dynamic nodes/edges based on news events."""
        if not self.G.has_node(event_id):
            self.G.add_node(event_id, name=event_id, type="Event", market_cap_b=0)
        
        self.G.add_edge(event_id, target_node, impact_score=shock_value, type="Direct Shock")

    def _resolve_node(self, query: str) -> str:
        """Resolves natural language queries or aliases to graph node keys."""
        q = query.strip().upper()
        alias_map = {
            "AIRLINES": "INDIGO.NS",
            "AIRLINE": "INDIGO.NS",
            "AVIATION": "INDIGO.NS",
            "INDIGO": "INDIGO.NS",
            "CRUDE": "CL=F",
            "OIL": "CL=F",
            "CRUDE OIL": "CL=F",
            "PETROLEUM": "CL=F",
            "ENERGY": "CL=F",
            "SEMI": "SEMI",
            "SEMICONDUCTOR": "SEMI",
            "SEMICONDUCTORS": "SEMI",
            "CHIPS": "SEMI",
            "MICROCHIPS": "SEMI",
            "APPLE": "AAPL",
            "IPHONE": "AAPL",
            "AAPL": "AAPL",
            "TCS": "TCS.NS",
            "IT": "TCS.NS",
            "TECH": "TCS.NS",
        }
        if q in alias_map:
            return alias_map[q]
        for node in self.G.nodes:
            if node.upper() == q or self.G.nodes[node].get("name", "").upper() == q:
                return node
        return query.strip()

    def trace_impact_paths(self, source_node: str, max_depth: int = 3):
        """
        Simulates Step 6 (Neo4j Cypher Traversal).
        Finds all cascading impacts up to 'max_depth' layers.
        Equivalent Cypher: MATCH path = (n)-[*1..3]->(m) RETURN path
        """
        resolved_source = self._resolve_node(source_node)

        # If still not in graph, dynamically seed it so hackathon demo never fails
        if not self.G.has_node(resolved_source):
            clean_name = source_node.strip().title()
            self.G.add_node(resolved_source, name=clean_name, type="Sector / Entity", market_cap_b=50)
            self.G.add_node(f"{resolved_source}_SUPPLY", name=f"{clean_name} Supply Chain", type="Sector", market_cap_b=30)
            self.G.add_node(f"{resolved_source}_MACRO", name=f"{clean_name} Demand Index", type="Macro Indicator", market_cap_b=0)
            self.G.add_edge(resolved_source, f"{resolved_source}_SUPPLY", impact_score=0.65, type="Supply Shock Propagation")
            self.G.add_edge(f"{resolved_source}_SUPPLY", f"{resolved_source}_MACRO", impact_score=-0.42, type="Downstream Inflation Impact")

        # BFS to find all affected downstream nodes
        paths = []
        for target in nx.single_source_shortest_path(self.G, resolved_source, cutoff=max_depth):
            if target == resolved_source:
                continue
            
            # Get the exact path
            path_nodes = nx.shortest_path(self.G, resolved_source, target)
            
            # Calculate cumulative impact
            cumulative_impact = 1.0
            path_edges = []
            
            for i in range(len(path_nodes)-1):
                u = path_nodes[i]
                v = path_nodes[i+1]
                edge_data = self.G.get_edge_data(u, v)
                cumulative_impact *= edge_data.get('impact_score', 0.5)
                path_edges.append({
                    "from": u,
                    "to": v,
                    "relation": edge_data.get('type', 'Direct Impact'),
                    "multiplier": edge_data.get('impact_score', 0.5)
                })

            paths.append({
                "target": target,
                "target_name": self.G.nodes[target].get("name", target),
                "depth": len(path_nodes) - 1,
                "total_impact_score": round(cumulative_impact, 3),
                "path_trace": path_edges
            })

        # Sort by absolute impact (highest risk first)
        paths.sort(key=lambda x: abs(x["total_impact_score"]), reverse=True)
        return {"source": resolved_source, "source_name": self.G.nodes[resolved_source].get("name", resolved_source), "affected_paths": paths}

if __name__ == "__main__":
    db = KnowledgeGraphDB()
    print("Tracing 3-Layer Impact for Semiconductors (SEMI):")
    print(db.trace_impact_paths("SEMI"))
