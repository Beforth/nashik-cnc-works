import { prisma } from '@/src/lib/db';

export const FEEDBACK_RATINGS = ['Excellent', 'Very Good', 'Average', 'Poor', 'Terrible'] as const;

export type FeedbackPayload = {
  rating: string;
  name: string;
  message: string;
};

const MAX_LEN = {
  name: 200,
  message: 10_000,
};

/**
 * Validates and inserts a feedback row. Used by the public API route and the server action.
 */
export async function persistFeedback(
  input: FeedbackPayload,
): Promise<{ success: true } | { success: false; error: string; status: 400 | 500 }> {
  let rating = input.rating.trim();
  let name = input.name.trim().slice(0, MAX_LEN.name);
  let message = input.message.trim().slice(0, MAX_LEN.message);

  if (!rating || !(FEEDBACK_RATINGS as readonly string[]).includes(rating)) {
    return { success: false, error: 'Please select a rating.', status: 400 };
  }
  if (!name) {
    return { success: false, error: 'Please enter your name.', status: 400 };
  }

  try {
    await prisma.feedback.create({
      data: { rating, name, message },
    });
    return { success: true };
  } catch (e) {
    console.error('[persistFeedback]', e);
    const msg = e instanceof Error ? e.message : String(e);
    const missingTable = /does not exist|relation.*["']?Feedback|no such table.*feedback|Unknown table ['"]Feedback/i.test(
      msg,
    );
    return {
      success: false,
      error: missingTable
        ? 'Feedback storage is not set up yet (database migration required). Please contact the site owner or try again later.'
        : 'Could not save your feedback. Please try again or call us directly.',
      status: 500,
    };
  }
}
