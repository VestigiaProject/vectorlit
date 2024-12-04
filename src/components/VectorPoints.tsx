import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useVectorStore } from '../store/vectorStore';

export function VectorPoints() {
  const vectors = useVectorStore((state) => state.vectors);
  const setSelectedVector = useVectorStore((state) => state.setSelectedVector);
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x += 0.001;
      pointsRef.current.rotation.y += 0.001;
    }
  });

  const positions = new Float32Array(
    vectors.flatMap((vector) => {
      const [x, y, z] = vector.values.slice(0, 3);
      return [x * 10, y * 10, z * 10];
    })
  );

  return (
    <Points
      ref={pointsRef}
      positions={positions}
      stride={3}
      onClick={(e) => {
        e.stopPropagation();
        const index = Math.floor(e.index / 3);
        setSelectedVector(vectors[index]);
      }}
    >
      <PointMaterial
        transparent
        vertexColors
        size={5}
        sizeAttenuation={false}
        depthWrite={false}
      />
    </Points>
  );
}