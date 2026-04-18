'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Brain, BookOpen } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Deck {
  id: string;
  name: string;
  emoji: string;
  card_count: number;
  pdf_name: string;
  created_at: string;
}

const EMOJIS = ['📚','🧮','🔬','🌍','📝','⚗️','🏛️','💡','🎯','🧠'];

export default function Dashboard() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [deckName, setDeckName] = useState('');
  const [emoji, setEmoji] = useState('📚');
  const [uploadStatus, setUploadStatus] = useState('');

  useEffect(() => { loadDecks(); }, []);

  async function loadDecks() {
    const { data } = await supabase
      .from('decks')
      .select('*')
      .order('created_at', { ascending: false });
    setDecks((data as Deck[]) || []);
  }

  async function handleUpload() {
    if (!file || !deckName) return;
    setUploading(true);
    setUploadStatus('Extracting text from PDF...');

    const form = new FormData();
    form.append('pdf', file);
    form.append('name', deckName);
    form.append('emoji', emoji);

    setUploadStatus('Claude is generating smart flashcards... ✨');
    const res = await fetch('/api/generate', { method: 'POST', body: form });
    const data = await res.json() as { cardCount: number; error?: string };

    if (res.ok) {
      setUploadStatus(`Created ${data.cardCount} flashcards! 🎉`);
      setTimeout(() => {
        setShowUpload(false);
        setUploading(false);
        setUploadStatus('');
        loadDecks();
      }, 1500);
    } else {
      setUploadStatus(`Error: ${data.error ?? 'Something went wrong'}`);
      setUploading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Brain className="text-indigo-600" /> FlashMind
            </h1>
            <p className="text-gray-400 text-sm mt-1">Turn any PDF into a smart study deck</p>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
          >
            <Upload size={16} /> New Deck
          </button>
        </div>

        {/* Deck Grid */}
        {decks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
            <BookOpen size={48} className="text-gray-200" />
            <p className="text-lg font-medium">No decks yet</p>
            <p className="text-sm">Upload a PDF to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {decks.map(deck => (
              <DeckCard key={deck.id} deck={deck} />
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => !uploading && setShowUpload(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-6">Create New Deck</h2>

              {/* Emoji picker */}
              <div className="flex gap-2 mb-4 flex-wrap">
                {EMOJIS.map(e => (
                  <button
                    key={e}
                    onClick={() => setEmoji(e)}
                    className={`text-2xl p-2 rounded-lg transition ${emoji === e ? 'bg-indigo-100 ring-2 ring-indigo-400' : 'hover:bg-gray-100'}`}
                  >
                    {e}
                  </button>
                ))}
              </div>

              <input
                className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Deck name (e.g. Quadratic Equations)"
                value={deckName}
                onChange={e => setDeckName(e.target.value)}
                disabled={uploading}
              />

              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-8 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition mb-4">
                <Upload className="text-gray-300 mb-2" />
                <span className="text-sm text-gray-500">
                  {file ? file.name : 'Click to upload PDF'}
                </span>
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={e => setFile(e.target.files?.[0] ?? null)}
                  disabled={uploading}
                />
              </label>

              {uploadStatus && (
                <div className="text-sm text-indigo-600 text-center mb-4 animate-pulse">
                  {uploadStatus}
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!file || !deckName || uploading}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {uploading ? 'Generating...' : 'Generate Flashcards ✨'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DeckCard({ deck }: { deck: Deck }) {
  return (
    <motion.a
      href={`/deck/${deck.id}`}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer block"
    >
      <div className="text-4xl mb-3">{deck.emoji}</div>
      <h3 className="font-bold text-gray-800 text-lg mb-1">{deck.name}</h3>
      <p className="text-sm text-gray-400">{deck.card_count} cards</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-gray-300">
          {new Date(deck.created_at).toLocaleDateString()}
        </span>
        <span className="text-xs bg-indigo-50 text-indigo-600 font-semibold px-3 py-1 rounded-full">
          Study →
        </span>
      </div>
    </motion.a>
  );
}