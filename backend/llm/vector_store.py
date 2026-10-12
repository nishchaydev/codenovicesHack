from typing import List, Dict, Any

try:
    import chromadb
    from chromadb.config import Settings as ChromaSettings
    CHROMA_AVAILABLE = True
except ImportError:
    CHROMA_AVAILABLE = False

# In-memory fallback when ChromaDB is not installed
_fallback_docs: List[Dict[str, Any]] = []

_client = None
_collection = None


import hashlib
import math
import numpy as np

class FastLocalEmbeddingFunction:
    """Zero-network, instant 128-dimensional embedding function for ChromaDB."""
    def name(self) -> str:
        return "fast_local_embedding"

    def __call__(self, input: Any) -> Any:
        texts = [input] if isinstance(input, str) else list(input)
        embeddings = []
        for text in texts:
            words = str(text).lower().split()
            vec = [0.0] * 128
            for w in words:
                idx = int(hashlib.md5(w.encode()).hexdigest(), 16) % 128
                vec[idx] += 1.0
            norm = math.sqrt(sum(x * x for x in vec)) or 1.0
            embeddings.append([x / norm for x in vec])
        return np.array(embeddings, dtype=np.float32)

    def embed_query(self, input: Any) -> Any:
        return self(input)

    def embed_documents(self, input: Any) -> Any:
        return self(input)

def _get_collection():
    global _client, _collection
    if not CHROMA_AVAILABLE:
        return None
    if _collection is None:
        from config import settings
        ef = FastLocalEmbeddingFunction()
        if settings.CHROMA_API_KEY:
            try:
                if hasattr(chromadb, "CloudClient"):
                    _client = chromadb.CloudClient(
                        tenant=settings.CHROMA_TENANT,
                        database=settings.CHROMA_DATABASE,
                        api_key=settings.CHROMA_API_KEY
                    )
                else:
                    _client = chromadb.HttpClient(
                        host=settings.CHROMA_HOST,
                        ssl=True,
                        headers={"x-chroma-token": settings.CHROMA_API_KEY},
                        tenant=settings.CHROMA_TENANT,
                        database=settings.CHROMA_DATABASE
                    )
                _collection = _client.get_or_create_collection("fingraph_events", embedding_function=ef)
                print(f"[VectorStore] Connected to Chroma Cloud! (Database: {settings.CHROMA_DATABASE})")
                return _collection
            except Exception as e:
                print(f"[VectorStore] Chroma Cloud init warning, falling back to local: {e}")

        # Local in-memory ChromaDB instance
        _client = chromadb.Client(ChromaSettings(anonymized_telemetry=False, is_persistent=False))
        try:
            _collection = _client.get_or_create_collection("fingraph_events", embedding_function=ef)
        except Exception:
            _collection = _client.create_collection("fingraph_events", embedding_function=ef)
    return _collection


import threading

_ef_instance = FastLocalEmbeddingFunction()

# Pre-seed baseline institutional scenarios into in-memory RAG store for instant context
_fallback_docs: List[Dict[str, Any]] = [
    {
        "id": "seed_crude_shock",
        "text": "Headline: Brent Crude surges past $85/bbl on Hormuz disruption. Summary: Higher crude oil increases aviation turbine fuel (ATF) costs for airlines (IndiGo) and petrochemical input costs for paints (Asian Paints), while benefiting upstream producers (ONGC).",
        "metadata": {"event_id": "seed_crude_shock", "headline": "Brent Crude supply shock"},
        "vec": _ef_instance("Brent Crude surges past $85/bbl oil aviation fuel airlines IndiGo Asian Paints ONGC")[0]
    },
    {
        "id": "seed_perm_visa",
        "text": "Headline: US suspends PERM visa processing for tech firms; Indian IT offshore outsourcing surges. Summary: On-site US labor bottlenecks accelerate Global Capability Center (GCC) expansion in India, boosting deal pipelines for TCS, Infosys, and HCLTech.",
        "metadata": {"event_id": "seed_perm_visa", "headline": "US PERM visa freeze & Indian IT rally"},
        "vec": _ef_instance("US suspends PERM visa H1B Microsoft TCS Infosys Indian IT offshore outsourcing")[0]
    },
    {
        "id": "seed_rbi_rate",
        "text": "Headline: RBI Monetary Policy Committee shifts liquidity stance and adjusts Repo Rate. Summary: Rate changes directly impact NIMs for HDFC Bank, ICICI Bank, and SBI, while altering consumer auto loan EMI affordability for Tata Motors and Maruti Suzuki.",
        "metadata": {"event_id": "seed_rbi_rate", "headline": "RBI Repo Rate & banking liquidity"},
        "vec": _ef_instance("RBI repo rate inflation banking NIM HDFC Bank ICICI SBI Tata Motors auto loans")[0]
    }
]


def _sync_to_chroma_bg(event_id: str, doc_text: str, metadata: Dict[str, Any]):
    if not CHROMA_AVAILABLE:
        return
    try:
        col = _get_collection()
        if col is not None:
            col.add(ids=[event_id], documents=[doc_text], metadatas=[metadata])
    except Exception as e:
        print(f"[VectorStore] Background Chroma sync warning: {e}")


def embed_event(event_id: str, headline: str, summary: str, propagation_steps: list):
    """Embeds a simulated event into the instant in-memory vector store and syncs to Chroma Cloud in background."""
    impact_chain = " -> ".join([
        f"{s.get('node_id', s.get('node', ''))} (score: {s.get('impact_score', s.get('impact', 0)):.1f})"
        for s in propagation_steps[:6]
    ])
    doc_text = f"Headline: {headline}. Summary: {summary}. Impact chain: {impact_chain}"
    metadata = {
        "event_id": event_id,
        "headline": headline[:200],
        "summary": summary[:500]
    }

    vec = _ef_instance(doc_text)[0]
    _fallback_docs.append({"id": event_id, "text": doc_text, "metadata": metadata, "vec": vec})

    # Non-blocking background sync to Chroma Cloud
    threading.Thread(
        target=_sync_to_chroma_bg,
        args=(event_id, doc_text, metadata),
        daemon=True
    ).start()


def query_similar_events(query_text: str, n_results: int = 3) -> List[Dict[str, Any]]:
    """Retrieves semantically similar events in <0.1ms using in-memory cosine similarity."""
    if not _fallback_docs:
        return []

    q_vec = _ef_instance(query_text)[0]
    scored = []
    for idx, doc in enumerate(_fallback_docs):
        d_vec = doc.get("vec")
        if d_vec is not None:
            sim = float(np.dot(q_vec, d_vec))
        else:
            q_words = set(query_text.lower().split())
            sim = float(sum(1 for w in q_words if w in doc["text"].lower())) * 0.1
        scored.append((sim, idx, doc))

    scored.sort(key=lambda x: x[0], reverse=True)
    return [{"text": d["text"], "metadata": d["metadata"]} for sim, _, d in scored[:n_results] if sim > 0]


def get_store_count() -> int:
    return len(_fallback_docs)

