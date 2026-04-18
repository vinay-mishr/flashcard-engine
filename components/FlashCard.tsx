'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface Props {
  front: string;
  back: string;
  hint?: string;
  category?: string;
  onRate: (quality: 0 | 1 | 2 | 3 | 4 | 5) => void;
}

interface RatingButton {
  label: string;
  q: 0 | 1 | 2 | 3 | 4 | 5;
  color: string;
}

export default function FlashCard({ front, back, hint, category, onRate }: Props) {
  const [flipped, setFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const categoryColors: Record<string, string> = {
    Definition: 'bg-blue-100 text-blue-700',
    Formula: 'bg-purple-100 text-purple-700',
    Concept: 'bg-green-100 text-green-700',
    Example: 'bg-orange-100 text-orange-700',
    Relationship: 'bg-pink-100 text-pink-700',
  };

  const ratingButtons: RatingButton[] = [
    { label: '😰 Blackout', q: 0, color: 'bg-red-100 hover:bg-red-200 text-red-700' },
    { label: '😟 Hard',     q: 2, color: 'bg-orange-100 hover:bg-orange-200 text-orange-700' },
    { label: '🙂 Okay',     q: 3, color: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700' },
    { label: '😊 Good',     q: 4, color: 'bg-green-100 hover:bg-green-200 text-green-700' },
    { label: '🤩 Perfect',  q: 5, color: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700' },
  ];

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
      {/* Category badge */}
      {category && (
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[category] ?? 'bg-gray-100 text-gray-600'}`}>
          {category}
        </span>
      )}

      {/* Card with 3D flip */}
      <div
        className="w-full h-64 cursor-pointer"
        style={{ perspective: '1000px' }}
        onClick={() => setFlipped(!flipped)}
      >
        <motion.div
          className="relative w-full h-full"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center p-8 border border-gray-100"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <p className="text-xl font-medium text-gray-800 text-center leading-relaxed">{front}</p>
            {hint && !showHint && (
              <button
                className="mt-4 text-sm text-indigo-400 hover:text-indigo-600 underline"
                onClick={(e) => { e.stopPropagation(); setShowHint(true); }}
              >
                Show hint
              </button>
            )}
            {showHint && hint && (
              <p className="mt-4 text-sm text-gray-400 italic">{hint}</p>
            )}
            <p className="mt-6 text-xs text-gray-300">Tap to reveal →</p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-xl flex items-center justify-center p-8 border border-indigo-100"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <p className="text-lg text-gray-700 text-center leading-relaxed">{back}</p>
          </div>
        </motion.div>
      </div>

      {/* Rating buttons — only show after flip */}
      {flipped && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 w-full"
        >
          {ratingButtons.map(({ label, q, color }) => (
            <button
              key={q}
              onClick={() => { onRate(q); setFlipped(false); setShowHint(false); }}
              className={`flex-1 text-xs font-semibold py-3 rounded-xl transition-all ${color}`}
            >
              {label}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}