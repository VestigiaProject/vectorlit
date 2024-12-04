import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { Scene } from './components/Scene';
import { Sidebar } from './components/Sidebar';
import { fetchVectors } from './services/pinecone';
import { useVectorStore } from './store/vectorStore';

function App() {
  const setVectors = useVectorStore((state) => state.setVectors);

  useEffect(() => {
    const loadVectors = async () => {
      try {
        const vectors = await fetchVectors(import.meta.env.VITE_PINECONE_INDEX_NAME);
        setVectors(vectors);
      } catch (error) {
        console.error('Failed to fetch vectors:', error);
      }
    };

    loadVectors();
  }, [setVectors]);

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