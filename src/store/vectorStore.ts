import { create } from 'zustand';
import { Vector } from '../types/vector';

interface VectorState {
  vectors: Vector[];
  selectedVector: Vector | null;
  setVectors: (vectors: Vector[]) => void;
  setSelectedVector: (vector: Vector | null) => void;
}

export const useVectorStore = create<VectorState>((set) => ({
  vectors: [],
  selectedVector: null,
  setVectors: (vectors) => set({ vectors }),
  setSelectedVector: (vector) => set({ selectedVector: vector }),
}));