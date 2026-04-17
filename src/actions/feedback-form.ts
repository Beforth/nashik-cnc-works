'use server';

import { persistFeedback } from '@/src/lib/feedback-persistence';
import type { FeedbackFormState } from '@/src/types/feedback-form-state';

/**
 * Next.js server action: runs on the server with direct DB access (same logic as POST /api/feedback).
 */
export async function submitFeedbackForm(
  _prev: FeedbackFormState,
  formData: FormData,
): Promise<FeedbackFormState> {
  const rating = String(formData.get('rating') ?? '').trim();
  const name = String(formData.get('name') ?? '').trim();
  const message = String(formData.get('message') ?? '').trim();

  const result = await persistFeedback({ rating, name, message });
  if (!result.success) {
    return { ok: false, error: result.error };
  }
  return { ok: true, error: '' };
}
