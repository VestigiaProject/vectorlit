import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { Scene } from './components/Scene';
import { Sidebar } from './components/Sidebar';
import { fetchVectors } from './services/pinecone';
import { useVectorStore } from './store/vectorStore';

function App() {
  const setVectors = useVectorStore((state) => state.setVectors);
  const setLoading = useVectorStore((state) => state.setLoading);
  const setError = useVectorStore((state) => state.setError);

  useEffect(() => {
    const loadVectors = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (!import.meta.env.VITE_PINECONE_API_KEY) {
          throw new Error('Pinecone API key is not configured');
        }
        if (!import.meta.env.VITE_PINECONE_ENVIRONMENT) {
          throw new Error('Pinecone environment is not configured');
        }
        if (!import.meta.env.VITE_PINECONE_INDEX_NAME) {
          throw new Error('Pinecone index name is not configured');
        }

        const vectors = await fetchVectors(import.meta.env.VITE_PINECONE_INDEX_NAME);
        setVectors(vectors);
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