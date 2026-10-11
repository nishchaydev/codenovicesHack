import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

class EntityResolver:
    """
    Uses Vector DB (FAISS) to match vague entities (like 'tech giant' or 'semiconductor makers') 
    to our standardized Knowledge Graph tickers and names.
    """
    def __init__(self):
        self.encoder = SentenceTransformer('all-MiniLM-L6-v2')
        self.dimension = 384
        self.index = faiss.IndexFlatL2(self.dimension)
        
        # Our Standardized Financial Knowledge Graph Taxonomy
        self.taxonomy = [
            {"id": "AAPL", "name": "Apple Inc.", "type": "Company", "aliases": ["tech giant", "iphone maker", "apple"]},
            {"id": "MSFT", "name": "Microsoft", "type": "Company", "aliases": ["windows maker", "tech giant", "microsoft"]},
            {"id": "CL=F", "name": "Crude Oil", "type": "Commodity", "aliases": ["oil", "petroleum", "energy commodity"]},
            {"id": "INDIGO.NS", "name": "InterGlobe Aviation", "type": "Company", "aliases": ["airlines", "indigo", "aviation"]},
            {"id": "^NSEI", "name": "Nifty 50", "type": "Index", "aliases": ["indian market", "nifty"]},
            {"id": "SEMI", "name": "Semiconductors", "type": "Sector", "aliases": ["chips", "microchips", "semiconductor makers"]}
        ]
        
        self.mapping_keys = []
        self._build_index()

    def _build_index(self):
        vectors = []
        for entity in self.taxonomy:
            # Vectorize the name and all its aliases
            for phrase in [entity["name"]] + entity["aliases"]:
                vectors.append(self.encoder.encode(phrase))
                self.mapping_keys.append(entity)
        
        if vectors:
            self.index.add(np.array(vectors).astype('float32'))

    def resolve_entity(self, raw_entity_name: str, top_k: int = 1):
        """
        Takes a raw string like 'tech giant' and returns the closest standard entity (e.g., AAPL).
        """
        if not self.mapping_keys:
            return None
            
        query_vector = self.encoder.encode([raw_entity_name]).astype('float32')
        distances, indices = self.index.search(query_vector, top_k)
        
        best_match_idx = indices[0][0]
        # Return the resolved standardized entity
        return self.mapping_keys[best_match_idx]

if __name__ == "__main__":
    resolver = EntityResolver()
    
    test_queries = ["chips", "tech giant", "petroleum"]
    for q in test_queries:
        match = resolver.resolve_entity(q)
        print(f"Raw: '{q}' -> Resolved: {match['name']} ({match['id']})")
