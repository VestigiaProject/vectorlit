import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { VectorPoints } from './VectorPoints';
import { useVectorStore } from '../store/vectorStore';

export function Scene() {
  const selectedVector = useVectorStore((state) => state.selectedVector);
  const loading = useVectorStore((state) => state.loading);
  const error = useVectorStore((state) => state.error);
  const vectors = useVectorStore((state) => state.vectors);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-amber-900 font-serif text-xl">Loading vectors...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-600 font-serif text-xl">Error loading vectors</p>
          <p className="text-amber-900/70 max-w-md">{error}</p>
        </div>
      </div>
    );
  }

  if (vectors.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-amber-900 font-serif text-xl">No vectors found in the index</p>
      </div>
    );
  }

  return (
    <Canvas camera={{ position: [0, 0, 50] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <VectorPoints />
      <OrbitControls />
      {selectedVector && (
        <Text
          position={[0, -20, 0]}
          fontSize={1.5}
          color="#4a5568"
          anchorX="center"
          anchorY="middle"
        >
          {selectedVector.id}
        </Text>
      )}
    </Canvas>
  );
}