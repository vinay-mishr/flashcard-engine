'use client';
import { useEffect, useState } from 'react';
import FlashCard from '@/components/FlashCard';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface CardProgress {
  next_review_at: string;
}

interface Card {
  id: string;
  front: string;
  back: string;
  hint?: string;
  category?: string;
  deck_id: string;
  created_at: string;
  card_progress: CardProgress[];
}

interface SessionStats {
  correct: number;
  hard: number;
  again: number;
}

export default function StudyPage({ params }: { params: { id: string } }) {
  const [cards, setCards] = useState<Card[]>([]);
  const [current, setCurrent] = useState(0);
  const [sessionStats, setSessionStats] = useState<SessionStats>({ correct: 0, hard: 0, again: 0 });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);

  // Defined BEFORE useEffect so it's available when useEffect runs
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data } = await supabase
        .from('cards')
        .select('*, card_progress(*)')
        .eq('deck_id', params.id)
        .lte('card_progress.next_review_at', new Date().toISOString())
        .order('created_at');

      if (!cancelled) {
        setCards((data as Card[]) ?? []);
        setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [params.id]);

  async function handleRate(quality: 0 | 1 | 2 | 3 | 4 | 5) {
    const card = cards[current];

    if (quality >= 4) setSessionStats(s => ({ ...s, correct: s.correct + 1 }));
    else if (quality >= 2) setSessionStats(s => ({ ...s, hard: s.hard + 1 }));
    else setSessionStats(s => ({ ...s, again: s.again + 1 }));

    await fetch('/api/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ card_id: card.id, quality })
    });

    if (current + 1 >= cards.length) {
      setDone(true);
    } else {
      setCurrent(c => c + 1);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-400 animate-pulse">Loading cards...</p>
      </div>
    );
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center h-screen gap-6 p-8"
      >
        <div className="text-6xl">🎉</div>
        <h1 className="text-3xl font-bold text-gray-800">Session Complete!</h1>
        <div className="flex gap-6 text-center">
          <div className="bg-green-50 rounded-2xl p-6">
            <p className="text-3xl font-bold text-green-600">{sessionStats.correct}</p>
            <p className="text-sm text-green-500">Correct</p>
          </div>
          <div className="bg-yellow-50 rounded-2xl p-6">
            <p className="text-3xl font-bold text-yellow-600">{sessionStats.hard}</p>
            <p className="text-sm text-yellow-500">Hard</p>
          </div>
          <div className="bg-red-50 rounded-2xl p-6">
            <p className="text-3xl font-bold text-red-600">{sessionStats.again}</p>
            <p className="text-sm text-red-500">Again</p>
          </div>
        </div>
        <button
          onClick={() => window.location.href = `/deck/${params.id}`}
          className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
        >
          Back to Deck
        </button>
      </motion.div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="text-5xl">✅</div>
        <h2 className="text-2xl font-bold text-gray-700">Nothing due today!</h2>
        <p className="text-gray-400">Come back tomorrow for your next review.</p>
        <button
          onClick={() => window.location.href = `/deck/${params.id}`}
          className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition"
        >
          Back to Deck
        </button>
      </div>
    );
  }

  const card = cards[current];
  const progress = (current / cards.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col">
      {/* Progress bar */}
      <div className="max-w-2xl mx-auto w-full mb-8">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>{current + 1} of {cards.length}</span>
          <span>{Math.round(progress)}% done</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-indigo-500 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl"
          >
            <FlashCard
              front={card.front}
              back={card.back}
              hint={card.hint}
              category={card.category}
              onRate={handleRate}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}