import React, { useState } from 'react';

interface WorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (exercise: string, weight: number, reps: number) => void;
}

export const WorkoutModal: React.FC<WorkoutModalProps> = ({ isOpen, onClose, onSave }) => {
  const [exercise, setExercise] = useState('');
  const [weight, setWeight] = useState<string>('');
  const [reps, setReps] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exercise || !weight || !reps) return;
    
    // Haptic feedback on save (15ms vibration)
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15);
    }

    onSave(exercise, Number(weight), Number(reps));
    
    // Reset form
    setExercise('');
    setWeight('');
    setReps('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-surface w-full max-w-sm rounded-2xl p-6 border border-gray-800 shadow-2xl">
        <h2 className="text-xl font-bold mb-4 text-white">Neuer Eintrag</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Übung</label>
            <input
              type="text"
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
              className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder-gray-600"
              placeholder="z.B. Bankdrücken"
              autoFocus
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Gewicht (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder-gray-600"
                placeholder="0"
                inputMode="decimal"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Wdh.</label>
              <input
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder-gray-600"
                placeholder="0"
                inputMode="numeric"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-lg bg-gray-900 text-gray-300 font-medium hover:bg-gray-800 transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-lg bg-primary text-white font-bold hover:bg-blue-600 transition-colors"
            >
              Speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};