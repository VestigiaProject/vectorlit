import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
  apiKey: import.meta.env.VITE_PINECONE_API_KEY,
  environment: import.meta.env.VITE_PINECONE_ENVIRONMENT,
});

export const fetchVectors = async (indexName: string, limit = 100) => {
  const index = pinecone.index(indexName);
  const queryResponse = await index.query({
    vector: Array(1536).fill(0),
    topK: limit,
    includeMetadata: true,
  });

  return queryResponse.matches.map((match) => ({
    id: match.id,
    values: match.values || [],
    metadata: match.metadata,
  }));
};