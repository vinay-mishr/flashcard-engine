import { NextRequest, NextResponse } from 'next/server';
import { generateFlashcards } from '@/lib/claude';
import { createClient } from '@supabase/supabase-js';
import { extractText } from 'unpdf';

interface GeneratedCard {
  front: string;
  back: string;
  category?: string;
  hint?: string | null;
}

interface DeckRow {
  id: string;
  name: string;
  emoji: string;
  card_count: number;
  pdf_name: string;
  created_at: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('pdf') as File;
    const deckName = formData.get('name') as string;
    const emoji = (formData.get('emoji') as string) || '📚';

    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

    // Parse PDF using unpdf — works perfectly with Next.js
    const arrayBuffer = await file.arrayBuffer();
    const { text: pdfText } = await extractText(new Uint8Array(arrayBuffer), { mergePages: true });

    if (!pdfText || !pdfText.trim()) {
      return NextResponse.json(
        { error: 'Could not extract text from PDF' },
        { status: 400 }
      );
    }

    // Generate flashcards with Claude
    const cards: GeneratedCard[] = await generateFlashcards(pdfText, deckName);

    // Save deck
    const { data: deckData, error: deckError } = await supabase
      .from('decks')
      .insert({ name: deckName, pdf_name: file.name, emoji, card_count: cards.length })
      .select()
      .single();

    if (deckError) throw deckError;
    if (!deckData) throw new Error('Deck was not created');

    const deck = deckData as DeckRow;

    // Save cards (trigger auto-creates card_progress)
    const cardRows = cards.map((c: GeneratedCard) => ({ ...c, deck_id: deck.id }));
    const { error: cardError } = await supabase.from('cards').insert(cardRows);
    if (cardError) throw cardError;

    return NextResponse.json({ deck, cardCount: cards.length });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}