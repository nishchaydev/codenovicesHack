import numpy as np

class RAGEngine:
    def __init__(self):
        self.documents = []
        self.embeddings = []
        self._encoder = None
        self.dimension = 384
        self.index = None
        self._seed_financial_knowledge()

    def _get_encoder(self):
        if self._encoder is None:
            try:
                from sentence_transformers import SentenceTransformer
                self._encoder = SentenceTransformer('all-MiniLM-L6-v2')
            except Exception:
                self._encoder = None
        return self._encoder

    def _seed_financial_knowledge(self):
        """Seed the vector DB with historical financial rules & GitHub docs."""
        seed_data = [
            "If Crude Oil prices rise significantly, transportation and aviation sectors face increased operating costs and their stocks usually fall.",
            "An increase in RBI Repo Rate (Interest Rate) increases borrowing costs, negatively impacting Real Estate and Banking sectors.",
            "Semiconductor export bans or chip shortages directly impact consumer electronics and auto manufacturing due to supply chain disruptions.",
            "A sudden rise in inflation leads to reduced consumer spending, negatively impacting retail and FMCG sectors.",
            "Geopolitical tensions in the Middle East usually cause a spike in crude oil prices and gold prices as safe-haven assets."
        ]
        self.documents.extend(seed_data)

    def add_documents(self, docs: list[str]):
        if not docs: return
        self.documents.extend(docs)

    def search(self, query: str, top_k: int = 2) -> list[str]:
        if not self.documents: return []
        encoder = self._get_encoder()
        if encoder:
            try:
                import faiss
                if self.index is None:
                    self.index = faiss.IndexFlatL2(self.dimension)
                    embs = encoder.encode(self.documents)
                    self.index.add(np.array(embs).astype('float32'))
                query_vector = encoder.encode([query]).astype('float32')
                distances, indices = self.index.search(query_vector, top_k)
                results = []
                for idx in indices[0]:
                    if idx < len(self.documents):
                        results.append(self.documents[idx])
                return results
            except Exception:
                pass
        # Fallback keyword matching
        q_words = set(query.lower().split())
        matched = [doc for doc in self.documents if any(w in doc.lower() for w in q_words)]
        return matched[:top_k] if matched else self.documents[:top_k]

if __name__ == "__main__":
    engine = RAGEngine()
    context = engine.search("Oil prices hit $90 per barrel due to crisis.")
    print("Retrieved Context:", context)

