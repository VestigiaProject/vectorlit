import { create } from 'zustand';
import { Vector } from '../types/vector';

interface VectorState {
  vectors: Vector[];
  selectedVector: Vector | null;
  loading: boolean;
  error: string | null;
  setVectors: (vectors: Vector[]) => void;
  setSelectedVector: (vector: Vector | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useVectorStore = create<VectorState>((set) => ({
  vectors: [],
  selectedVector: null,
  loading: false,
  error: null,
  setVectors: (vectors) => set({ vectors, error: null }),
  setSelectedVector: (vector) => set({ selectedVector: vector }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));