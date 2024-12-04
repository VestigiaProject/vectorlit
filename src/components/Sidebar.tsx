import React from 'react';
import { useVectorStore } from '../store/vectorStore';

export function Sidebar() {
  const selectedVector = useVectorStore((state) => state.selectedVector);

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-amber-50 border-l border-amber-900/20 p-6 pt-20 overflow-y-auto">
      <div className="font-serif">
        <h2 className="text-xl text-amber-900 mb-4">Vector Details</h2>
        {selectedVector ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm text-amber-900/70">Identifier</h3>
              <p className="font-mono text-amber-900">{selectedVector.id}</p>
            </div>
            <div>
              <h3 className="text-sm text-amber-900/70">Metadata</h3>
              <pre className="text-xs text-amber-900 whitespace-pre-wrap">
                {JSON.stringify(selectedVector.metadata, null, 2)}
              </pre>
            </div>
          </div>
        ) : (
          <p className="text-amber-900/70 italic">
            Select a vector point to view its details
          </p>
        )}
      </div>
    </div>
  );
}