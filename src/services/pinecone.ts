import { Pinecone } from '@pinecone-database/pinecone';

// Initialize Pinecone client only when API key is available
const getPineconeClient = () => {
  const apiKey = import.meta.env.VITE_PINECONE_API_KEY;
  const environment = import.meta.env.VITE_PINECONE_ENVIRONMENT;

  if (!apiKey) {
    throw new Error('Pinecone API key is not configured');
  }
  if (!environment) {
    throw new Error('Pinecone environment is not configured');
  }

  return new Pinecone({
    apiKey,
    environment,
  });
};

export const fetchVectors = async (indexName: string, limit = 100) => {
  if (!indexName) {
    throw new Error('Index name is required');
  }

  try {
    const pinecone = getPineconeClient();
    const index = pinecone.index(indexName);
    
    // First, let's check if we can describe the index
    const description = await index.describeIndex();
    console.log('Index description:', description);

    // Generate a random normalized vector for querying
    const dimension = description.dimension;
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
    throw error;
  }
};