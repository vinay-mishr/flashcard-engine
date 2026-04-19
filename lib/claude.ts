interface GeneratedCard {
  front: string;
  back: string;
  category?: string;
  hint?: string | null;
}

interface ClaudeResponse {
  content?: { text: string }[];
  error?: { message: string };
}

export async function generateFlashcards(pdfText: string, deckName: string): Promise<GeneratedCard[]> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: `You are an expert educator creating flashcards for a student studying "${deckName}".

Analyze this educational content and create a comprehensive set of flashcards.

CONTENT:
${pdfText.slice(0, 15000)}

Create 15-25 flashcards covering:
- Key definitions and concepts
- Important formulas or rules
- Cause-and-effect relationships
- Edge cases and exceptions
- Worked examples (show the problem on front, solution on back)
- "Why" questions (not just "what")

Return ONLY a JSON array. No markdown, no explanation. Format:
[
  {
    "front": "Clear, specific question",
    "back": "Concise, complete answer",
    "category": "Definition|Formula|Concept|Example|Relationship",
    "hint": "Optional subtle hint (or null)"
  }
]

Rules:
- Questions should require active recall, not just recognition
- Answers should be 1-3 sentences max
- Cover breadth AND depth
- Include at least 3 worked examples if the content has them`
      }]
    }),
  });

  const data = await response.json() as ClaudeResponse;
  console.log('Claude API status:', response.status);

  if (!response.ok) {
    throw new Error(`Claude API error: ${data.error?.message ?? response.statusText}`);
  }

  if (!data.content || data.content.length === 0) {
    throw new Error('Claude returned empty content');
  }

  const text = data.content[0].text;

  try {
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean) as GeneratedCard[];
  } catch {
    const match = text.match(/\[[\s\S]*\]/);
    return match ? JSON.parse(match[0]) as GeneratedCard[] : [];
  }
}