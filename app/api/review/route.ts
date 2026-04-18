import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { calculateNextReview } from '@/lib/sm2';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { card_id, quality } = await req.json(); // quality: 0-5

  const { data: progress } = await supabase
    .from('card_progress')
    .select('*')
    .eq('card_id', card_id)
    .single();

  if (!progress) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const next = calculateNextReview(progress, quality);

  const { error } = await supabase
    .from('card_progress')
    .update({ ...next, last_reviewed_at: new Date().toISOString() })
    .eq('card_id', card_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, next });
}
