'use client';
import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Play } from 'lucide-react';

interface Card {
  id: string;
  front: string;
  back: string;
  category?: string;
  hint?: string;
}

interface Deck {
  id: string;
  name: string;
  emoji: string;
  card_count: number;
  pdf_name: string;
  created_at: string;
}

export default function DeckPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDeck() {
      const { data: deckData } = await supabase
        .from('decks')
        .select('*')
        .eq('id', id)
        .single();

      const { data: cardsData } = await supabase
        .from('cards')
        .select('*')
        .eq('deck_id', id);

      setDeck(deckData as Deck);
      setCards((cardsData as Card[]) ?? []);
      setLoading(false);
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/auth');
      } else {
        loadDeck();
      }
    });
  }, [id, router]);

  const categoryColors: Record<string, string> = {
    Definition: 'bg-blue-50 text-blue-600',
    Formula: 'bg-purple-50 text-purple-600',
    Concept: 'bg-green-50 text-green-600',
    Example: 'bg-orange-50 text-orange-600',
    Relationship: 'bg-pink-50 text-pink-600',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-400 animate-pulse">Loading deck...</p>
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-400">Deck not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-700 transition"
          >
            <ArrowLeft size={18} /> Back to Dashboard
          </button>
        </div>

        {/* Deck Info */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{deck.emoji}</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{deck.name}</h1>
                <p className="text-gray-400 text-sm mt-1">
                  {deck.card_count} cards · {deck.pdf_name}
                </p>
                <p className="text-gray-300 text-xs mt-1">
                  Created {new Date(deck.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push(`/study/${deck.id}`)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
            >
              <Play size={16} /> Study Now
            </button>
          </div>
        </div>

        {/* Cards Preview */}
        <h2 className="text-lg font-bold text-gray-700 mb-4">
          All Cards ({cards.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition"
            >
              {card.category && (
                <span className={`text-xs font-semibold px-2 py-1 rounded-full mb-3 inline-block ${categoryColors[card.category] ?? 'bg-gray-50 text-gray-500'}`}>
                  {card.category}
                </span>
              )}
              <p className="font-medium text-gray-800 text-sm mb-2">{card.front}</p>
              <p className="text-gray-400 text-xs leading-relaxed border-t border-gray-50 pt-2">
                {card.back}
              </p>
              {card.hint && (
                <p className="text-indigo-300 text-xs mt-2 italic">💡 {card.hint}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}