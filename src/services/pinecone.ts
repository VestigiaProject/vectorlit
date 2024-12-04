import { Pinecone } from '@pinecone-database/pinecone';

const getPineconeClient = () => {
  const apiKey = import.meta.env.VITE_PINECONE_API_KEY;
  
  if (!apiKey) {
    throw new Error('Pinecone API key is not configured');
  }

  return new Pinecone({
    apiKey,
  });
};

export const fetchVectors = async (indexName: string, limit = 100) => {
  if (!indexName) {
    throw new Error('Index name is required');
  }

  try {
    const pinecone = getPineconeClient();
    const index = pinecone.index(indexName);
    
    // First, let's check if we can describe the index stats
    const stats = await index.describeStatistics();
    console.log('Index stats:', stats);

    // Generate a random normalized vector for querying
    const dimension = 1536; // Standard dimension for many embedding models
    const randomVector = Array.from({ length: dimension }, () => Math.random() * 2 - 1);
    const magnitude = Math.sqrt(randomVector.reduce((sum, val) => sum + val * val, 0));
    const normalizedVector = randomVector.map(val => val / magnitude);

    const queryResponse = await index.query({
      vector: normalizedVector,
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
      metadata: match.metadata,
    }));
  } catch (error) {
    console.error('Pinecone error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch vectors from Pinecone');
  }
};