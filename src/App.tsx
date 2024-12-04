import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { Scene } from './components/Scene';
import { Sidebar } from './components/Sidebar';
import { fetchVectors } from './services/vectorService';
import { useVectorStore } from './store/vectorStore';

export function App() {
  const setVectors = useVectorStore((state) => state.setVectors);
  const setLoading = useVectorStore((state) => state.setLoading);
  const setError = useVectorStore((state) => state.setError);

  useEffect(() => {
    const loadVectors = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const indexName = import.meta.env.VITE_PINECONE_INDEX_NAME;
        if (!indexName) {
          throw new Error('Pinecone index name is not configured in environment variables');
        }

        const vectors = await fetchVectors(indexName);
        if (vectors.length === 0) {
          setError('No vectors found in the index. Please ensure your index contains vector data.');
        } else {
          setVectors(vectors);
        }
      } catch (error) {
        console.error('Failed to fetch vectors:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch vectors');
      } finally {
        setLoading(false);
      }
    };

    loadVectors();
  }, [setVectors, setLoading, setError]);

  return (
    <div className="min-h-screen bg-amber-100">
      <Header />
      <main className="pt-16 h-screen">
        <Scene />
      </main>
      <Sidebar />
    </div>
  );
}

export default App;