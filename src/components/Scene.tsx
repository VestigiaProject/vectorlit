import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { VectorPoints } from './VectorPoints';
import { useVectorStore } from '../store/vectorStore';

export function Scene() {
  const selectedVector = useVectorStore((state) => state.selectedVector);

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