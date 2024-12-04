import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useVectorStore } from '../store/vectorStore';

export function VectorPoints() {
  const vectors = useVectorStore((state) => state.vectors);
  const setSelectedVector = useVectorStore((state) => state.setSelectedVector);
  const pointsRef = useRef<THREE.Points>(null);

  // Normalize vector values to fit within visible range
  const positions = useMemo(() => {
    if (!vectors.length) return new Float32Array();

    // Find the maximum absolute value for normalization
    const maxValue = Math.max(
      ...vectors.flatMap(v => v.values.map(Math.abs))
    );

    // Scale factor to keep points within visible range
    const scale = maxValue ? 20 / maxValue : 1;

    return new Float32Array(
      vectors.flatMap((vector) => {
        // Use first three dimensions for x, y, z
        const coords = vector.values.slice(0, 3);
        // Fill with 0 if vector has less than 3 dimensions
        while (coords.length < 3) coords.push(0);
        return coords.map(v => v * scale);
      })
    );
  }, [vectors]);

  // Create colors based on vector positions
  const colors = useMemo(() => {
    return new Float32Array(
      vectors.flatMap((_, i) => {
        const hue = (i / vectors.length) * 360;
        const color = new THREE.Color().setHSL(hue / 360, 0.6, 0.5);
        return [color.r, color.g, color.b];
      })
    );
  }, [vectors]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x += 0.0005;
      pointsRef.current.rotation.y += 0.0005;
    }
  });

  if (!vectors.length) return null;

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
        size={8}
        sizeAttenuation={true}
        depthWrite={false}
        color="#ffffff"
      />
      <primitive object={new THREE.BufferAttribute(colors, 3)} attach="geometry-attributes-color" />
    </Points>
  );
}