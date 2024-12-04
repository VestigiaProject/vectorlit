import React from 'react';
import { BookOpen } from 'lucide-react';

export function Header() {
  return (
    <header className="fixed top-0 w-full bg-amber-50 border-b border-amber-900/20 p-4 z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BookOpen className="h-8 w-8 text-amber-900" />
          <h1 className="text-2xl font-serif text-amber-900">Vector Codex</h1>
        </div>
        <nav className="font-serif text-amber-900">
          <ul className="flex space-x-6">
            <li>Tome I: Visualization</li>
            <li>Tome II: Analytics</li>
          </ul>
        </nav>
      </div>
    </header>
  );
}