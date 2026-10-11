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


def embed_event(event_id: str, headline: str, summary: str, propagation_steps: list):
    """Embeds a simulated event + propagation summary into the vector store."""
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

    if CHROMA_AVAILABLE:
        try:
            col = _get_collection()
            col.add(ids=[event_id], documents=[doc_text], metadatas=[metadata])
            return
        except Exception as e:
            print(f"[VectorStore] ChromaDB embed warning: {e}")

    _fallback_docs.append({"id": event_id, "text": doc_text, "metadata": metadata})


def query_similar_events(query_text: str, n_results: int = 3) -> List[Dict[str, Any]]:
    """Retrieves semantically similar events from the store."""
    if CHROMA_AVAILABLE:
        try:
            col = _get_collection()
            if col.count() == 0:
                return []
            results = col.query(
                query_texts=[query_text],
                n_results=min(n_results, col.count())
            )
            docs = results.get("documents", [[]])[0]
            metas = results.get("metadatas", [[]])[0]
            return [{"text": d, "metadata": m} for d, m in zip(docs, metas)]
        except Exception as e:
            print(f"[VectorStore] ChromaDB query warning: {e}")

    # Keyword-match fallback
    q_words = set(query_text.lower().split())
    scored = []
    for doc in _fallback_docs:
        score = sum(1 for w in q_words if w in doc["text"].lower())
        if score > 0:
            scored.append((score, doc))
    scored.sort(reverse=True)
    return [{"text": d["text"], "metadata": d["metadata"]} for _, d in scored[:n_results]]


def get_store_count() -> int:
    if CHROMA_AVAILABLE:
        try:
            return _get_collection().count()
        except Exception:
            pass
    return len(_fallback_docs)
