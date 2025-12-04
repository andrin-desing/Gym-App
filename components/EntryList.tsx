import React, { useState } from 'react';
import { WorkoutEntry } from '../types';

interface EntryListProps {
  entries: WorkoutEntry[];
  onDelete: (id: string) => void;
}

export const EntryList: React.FC<EntryListProps> = ({ entries, onDelete }) => {
  // Track IDs of items currently animating out
  const [exitingItems, setExitingItems] = useState<Set<string>>(new Set());

  const handleDelete = (id: string) => {
    // Haptic feedback (15ms vibration)
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15);
    }

    if (window.confirm("Eintrag löschen?")) {
      // Start exit animation
      setExitingItems(prev => new Set(prev).add(id));

      // Wait for animation to finish (300ms) before actual deletion
      setTimeout(() => {
        onDelete(id);
        // Note: We don't strictly need to remove it from exitingItems 
        // because the component for this ID will be unmounted by parent.
      }, 300);
    }
  };

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500 animate-slide-in">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-50">
          <path d="m6.5 6.5 11 11"></path>
          <path d="m21 21-1-1"></path>
          <path d="m3 3 1 1"></path>
          <path d="m18 22 4-4"></path>
          <path d="m2 6 4-4"></path>
          <path d="m3 10 7-7"></path>
          <path d="m14 21 7-7"></path>
        </svg>
        <p className="text-lg font-medium">Keine Einträge</p>
        <p className="text-sm">Starte dein Training!</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3 pb-24">
      {entries.map((entry) => {
        const isExiting = exitingItems.has(entry.id);
        
        return (
          <li 
            key={entry.id} 
            className={`
              bg-surface rounded-xl flex items-center justify-between border border-gray-900 shadow-sm overflow-hidden
              transition-all duration-300 ease-out
              ${isExiting 
                ? 'opacity-0 -translate-x-full max-h-0 py-0 border-0 my-0' 
                : 'animate-slide-in opacity-100 max-h-24 p-4'
              }
            `}
          >
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold truncate text-lg">{entry.exercise}</h3>
              <div className="flex items-center text-gray-400 text-sm mt-1 space-x-3">
                 <span className="flex items-center">
                    <span className="text-primary font-bold mr-1">{entry.weight}</span> kg
                 </span>
                 <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                 <span className="flex items-center">
                    <span className="text-primary font-bold mr-1">{entry.reps}</span> Wdh.
                 </span>
                 <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                 <span className="text-xs text-gray-500">
                   {new Date(entry.timestamp).toLocaleDateString(undefined, {
                     weekday: 'short', 
                     hour: '2-digit', 
                     minute: '2-digit'
                   })}
                 </span>
              </div>
            </div>
            
            <button
              onClick={() => handleDelete(entry.id)}
              className="ml-4 p-2 text-gray-500 hover:text-danger hover:bg-white/5 rounded-full transition-colors shrink-0"
              aria-label="Delete entry"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </li>
        );
      })}
    </ul>
  );
};