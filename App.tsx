import React, { useState, useEffect } from 'react';
import { WorkoutEntry } from './types';
import { EntryList } from './components/EntryList';
import { FloatingActionButton } from './components/FloatingActionButton';
import { WorkoutModal } from './components/WorkoutModal';

const STORAGE_KEY = 'gymlog_entries_v1';

const App: React.FC = () => {
  const [entries, setEntries] = useState<WorkoutEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse workouts", e);
      }
    }
  }, []);

  // Save to LocalStorage whenever entries change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const handleAddEntry = (exercise: string, weight: number, reps: number) => {
    const newEntry: WorkoutEntry = {
      id: crypto.randomUUID(),
      exercise,
      weight,
      reps,
      timestamp: Date.now(),
    };
    // Add new entry at the top of the list
    setEntries(prev => [newEntry, ...prev]);
  };

  const handleDeleteEntry = (id: string) => {
    // Confirmation is now handled in EntryList component to support exit animations
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 max-w-lg mx-auto relative">
      <header className="mb-6 mt-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">GymLog</h1>
          <p className="text-gray-500 text-sm">Dein Workout Tracker</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-surface border border-gray-800 flex items-center justify-center">
            {/* Simple User Avatar Placeholder */}
            <div className="w-2 h-2 bg-primary rounded-full"></div>
        </div>
      </header>

      <main>
        <EntryList entries={entries} onDelete={handleDeleteEntry} />
      </main>

      <FloatingActionButton onClick={() => setIsModalOpen(true)} />

      <WorkoutModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleAddEntry} 
      />
    </div>
  );
};

export default App;