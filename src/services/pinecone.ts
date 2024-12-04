import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
  apiKey: import.meta.env.VITE_PINECONE_API_KEY,
  environment: import.meta.env.VITE_PINECONE_ENVIRONMENT,
});

export const fetchVectors = async (indexName: string, limit = 100) => {
  if (!indexName) {
    throw new Error('Index name is required');
  }

  try {
    const index = pinecone.index(indexName);
    
    // First, let's check if we can describe the index
    const description = await index.describeIndex();
    console.log('Index description:', description);

    const queryResponse = await index.query({
      vector: Array(description.dimension).fill(0), // Use the correct dimension
      topK: limit,
      includeMetadata: true,
      includeValues: true, // Explicitly request vector values
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