import { Vector } from '../types/vector';
import { getPineconeClient } from './pineconeClient';

const VECTOR_DIMENSION = 1536; // Standard dimension for many embedding models

export const generateQueryVector = (dimension: number = VECTOR_DIMENSION): number[] => {
  const randomVector = Array.from(
    { length: dimension }, 
    () => Math.random() * 2 - 1
  );
  
  const magnitude = Math.sqrt(
    randomVector.reduce((sum, val) => sum + val * val, 0)
  );
  
  return randomVector.map(val => val / magnitude);
};

export const fetchVectors = async (indexName: string, limit = 100): Promise<Vector[]> => {
  if (!indexName) {
    throw new Error('Index name is required');
  }

  try {
    const pinecone = getPineconeClient();
    const index = pinecone.index(indexName);
    
    // Verify index access
    const stats = await index.describeStatistics();
    console.log('Index stats:', stats);

    if (!stats.dimension) {
      throw new Error('Failed to retrieve index dimension');
    }

    const queryVector = generateQueryVector(stats.dimension);
    
    const queryResponse = await index.query({
      vector: queryVector,
      topK: limit,
      includeMetadata: true,
      includeValues: true,
    });

    console.log('Query response:', queryResponse);

    if (!queryResponse.matches.length) {
      console.warn('No vectors found in the index');
    }

    return queryResponse.matches.map((match) => ({
      id: match.id,
      values: match.values || [],
      metadata: match.metadata || {},
    }));
  } catch (error) {
    console.error('Error fetching vectors:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('apiKey')) {
        throw new Error('Invalid or missing Pinecone API key');
      }
      if (error.message.includes('not found')) {
        throw new Error(`Index "${indexName}" not found`);
      }
      throw error;
    }
    
    throw new Error('Failed to fetch vectors from Pinecone');
  }
};