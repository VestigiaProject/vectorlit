import { Pinecone } from '@pinecone-database/pinecone';

let pineconeInstance: Pinecone | null = null;

export const getPineconeClient = () => {
  if (pineconeInstance) {
    return pineconeInstance;
  }

  const apiKey = import.meta.env.VITE_PINECONE_API_KEY;
  
  if (!apiKey) {
    throw new Error('Pinecone API key is not configured in environment variables');
  }

  pineconeInstance = new Pinecone({
    apiKey,
  });

  return pineconeInstance;
};