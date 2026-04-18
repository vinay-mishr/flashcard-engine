export interface SM2State {
  ease_factor: number;      // starts at 2.5
  interval_days: number;    // days until next review
  repetitions: number;      // consecutive successful reviews
  next_review_at: string;
  status: 'new' | 'learning' | 'review' | 'mastered';
}

// quality: 0=blackout, 1=wrong, 2=wrong but remembered, 
//          3=correct hard, 4=correct, 5=perfect
export function calculateNextReview(state: SM2State, quality: 0|1|2|3|4|5): SM2State {
  let { ease_factor, interval_days, repetitions } = state;

  if (quality < 3) {
    // Failed — reset
    repetitions = 0;
    interval_days = 1;
  } else {
    // Passed
    if (repetitions === 0) {
      interval_days = 1;
    } else if (repetitions === 1) {
      interval_days = 6;
    } else {
      interval_days = Math.round(interval_days * ease_factor);
    }
    repetitions += 1;
  }

  // Update ease factor (minimum 1.3)
  ease_factor = Math.max(
    1.3,
    ease_factor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
  );

  const next = new Date();
  next.setDate(next.getDate() + interval_days);

  const status = 
    repetitions === 0 ? 'learning' :
    interval_days >= 21 ? 'mastered' :
    interval_days >= 7 ? 'review' : 'learning';

  return {
    ease_factor,
    interval_days,
    repetitions,
    next_review_at: next.toISOString(),
    status
  };
}