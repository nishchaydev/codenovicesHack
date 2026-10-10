import networkx as nx
from typing import Dict, List, Tuple, Set
from graph.models import PropagationStep, GraphNode, GraphLink, GraphData

def propagate_shock(
    graph: nx.DiGraph,
    event_node_id: str,
    initial_shock: float = 100.0,
    threshold: float = 4.0,
    initial_sentiment: int = -1
) -> Tuple[Dict[str, float], List[PropagationStep], Dict[str, int]]:
    """
    Executes a Multi-Hop BFS Decay shock propagation through the network.
    
    Args:
        graph: NetworkX directed graph
        event_node_id: Source node triggering the event
        initial_shock: Starting magnitude (default 100)
        threshold: Minimum shock value before attenuation halts
        initial_sentiment: -1 (bearish/shock) or 1 (bullish/stimulus)

    Returns:
        impact_scores: Dict[node_id, shock_value]
        propagation_steps: List of ordered propagation steps explaining each hop
        node_sentiments: Dict[node_id, directional_sentiment] (-1 or 1)
    """
    impact_scores: Dict[str, float] = {event_node_id: initial_shock}
    node_sentiments: Dict[str, int] = {event_node_id: initial_sentiment}
    propagation_steps: List[PropagationStep] = []
    
    # Queue entries: (current_node_id, current_impact, current_sentiment, hop_number)
    queue: List[Tuple[str, float, int, int]] = [(event_node_id, initial_shock, initial_sentiment, 0)]
    visited_edges: Set[Tuple[str, str]] = set()

    while queue:
        curr_id, curr_impact, curr_sentiment, hop = queue.pop(0)

        # Explore outgoing edges
        successors = list(graph.successors(curr_id))
        
        # Also include undirected correlation neighbors if any with scaled attenuation
        for target_id in successors:
            edge_key = (curr_id, target_id)
            if edge_key in visited_edges:
                continue
            visited_edges.add(edge_key)

            edge_data = graph[curr_id][target_id]
            weight = edge_data.get("weight", 0.7)
            confidence = edge_data.get("confidence", 0.85)
            explanation = edge_data.get("explanation", "Inter-sector market transmission channel")
            edge_sentiment_mult = edge_data.get("sentiment", 1)
            rel_type = edge_data.get("type", "AFFECTS")

            # Impact decay formula: parent_impact * weight * confidence
            transmitted_impact = round(curr_impact * weight * (0.8 + 0.2 * confidence), 2)

            if transmitted_impact >= threshold:
                # Directional sentiment: if edge represents positive correlation, sentiment propagates as is;
                # if edge represents negative transmission (cost-input), sentiment inverts.
                # E.g. Oil price shock (-1 for economy) * edge_sentiment(-1 cost) = -1 (losses for airlines)
                target_sentiment = curr_sentiment * (1 if edge_sentiment_mult >= 0 else -1)

                # If node already visited, accumulate shock non-linearly
                if target_id in impact_scores:
                    impact_scores[target_id] = min(100.0, round(impact_scores[target_id] + transmitted_impact * 0.4, 2))
                else:
                    impact_scores[target_id] = transmitted_impact
                    node_sentiments[target_id] = target_sentiment
                    queue.append((target_id, transmitted_impact, target_sentiment, hop + 1))

                source_name = graph.nodes[curr_id].get("name", curr_id)
                target_name = graph.nodes[target_id].get("name", target_id)

                propagation_steps.append(
                    PropagationStep(
                        source_id=curr_id,
                        source_name=source_name,
                        target_id=target_id,
                        target_name=target_name,
                        impact=transmitted_impact,
                        sentiment=target_sentiment,
                        confidence=confidence,
                        relation=rel_type,
                        explanation=explanation,
                        hop=hop + 1
                    )
                )

    return impact_scores, propagation_steps, node_sentiments

def enrich_graph_with_scores(
    graph: nx.DiGraph,
    impact_scores: Dict[str, float],
    node_sentiments: Dict[str, int],
    propagation_steps: List[PropagationStep]
) -> GraphData:
    """Updates node risk scores and link active statuses for frontend rendering."""
    active_edge_keys = {(step.source_id, step.target_id) for step in propagation_steps}
    
    # Calculate PageRank on the graph structure for systemic importance
    try:
        pagerank_scores = nx.pagerank(graph, weight="weight")
    except Exception:
        pagerank_scores = {node: 1.0 / len(graph.nodes) for node in graph.nodes}

    nodes: List[GraphNode] = []
    for node_id, data in graph.nodes(data=True):
        risk = impact_scores.get(node_id, 0.0)
        sent = node_sentiments.get(node_id, 0)
        pr_weight = pagerank_scores.get(node_id, 0.05) * 100
        
        # Base visual size influenced by baseline val + pagerank
        base_val = data.get("val", 14.0)
        display_val = round(base_val + pr_weight * 0.5, 1)

        nodes.append(
            GraphNode(
                id=node_id,
                name=data.get("name", node_id),
                type=data.get("type", "Company"),
                group=data.get("group", "General"),
                val=display_val,
                risk_score=risk,
                sentiment=sent,
                ticker=data.get("ticker"),
                sector=data.get("sector"),
                market_cap=data.get("market_cap"),
                country=data.get("country"),
                details=data.get("details")
            )
        )

    links: List[GraphLink] = []
    for u, v, data in graph.edges(data=True):
        is_active = (u, v) in active_edge_keys
        links.append(
            GraphLink(
                source=u,
                target=v,
                type=data.get("type", "AFFECTS"),
                weight=data.get("weight", 0.7),
                confidence=data.get("confidence", 0.85),
                explanation=data.get("explanation", ""),
                sentiment=data.get("sentiment", -1),
                is_active_shock=is_active
            )
        )

    return GraphData(
        nodes=nodes,
        links=links,
        total_nodes=len(nodes),
        total_links=len(links),
        metadata={
            "max_impact": max(impact_scores.values()) if impact_scores else 0.0,
            "affected_node_count": len(impact_scores),
            "cascade_hops": max([step.hop for step in propagation_steps], default=0)
        }
    )
